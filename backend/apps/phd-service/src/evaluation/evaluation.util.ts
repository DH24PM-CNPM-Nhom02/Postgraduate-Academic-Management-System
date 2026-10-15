import { EVALUATION_ERROR_CODES } from '../../../../lib/contracts/src/permissions.js';

export interface FormContentPayload {
  status: 'DRAFT' | 'SUBMITTED';
  isDraft: boolean;
  comment?: string;
  strengths?: string;
  weaknesses?: string;
}

export interface EvaluationSummaryResult {
  totalForms: number;
  submittedCount: number;
  draftCount: number;
  scores: number[];
  maxScore: number | null;
  minScore: number | null;
  scoreDifference: number | null;
  isDifferenceExceeded: boolean;
  averageScore: number | null;
  warning: string | null;
  canApprove: boolean;
  isPassed: boolean | null;
}

/**
 * Validate điểm số: Thang điểm 0.0 - 10.0 (tối đa 1 chữ số thập phân).
 * Trả về true nếu hợp lệ, false nếu không hợp lệ.
 */
export function validateEvaluationScore(score: unknown): boolean {
  if (typeof score !== 'number' || Number.isNaN(score) || !Number.isFinite(score)) {
    return false;
  }
  if (score < 0 || score > 10) {
    return false;
  }

  // Kiểm tra tối đa 1 chữ số thập phân (ví dụ: 0, 7.5, 8.0, 10 hợp lệ; 8.25, 8.55 không hợp lệ)
  const str = score.toString();
  if (str.includes('.')) {
    const decimalPart = str.split('.')[1];
    if (decimalPart.length > 1) {
      return false;
    }
  }

  return true;
}

/**
 * Serialize thông tin nhận xét, ưu/nhược điểm và trạng thái nháp vào trường nhanXet (Text) của PhieuNhanXet.
 */
export function serializeFormContent(payload: {
  isDraft?: boolean;
  comment?: string;
  strengths?: string;
  weaknesses?: string;
}): string {
  const isDraft = !!payload.isDraft;
  const data: FormContentPayload = {
    status: isDraft ? 'DRAFT' : 'SUBMITTED',
    isDraft,
    comment: payload.comment?.trim() || '',
    strengths: payload.strengths?.trim() || '',
    weaknesses: payload.weaknesses?.trim() || '',
  };
  return JSON.stringify(data);
}

/**
 * Deserialize trường nhanXet từ database thành cấu trúc chi tiết.
 */
export function deserializeFormContent(raw?: string | null): FormContentPayload {
  if (!raw) {
    return {
      status: 'SUBMITTED',
      isDraft: false,
      comment: '',
      strengths: '',
      weaknesses: '',
    };
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      const isDraft = parsed.isDraft === true || parsed.status === 'DRAFT';
      return {
        status: isDraft ? 'DRAFT' : 'SUBMITTED',
        isDraft,
        comment: parsed.comment || '',
        strengths: parsed.strengths || '',
        weaknesses: parsed.weaknesses || '',
      };
    }
  } catch {
    // Trường hợp dữ liệu thô cũ không phải JSON
  }

  const isDraft = raw.startsWith('[DRAFT]');
  return {
    status: isDraft ? 'DRAFT' : 'SUBMITTED',
    isDraft,
    comment: isDraft ? raw.replace(/^\[DRAFT\]\s*/, '') : raw,
    strengths: '',
    weaknesses: '',
  };
}

/**
 * Tính điểm trung bình & kiểm tra độ lệch điểm (BR-Evaluation):
 * - Chỉ tính trên các phiếu đã SUBMIT (bỏ qua phiếu nháp).
 * - Max(score) - Min(score).
 * - Nếu chênh lệch > 3.0 điểm: Phát cảnh báo và khóa không cho Approve (PHD_SCORE_DIFFERENCE_EXCEEDED).
 * - Nếu chênh lệch <= 3.0: Điểm TB = Tổng điểm / Số phiếu.
 * - Điểm TB >= 7.0 => PASSED, < 7.0 => REJECTED.
 */
export function calculateEvaluationSummary(
  forms: Array<{ diem: number | string | { toNumber?: () => number }; isDraft?: boolean }>,
  requiredMemberCount?: number,
): EvaluationSummaryResult {
  const totalForms = forms.length;
  const submittedForms = forms.filter((f) => !f.isDraft);
  const submittedCount = submittedForms.length;
  const draftCount = totalForms - submittedCount;

  if (submittedCount === 0) {
    return {
      totalForms,
      submittedCount: 0,
      draftCount,
      scores: [],
      maxScore: null,
      minScore: null,
      scoreDifference: null,
      isDifferenceExceeded: false,
      averageScore: null,
      warning: 'Chưa có phiếu nhận xét nào được nộp chính thức',
      canApprove: false,
      isPassed: null,
    };
  }

  const scores = submittedForms.map((f) => {
    if (typeof f.diem === 'number') return f.diem;
    if (typeof f.diem === 'object' && f.diem !== null && typeof f.diem.toNumber === 'function') {
      return f.diem.toNumber();
    }
    return Number(f.diem);
  });

  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const rawDiff = maxScore - minScore;
  const scoreDifference = Math.round(rawDiff * 10) / 10;
  const isDifferenceExceeded = scoreDifference > 3.0;

  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  const averageScore = Math.round((sum / scores.length) * 100) / 100;
  const isPassed = averageScore >= 7.0;

  const hasEnoughMembers = requiredMemberCount ? submittedCount >= requiredMemberCount : true;

  let warning: string | null = null;
  if (isDifferenceExceeded) {
    warning = `Chênh lệch điểm giữa các người chấm (${scoreDifference} điểm) vượt quá 3.0 điểm. Cần họp thống nhất lại điểm trước khi duyệt.`;
  } else if (!hasEnoughMembers) {
    warning = `Chưa đủ phiếu nhận xét từ các thành viên hội đồng (${submittedCount}/${requiredMemberCount} phiếu)`;
  }

  const canApprove = !isDifferenceExceeded && hasEnoughMembers;

  return {
    totalForms,
    submittedCount,
    draftCount,
    scores,
    maxScore,
    minScore,
    scoreDifference,
    isDifferenceExceeded,
    averageScore,
    warning,
    canApprove,
    isPassed,
  };
}
