type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50
        px-6
        py-12
        text-center
      "
    >

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-blue-50
          text-2xl
        "
      >
        🧠
      </div>


      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>


      <p className="mt-2 max-w-md text-sm text-slate-600">
        {description}
      </p>


    </div>
  );
}