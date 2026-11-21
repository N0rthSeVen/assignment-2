"use client";

import { useEffect, useState } from "react";
import type { Application } from "@/lib/applications/store";
import ApplicationForm from "@/components/ApplicationForm";
import ApplicationList from "@/components/ApplicationList";

type ApplicationsApiResponse = {
  ok?: boolean;
  applications?: Application[];
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");
        const body = (await response.json()) as ApplicationsApiResponse;
        if (cancelled) {
          return;
        }
        if (response.status === 200 && body.ok && body.applications) {
          setApplications(body.applications);
          setLoadFailed(false);
        } else {
          setLoadFailed(true);
        }
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
        }
      }
    }
    loadApplications();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleCreated(application: Application) {
    setApplications((previous) =>
      previous
        ? [application, ...previous].sort((a, b) =>
            b.createdAt.localeCompare(a.createdAt)
          )
        : previous
    );
  }

  function handleUpdated(application: Application) {
    setApplications((previous) =>
      previous
        ? previous.map((item) =>
            item.id === application.id ? application : item
          )
        : previous
    );
  }

  function handleDeleted(id: string) {
    setApplications((previous) =>
      previous ? previous.filter((item) => item.id !== id) : previous
    );
  }

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Job Applications
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Track the roles you have applied to, from first application to final
          decision.
        </p>

        <div className="mt-10">
          <ApplicationForm onCreated={handleCreated} />
        </div>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          All applications
        </h2>
        <ApplicationList
          applications={applications}
          loadFailed={loadFailed}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      </div>
    </div>
  );
}
