"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactSubmission } from "./store";

type ContactApiResponse = {
  ok?: boolean;
  submissions?: ContactSubmission[];
};

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[] | null>(
    null
  );
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadSubmissions() {
      try {
        const response = await fetch("/api/contact");
        const body = (await response.json()) as ContactApiResponse;
        if (cancelled) {
          return;
        }
        if (response.status === 200 && body.ok && body.submissions) {
          setSubmissions(body.submissions);
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
    loadSubmissions();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const updateSubmission = useCallback(
    (submission: ContactSubmission) => {
      setSubmissions((previous) =>
        previous
          ? previous.map((item) =>
              item.id === submission.id ? submission : item
            )
          : previous
      );
    },
    []
  );

  const removeSubmission = useCallback((id: string) => {
    setSubmissions((previous) =>
      previous ? previous.filter((item) => item.id !== id) : previous
    );
  }, []);

  return {
    submissions,
    loadFailed,
    updateSubmission,
    removeSubmission,
    reload: () => setReloadKey((key) => key + 1),
  };
}
