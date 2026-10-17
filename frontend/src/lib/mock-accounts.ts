/**
 * Mock Accounts & Provisioned Passwords for First-time Login Demo
 * Dữ liệu tài khoản giả lập và mật khẩu cấp riêng phục vụ thử nghiệm tính năng đổi mật khẩu lần đầu
 */

export interface MockAccount {
  username: string;
  fullName: string;
  email: string;
  role: 'student' | 'supervisor' | 'academic' | 'admin';
  tempPassword: string; // Mật khẩu cấp riêng / hiện tại
  mustChangePassword: boolean; // Trạng thái bắt buộc đổi mật khẩu ở lần đầu
  isFirstLogin: boolean;
  note?: string;
  lastPasswordChangedAt?: string;
}

export const INITIAL_MOCK_ACCOUNTS: MockAccount[] = [
  {
    username: 'HV2024001',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@agu.edu.vn',
    role: 'student',
    tempPassword: 'AGU@Temp2024',
    mustChangePassword: true,
    isFirstLogin: true,
    note: 'Học viên Cao học K33 - Được cấp mật khẩu tạm lần đầu',
  },
  {
    username: 'NCS2024002',
    fullName: 'Trần Thị Mai Phương',
    email: 'phuong.tran@agu.edu.vn',
    role: 'student',
    tempPassword: 'NCS#Agu@2024',
    mustChangePassword: true,
    isFirstLogin: true,
    note: 'Nghiên cứu sinh - Mật khẩu khởi tạo từ phòng Đào tạo',
  },
  {
    username: 'GV2024003',
    fullName: 'TS. Lê Hoàng Nam',
    email: 'nam.le@agu.edu.vn',
    role: 'supervisor',
    tempPassword: 'GV#CapRieng@2024',
    mustChangePassword: true,
    isFirstLogin: true,
    note: 'Giảng viên hướng dẫn mới - Cần đổi mật khẩu khi kích hoạt',
  },
  {
    username: 'HV2023088',
    fullName: 'Phạm Quốc Huy',
    email: 'huy.pham@agu.edu.vn',
    role: 'student',
    tempPassword: 'PassDaDoi@123',
    mustChangePassword: false,
    isFirstLogin: false,
    note: 'Học viên đã đổi mật khẩu (Đăng nhập bình thường để so sánh)',
  },
];

const STORAGE_KEY = 'agu_mock_accounts_v1';

export function getMockAccounts(): MockAccount[] {
  if (typeof window === 'undefined') {
    return INITIAL_MOCK_ACCOUNTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ACCOUNTS));
      return INITIAL_MOCK_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Lỗi khi đọc mock accounts từ localStorage:', err);
    return INITIAL_MOCK_ACCOUNTS;
  }
}

export function saveMockAccounts(accounts: MockAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Lỗi khi lưu mock accounts:', err);
  }
}

export function resetMockAccounts(): MockAccount[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ACCOUNTS));
    } catch (err) {
      console.error('Lỗi khi reset mock accounts:', err);
    }
  }
  return INITIAL_MOCK_ACCOUNTS;
}

export type MockAuthResult =
  | { status: 'NOT_MOCK' }
  | { status: 'INVALID_CREDENTIALS'; message: string }
  | { status: 'FIRST_LOGIN_REQUIRED'; account: MockAccount }
  | { status: 'SUCCESS'; account: MockAccount };

/**
 * Kiểm tra xem tài khoản có nằm trong danh sách mock không
 */
export function isMockAccount(username: string): boolean {
  const accounts = getMockAccounts();
  return accounts.some(
    (acc) => acc.username.trim().toLowerCase() === username.trim().toLowerCase()
  );
}

/**
 * Xác thực tài khoản mock
 */
export function checkMockLogin(username: string, password: string): MockAuthResult {
  const accounts = getMockAccounts();
  const found = accounts.find(
    (acc) => acc.username.trim().toLowerCase() === username.trim().toLowerCase()
  );

  if (!found) {
    return { status: 'NOT_MOCK' };
  }

  if (found.tempPassword !== password) {
    return {
      status: 'INVALID_CREDENTIALS',
      message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại mật khẩu cấp riêng của bạn.',
    };
  }

  if (found.mustChangePassword) {
    return {
      status: 'FIRST_LOGIN_REQUIRED',
      account: found,
    };
  }

  return {
    status: 'SUCCESS',
    account: found,
  };
}

/**
 * Cập nhật mật khẩu mới cho tài khoản mock
 */
export function updateMockPassword(
  username: string,
  newPassword: string
): { success: boolean; message: string; account?: MockAccount } {
  const accounts = getMockAccounts();
  const index = accounts.findIndex(
    (acc) => acc.username.trim().toLowerCase() === username.trim().toLowerCase()
  );

  if (index === -1) {
    return { success: false, message: 'Không tìm thấy tài khoản trong danh sách thử nghiệm.' };
  }

  const updatedAccount: MockAccount = {
    ...accounts[index],
    tempPassword: newPassword,
    mustChangePassword: false,
    isFirstLogin: false,
    lastPasswordChangedAt: new Date().toISOString(),
  };

  accounts[index] = updatedAccount;
  saveMockAccounts(accounts);

  return {
    success: true,
    message: 'Đổi mật khẩu thành công! Tài khoản của bạn đã được kích hoạt hoàn tất.',
    account: updatedAccount,
  };
}
