type LoadingSpinnerProps = {
  text?: string;
};

export default function LoadingSpinner({
  text = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">

      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-slate-200
          border-t-blue-600
        "
      />

      <p className="text-sm text-slate-600">
        {text}
      </p>

    </div>
  );
}