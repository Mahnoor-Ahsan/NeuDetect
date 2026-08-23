type StatCardProps = {
  title: string;
  value: string;
  description?: string;
};

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>


      <h3 className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </h3>


      {description && (
        <p className="mt-2 text-sm text-slate-600">
          {description}
        </p>
      )}

    </div>
  );
}