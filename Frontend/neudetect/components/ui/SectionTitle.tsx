type SectionTitleProps = {
  badge?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  badge,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="mb-8">

      {badge && (
        <p className="mb-3 text-sm font-semibold tracking-wide text-blue-600">
          {badge}
        </p>
      )}

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>

      {description && (
        <p className="mt-3 max-w-2xl text-slate-600">
          {description}
        </p>
      )}

    </div>
  );
}