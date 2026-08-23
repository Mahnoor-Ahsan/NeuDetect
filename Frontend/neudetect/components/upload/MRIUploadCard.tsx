"use client";

import { useEffect, useRef, useState } from "react";

type MRIUploadCardProps = {
  file: File | null;
  onFileSelect: (file: File | null) => void;
};

const MAX_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function MRIUploadCard({
  file,
  onFileSelect,
}: MRIUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function validateFile(selectedFile: File) {
    setError("");

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG, or WebP MRI image.");
      return false;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError("Image must be smaller than 10 MB.");
      return false;
    }

    return true;
  }

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    if (validateFile(selectedFile)) {
      onFileSelect(selectedFile);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    onFileSelect(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setError("");
  }

  function replaceFile() {
    inputRef.current?.click();
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed
            p-8 text-center transition-all duration-200 sm:p-10
            ${
              isDragging
                ? "border-blue-600 bg-blue-50"
                : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
            }
          `}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M12 16V4" />
              <path d="M7 9l5-5 5 5" />
              <path d="M5 20h14" />
            </svg>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            Upload brain MRI
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Drag and drop your MRI image here, or click to browse your
            computer.
          </p>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current?.click();
            }}
            className="mt-5 inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Choose MRI image
          </button>

          <p className="mt-4 text-xs text-slate-400">
            JPG, PNG or WebP · Maximum 10 MB
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Selected brain MRI preview"
                className="h-full w-full object-contain"
              />
            )}

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              MRI selected
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Selected MRI
                </p>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={replaceFile}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Replace image
              </button>

              <button
                type="button"
                onClick={removeFile}
                className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                Remove image
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <svg
            className="mt-0.5 shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>

          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <svg
          className="mt-0.5 shrink-0 text-slate-500"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>

        <p className="text-xs leading-5 text-slate-500">
          NeuDetect provides AI-assisted analysis for research and
          decision-support purposes. It does not replace professional
          medical diagnosis.
        </p>
      </div>
    </div>
  );
}