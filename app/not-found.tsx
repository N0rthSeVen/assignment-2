import ButtonLink from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-stone-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="mt-8">
        <ButtonLink href="/">Go home</ButtonLink>
      </div>
    </div>
  );
}
