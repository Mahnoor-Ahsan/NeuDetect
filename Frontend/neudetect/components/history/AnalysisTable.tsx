import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const history = [
  {
    date: "29 Jul 2026",
    patient: "Ali Khan",
    prediction: "Glioma",
    confidence: "98.4%",
    status: "Completed",
  },
  {
    date: "28 Jul 2026",
    patient: "Sara Ahmed",
    prediction: "Meningioma",
    confidence: "96.7%",
    status: "Completed",
  },
  {
    date: "27 Jul 2026",
    patient: "Ahmed Ali",
    prediction: "No Tumor",
    confidence: "99.1%",
    status: "Completed",
  },
];

export default function AnalysisTable() {
  return (
    <Card className="mt-10 overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Date
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Patient
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Prediction
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Confidence
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Status
            </th>

            <th className="px-6 py-4"></th>
          </tr>
        </thead>

        <tbody>
          {history.map((item) => (
            <tr
              key={item.date + item.patient}
              className="border-b border-slate-100 transition hover:bg-slate-50"
            >
              <td className="px-6 py-5 text-slate-600">
                {item.date}
              </td>

              <td className="px-6 py-5 font-medium text-slate-900">
                {item.patient}
              </td>

              <td className="px-6 py-5 font-semibold text-slate-900">
                {item.prediction}
              </td>

              <td className="px-6 py-5 text-slate-700">
                {item.confidence}
              </td>

              <td className="px-6 py-5">
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-5">
                <Button>
                  View Report
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}