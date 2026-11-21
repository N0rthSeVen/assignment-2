"use client";

import ContactSubmissionList from "@/components/ContactSubmissionList";
import { useContactSubmissions } from "@/lib/contact/useContactSubmissions";

export default function AdminContactsPage() {
  const { submissions, loadFailed, updateSubmission, removeSubmission } =
    useContactSubmissions();

  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Manage Contact Submissions
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Review, edit, and delete the messages sent through your contact
          forms.
        </p>

        <section className="mt-10">
          <ContactSubmissionList
            submissions={submissions}
            loadFailed={loadFailed}
            onUpdated={updateSubmission}
            onDeleted={removeSubmission}
          />
        </section>
      </div>
    </div>
  );
}
