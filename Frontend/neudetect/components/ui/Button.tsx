type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  onClick,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 active:scale-[0.98]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-xl
        px-5 py-3
        font-semibold
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}