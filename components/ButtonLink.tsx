import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "bg-stone-900 text-white hover:bg-stone-700"
      : "border border-stone-300 bg-white text-stone-900 hover:bg-stone-100";

  return (
    <Link
      href={href}
      className={`inline-block rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}
