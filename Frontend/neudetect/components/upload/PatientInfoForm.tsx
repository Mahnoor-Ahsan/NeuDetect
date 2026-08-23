"use client";

import Button from "@/components/ui/Button";

type PatientData = {
  name: string;
  age: string;
  gender: string;
};

type PatientInfoFormProps = {
  data: PatientData;
  onChange: (data: PatientData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  disabled: boolean;
};

export default function PatientInfoForm({
  data,
  onChange,
  onAnalyze,
  isAnalyzing,
  disabled,
}: PatientInfoFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          Patient details
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          Basic information
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add the basic details associated with this MRI analysis.
        </p>
      </div>

      <div className="mt-7 space-y-5">
        <div>
          <label
            htmlFor="patient-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Patient name
          </label>

          <input
            id="patient-name"
            type="text"
            value={data.name}
            onChange={(event) =>
              onChange({
                ...data,
                name: event.target.value,
              })
            }
            placeholder="Enter patient name"
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-600
              focus:ring-4
              focus:ring-blue-100
            "
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="patient-age"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Age
            </label>

            <input
              id="patient-age"
              type="number"
              min="1"
              max="120"
              value={data.age}
              onChange={(event) =>
                onChange({
                  ...data,
                  age: event.target.value,
                })
              }
              placeholder="Age"
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-600
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          <div>
            <label
              htmlFor="patient-gender"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Gender
            </label>

            <select
              id="patient-gender"
              value={data.gender}
              onChange={(event) =>
                onChange({
                  ...data,
                  gender: event.target.value,
                })
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                focus:border-blue-600
                focus:ring-4
                focus:ring-blue-100
              "
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-6">
        <Button
          type="button"
          disabled={disabled || isAnalyzing}
          onClick={onAnalyze}
          className="w-full rounded-xl py-3.5"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Analyzing MRI...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Analyze MRI
              <span aria-hidden="true">→</span>
            </span>
          )}
        </Button>

        <p className="mt-3 text-center text-xs leading-5 text-slate-400">
          Analysis may take a few seconds while the AI model processes the
          image.
        </p>
      </div>
    </div>
  );
}