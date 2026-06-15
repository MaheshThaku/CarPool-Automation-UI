interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[var(--primary)]"
      />

      <span className="text-sm text-[var(--text)]">{label}</span>
    </label>
  );
}
