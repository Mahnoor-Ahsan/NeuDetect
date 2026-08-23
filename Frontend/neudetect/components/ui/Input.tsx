type InputProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
  error,
  className = "",
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-slate-900
          outline-none
          transition-all
          duration-200
          placeholder:text-slate-400

          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          }

          disabled:cursor-not-allowed
          disabled:bg-slate-100

          ${className}
        `}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}