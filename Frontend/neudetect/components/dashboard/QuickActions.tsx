import Link from "next/link";
import Card from "@/components/ui/Card";

const actions = [
  {
    title: "Upload New MRI",
    description: "Analyze a new brain MRI scan.",
    link: "/upload",
  },
  {
    title: "View History",
    description: "Review previous MRI analyses.",
    link: "/history",
  },
  {
    title: "Profile",
    description: "Manage your account details.",
    link: "/profile",
  },
];

export default function QuickActions() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">

      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.link}
        >
          <Card hover>

            <h3 className="text-lg font-bold text-slate-900">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {action.description}
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-600">
              Open →
            </p>

          </Card>
        </Link>
      ))}

    </div>
  );
}