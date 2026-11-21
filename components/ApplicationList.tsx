import type { Application } from "@/lib/applications/store";
import ApplicationCard from "./ApplicationCard";
import { failureClasses } from "./formStyles";

export default function ApplicationList({
  applications,
  loadFailed,
  onUpdated,
  onDeleted,
}: {
  applications: Application[] | null;
  loadFailed: boolean;
  onUpdated: (application: Application) => void;
  onDeleted: (id: string) => void;
}) {
  return (
    <>
      {loadFailed && (
        <p role="alert" className={`${failureClasses} mt-4`}>
          Could not load the applications. Please refresh the page.
        </p>
      )}
      {!loadFailed && applications === null && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Loading applications...
        </p>
      )}
      {applications !== null && applications.length === 0 && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          No applications yet. Add your first one using the form above.
        </p>
      )}
      {applications !== null && applications.length > 0 && (
        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </>
  );
}
