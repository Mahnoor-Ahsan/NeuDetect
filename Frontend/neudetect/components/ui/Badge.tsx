type BadgeProps = {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info";
};

export default function Badge({
  children,
  variant = "info",
}: BadgeProps) {

  const styles = {
    success:
      "bg-green-100 text-green-700",
    
    warning:
      "bg-yellow-100 text-yellow-700",

    error:
      "bg-red-100 text-red-700",

    info:
      "bg-blue-100 text-blue-700",
  };


  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        ${styles[variant]}
      `}
    >
      {children}
    </span>
  );
}