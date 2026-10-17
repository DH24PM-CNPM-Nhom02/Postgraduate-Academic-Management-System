'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Check,
  KeyRound,
  ShieldAlert,
  ArrowRightCircle,
} from 'lucide-react';
import {
  MockAccount,
  getMockAccounts,
  resetMockAccounts,
} from '@/src/lib/mock-accounts';

interface MockAccountSwitcherProps {
  onSelectAccount: (username: string, password: string) => void;
  refreshTrigger?: number;
}

export function MockAccountSwitcher({
  onSelectAccount,
  refreshTrigger = 0,
}: MockAccountSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<MockAccount[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadAccounts = () => {
    setAccounts(getMockAccounts());
  };

  useEffect(() => {
    loadAccounts();
  }, [refreshTrigger]);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = resetMockAccounts();
    setAccounts([...res]);
  };

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="mt-4 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-3 text-xs shadow-xs transition-all">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between font-semibold text-[#155EEF]"
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#155EEF] animate-pulse" />
          <span>Danh sách tài khoản & mật khẩu cấp riêng (Dữ liệu thử nghiệm)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-normal text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
            {accounts.filter((a) => a.mustChangePassword).length} tài khoản cần đổi MK
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-2.5 pt-2 border-t border-blue-100">
          <p className="text-[11px] text-[#475467] leading-relaxed">
            Click vào nút <strong>&quot;Điền nhanh&quot;</strong> để hệ thống tự động điền mã số và mật khẩu cấp riêng vào form, sau đó bấm <strong>&quot;Đăng nhập&quot;</strong> để kiểm tra tính năng hiển thị màn hình đổi mật khẩu lần đầu:
          </p>

          <div className="space-y-2">
            {accounts.map((acc) => (
              <div
                key={acc.username}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-2.5 transition-all ${
                  acc.mustChangePassword
                    ? 'border-amber-200 bg-white hover:border-amber-300'
                    : 'border-emerald-200 bg-emerald-50/30'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172B4D]">{acc.username}</span>
                    <span className="text-[11px] text-[#475467]">({acc.fullName})</span>
                    {acc.mustChangePassword ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                        <ShieldAlert className="h-3 w-3" />
                        Chưa đổi MK lần đầu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        <Check className="h-3 w-3" />
                        Đã đổi MK
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#667085]">
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 flex items-center gap-1">
                      <KeyRound className="h-3 w-3 text-gray-500" />
                      {acc.tempPassword}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(acc.tempPassword, acc.username, e)}
                      title="Sao chép mật khẩu"
                      className="text-gray-400 hover:text-gray-700"
                    >
                      {copiedKey === acc.username ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <span className="hidden md:inline italic text-gray-400">• {acc.note}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectAccount(acc.username, acc.tempPassword)}
                    className="inline-flex items-center gap-1 rounded-md bg-[#155EEF] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs hover:bg-[#1248BC] transition-all cursor-pointer"
                  >
                    <span>Điền nhanh</span>
                    <ArrowRightCircle className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-gray-400">
              * Dữ liệu chạy hoàn toàn trên frontend (LocalStorage), không ảnh hưởng cơ sở dữ liệu.
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              title="Đặt lại mật khẩu ban đầu cho toàn bộ tài khoản thử nghiệm"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Khôi phục dữ liệu ban đầu</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
