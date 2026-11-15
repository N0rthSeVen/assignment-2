import ApiContactForm from "@/components/ApiContactForm";

export default function ContactMe() {
  return (
    <div className="w-full px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Contact (API)
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Send me a message — this form goes through the /api/contact JSON API.
        </p>
        <div className="mt-10 rounded-xl border border-zinc-200 p-6 sm:p-8 dark:border-zinc-800">
          <ApiContactForm />
        </div>
      </div>
    </div>
  );
}
