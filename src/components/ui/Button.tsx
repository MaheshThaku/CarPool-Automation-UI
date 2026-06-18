import { ButtonHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function Button({
  children,
  isLoading,
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || isLoading}
      className="flex h-[62px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#E4A538] to-[#D89B2B] text-lg font-semibold text-white transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
      {...props}
    >
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          {children}
          <ArrowRight size={22} />
        </>
      )}
    </button>
  );
}