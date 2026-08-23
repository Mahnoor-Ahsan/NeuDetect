type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        ${hover ? "hover:-translate-y-1 hover:shadow-lg" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}