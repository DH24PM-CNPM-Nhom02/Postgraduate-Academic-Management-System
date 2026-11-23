"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

export function SupervisorSelect<T extends string>({
  id,
  label,
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  invalid,
}: {
  id?: string;
  label?: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T | null;
  onValueChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <Select
      items={options}
      value={value}
      disabled={disabled}
      modal={false}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next);
      }}
    >
      <SelectTrigger className="h-10 w-full bg-background" id={id} aria-label={label} aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
