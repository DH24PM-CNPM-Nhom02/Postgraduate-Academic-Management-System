export const MISSING_PROFILE_VALUE = "Chưa cập nhật";

const dateFormat = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

export function formatProfileDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date);
}

export function formatProfileGender(value?: string | null) {
  if (value === "NAM") return "Nam";
  if (value === "NU") return "Nữ";
  return null;
}

export function ProfileDetails({
  items,
}: {
  items: { label: string; value?: string | number | null }[];
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
          <dd className="mt-1 text-sm break-words text-foreground">{value === "" ? MISSING_PROFILE_VALUE : value ?? MISSING_PROFILE_VALUE}</dd>
        </div>
      ))}
    </dl>
  );
}
