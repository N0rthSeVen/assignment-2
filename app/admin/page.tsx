import Link from "next/link";

const adminLinks = [
  {
    href: "/admin/projects",
    title: "Projects",
    description:
      "Create projects, update the basics, or remove ones you no longer want listed.",
  },
  {
    href: "/admin/blogs",
    title: "Blog Posts",
    description:
      "Publish new posts and edit or delete the ones already published.",
  },
  {
    href: "/admin/contacts",
    title: "Contact Submissions",
    description:
      "Review, edit, and delete the messages sent through your contact forms.",
  },
];

export default function AdminPage() {
  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Admin
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Manage the content of this site.
        </p>
        <div className="mt-10 grid gap-4">
          {adminLinks.map(({ href, title, description }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-zinc-200 p-5 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:hover:border-blue-500"
            >
              <h2 className="font-semibold text-zinc-950 dark:text-zinc-50">
                {title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
