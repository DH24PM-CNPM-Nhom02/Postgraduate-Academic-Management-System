import { describe, expect, it } from 'vitest';
import {
  calculateEvaluationSummary,
  deserializeFormContent,
  serializeFormContent,
  validateEvaluationScore,
} from './evaluation.util.js';

describe('Evaluation Util - [S5-04] Validate Điểm số', () => {
  it('hợp lệ với các điểm số nguyên từ 0 đến 10', () => {
    expect(validateEvaluationScore(0)).toBe(true);
    expect(validateEvaluationScore(5)).toBe(true);
    expect(validateEvaluationScore(7)).toBe(true);
    expect(validateEvaluationScore(10)).toBe(true);
  });

  it('hợp lệ với các điểm số có tối đa 1 chữ số thập phân', () => {
    expect(validateEvaluationScore(0.0)).toBe(true);
    expect(validateEvaluationScore(0.5)).toBe(true);
    expect(validateEvaluationScore(7.5)).toBe(true);
    expect(validateEvaluationScore(8.2)).toBe(true);
    expect(validateEvaluationScore(9.9)).toBe(true);
    expect(validateEvaluationScore(10.0)).toBe(true);
  });

  it('không hợp lệ khi điểm ngoài thang 0.0 - 10.0', () => {
    expect(validateEvaluationScore(-0.1)).toBe(false);
    expect(validateEvaluationScore(-1)).toBe(false);
    expect(validateEvaluationScore(10.1)).toBe(false);
    expect(validateEvaluationScore(15)).toBe(false);
  });

  it('không hợp lệ khi có nhiều hơn 1 chữ số thập phân', () => {
    expect(validateEvaluationScore(8.25)).toBe(false);
    expect(validateEvaluationScore(8.55)).toBe(false);
    expect(validateEvaluationScore(7.123)).toBe(false);
    expect(validateEvaluationScore(9.99)).toBe(false);
  });

  it('không hợp lệ với các giá trị phi số', () => {
    expect(validateEvaluationScore(NaN)).toBe(false);
    expect(validateEvaluationScore(Infinity)).toBe(false);
    expect(validateEvaluationScore(-Infinity)).toBe(false);
    expect(validateEvaluationScore(null as any)).toBe(false);
    expect(validateEvaluationScore(undefined as any)).toBe(false);
    expect(validateEvaluationScore('8.5' as any)).toBe(false);
    expect(validateEvaluationScore({} as any)).toBe(false);
  });
});

describe('Evaluation Util - [S5-05] Tính Điểm Trung Bình & Kiểm Tra Độ Lệch Điểm', () => {
  it('trả về rỗng khi không có phiếu nộp chính thức nào', () => {
    const summary = calculateEvaluationSummary([]);
    expect(summary.totalForms).toBe(0);
    expect(summary.submittedCount).toBe(0);
    expect(summary.averageScore).toBeNull();
    expect(summary.maxScore).toBeNull();
    expect(summary.minScore).toBeNull();
    expect(summary.scoreDifference).toBeNull();
    expect(summary.canApprove).toBe(false);
    expect(summary.isPassed).toBeNull();
  });

  it('bỏ qua phiếu nháp, chỉ tính phiếu đã nộp chính thức', () => {
    const forms = [
      { diem: 8.0, isDraft: false },
      { diem: 4.0, isDraft: true }, // Nháp, không được tính vào điểm số
      { diem: 8.5, isDraft: false },
    ];
    const summary = calculateEvaluationSummary(forms);

    expect(summary.totalForms).toBe(3);
    expect(summary.submittedCount).toBe(2);
    expect(summary.draftCount).toBe(1);
    expect(summary.scores).toEqual([8.0, 8.5]);
    expect(summary.maxScore).toBe(8.5);
    expect(summary.minScore).toBe(8.0);
    expect(summary.scoreDifference).toBe(0.5);
    expect(summary.isDifferenceExceeded).toBe(false);
    expect(summary.averageScore).toBe(8.25);
    expect(summary.canApprove).toBe(true);
  });

  it('tính đúng Max, Min, Điểm TB và cho phép Approve khi chênh lệch <= 3.0', () => {
    const forms = [
      { diem: 8.0 },
      { diem: 7.5 },
      { diem: 9.0 },
    ];
    const summary = calculateEvaluationSummary(forms);

    expect(summary.maxScore).toBe(9.0);
    expect(summary.minScore).toBe(7.5);
    expect(summary.scoreDifference).toBe(1.5);
    expect(summary.isDifferenceExceeded).toBe(false);
    // (8.0 + 7.5 + 9.0) / 3 = 24.5 / 3 = 8.1666... -> 8.17
    expect(summary.averageScore).toBe(8.17);
    expect(summary.canApprove).toBe(true);
    expect(summary.warning).toBeNull();
  });

  it('hợp lệ tại ngưỡng biên chênh lệch đúng bằng 3.0 điểm', () => {
    const forms = [
      { diem: 6.0 },
      { diem: 9.0 },
    ];
    const summary = calculateEvaluationSummary(forms);

    expect(summary.maxScore).toBe(9.0);
    expect(summary.minScore).toBe(6.0);
    expect(summary.scoreDifference).toBe(3.0);
    expect(summary.isDifferenceExceeded).toBe(false);
    expect(summary.canApprove).toBe(true);
  });

  it('phát hiện chênh lệch > 3.0 điểm, gắn cờ cảnh báo và khóa không cho Approve', () => {
    const forms = [
      { diem: 5.0 },
      { diem: 8.5 },
      { diem: 9.0 },
    ];
    const summary = calculateEvaluationSummary(forms);

    expect(summary.maxScore).toBe(9.0);
    expect(summary.minScore).toBe(5.0);
    expect(summary.scoreDifference).toBe(4.0);
    expect(summary.isDifferenceExceeded).toBe(true);
    expect(summary.canApprove).toBe(false);
    expect(summary.warning).toContain('vượt quá 3.0 điểm');
  });

  it('khóa không cho Approve tại ngưỡng chênh lệch 3.1 điểm', () => {
    const forms = [
      { diem: 6.0 },
      { diem: 9.1 },
    ];
    const summary = calculateEvaluationSummary(forms);

    expect(summary.scoreDifference).toBe(3.1);
    expect(summary.isDifferenceExceeded).toBe(true);
    expect(summary.canApprove).toBe(false);
  });

  it('kiểm tra số lượng phiếu nộp so với số thành viên yêu cầu trong hội đồng', () => {
    const forms = [
      { diem: 8.0, isDraft: false },
      { diem: 8.5, isDraft: false },
    ];
    // Yêu cầu 3 thành viên nhưng chỉ nộp 2 phiếu
    const summary = calculateEvaluationSummary(forms, 3);

    expect(summary.submittedCount).toBe(2);
    expect(summary.isDifferenceExceeded).toBe(false);
    expect(summary.canApprove).toBe(false);
    expect(summary.warning).toContain('Chưa đủ phiếu nhận xét');
  });
});

describe('Evaluation Util - [S5-06] Kiểm Tra Ngưỡng PASSED / REJECTED', () => {
  it('đạt PASSED khi Điểm TB >= 7.0', () => {
    const summary1 = calculateEvaluationSummary([{ diem: 7.0 }, { diem: 7.0 }]);
    expect(summary1.averageScore).toBe(7.0);
    expect(summary1.isPassed).toBe(true);

    const summary2 = calculateEvaluationSummary([{ diem: 8.0 }, { diem: 9.0 }]);
    expect(summary2.averageScore).toBe(8.5);
    expect(summary2.isPassed).toBe(true);
  });

  it('bị REJECTED khi Điểm TB < 7.0', () => {
    const summary1 = calculateEvaluationSummary([{ diem: 6.5 }, { diem: 6.5 }]);
    expect(summary1.averageScore).toBe(6.5);
    expect(summary1.isPassed).toBe(false);

    const summary2 = calculateEvaluationSummary([{ diem: 6.9 }, { diem: 7.0 }]);
    expect(summary2.averageScore).toBe(6.95);
    expect(summary2.isPassed).toBe(false);
  });
});

describe('Evaluation Util - Serialization & Deserialization', () => {
  it('serialize và deserialize đúng cấu trúc form nháp', () => {
    const serialized = serializeFormContent({
      isDraft: true,
      comment: 'Báo cáo cần chỉnh sửa',
      strengths: 'Chăm chỉ',
      weaknesses: 'Thiếu trích dẫn',
    });

    const parsed = deserializeFormContent(serialized);
    expect(parsed.isDraft).toBe(true);
    expect(parsed.status).toBe('DRAFT');
    expect(parsed.comment).toBe('Báo cáo cần chỉnh sửa');
    expect(parsed.strengths).toBe('Chăm chỉ');
    expect(parsed.weaknesses).toBe('Thiếu trích dẫn');
  });

  it('serialize và deserialize đúng cấu trúc form đã submit', () => {
    const serialized = serializeFormContent({
      isDraft: false,
      comment: 'Báo cáo xuất sắc',
    });

    const parsed = deserializeFormContent(serialized);
    expect(parsed.isDraft).toBe(false);
    expect(parsed.status).toBe('SUBMITTED');
    expect(parsed.comment).toBe('Báo cáo xuất sắc');
  });

  it('hỗ trợ tương thích ngược với dữ liệu chuỗi thô', () => {
    const legacyDraft = deserializeFormContent('[DRAFT] Nhận xét thử');
    expect(legacyDraft.isDraft).toBe(true);
    expect(legacyDraft.comment).toBe('Nhận xét thử');

    const legacySubmitted = deserializeFormContent('Nhận xét chuẩn');
    expect(legacySubmitted.isDraft).toBe(false);
    expect(legacySubmitted.comment).toBe('Nhận xét chuẩn');
  });
});
