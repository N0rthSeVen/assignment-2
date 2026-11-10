import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "About Me" };

const experience = [
  {
    role: "Data Analyst Intern",
    org: "Wefluens (influencer marketing agency)",
    period: "Jul – Sep 2026 · Remote",
    detail:
      "Built internal tooling that collects campaign performance data and turns it into client-ready reports.",
  },
  {
    role: "Business Analyst Intern",
    org: "Capgemini · Beijing",
    period: "Earlier internship",
    detail: "Built Power BI and Tableau dashboards and supported a migration of 20,000+ CRM records.",
  },
  {
    role: "Industry Research Intern",
    org: "SCGC",
    period: "Earlier internship",
    detail:
      "Analyzed 16,000+ data points and co-wrote three sector reports on apparel retail, travel retail and energy.",
  },
];

const skills = [
  { group: "Languages", items: ["Python", "SQL", "R", "TypeScript (learning)"] },
  { group: "Analytics", items: ["pandas", "Tableau", "Power BI", "Excel"] },
  { group: "Modeling", items: ["Linear & integer programming (PuLP)", "Regression", "Machine learning"] },
  { group: "Tools", items: ["Git & GitHub", "Jupyter", "Next.js", "Coding agents"] },
];

export default function AboutMePage() {
  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="About me"
        title="Business analytics, with a builder's mindset"
        description="I'm Xipeng Ma — most people call me Mars. I'm finishing my MSBA at Santa Clara University and focusing on data analytics, with longer-term interests in quantitative finance and AI."
      />

      <section>
        <h2 className="mb-4 text-xl font-semibold">Education</h2>
        <div className="rounded-xl border border-stone-200 bg-white p-5">
          <p className="font-semibold">M.S. in Business Analytics — Santa Clara University</p>
          <p className="text-sm text-stone-500">Expected December 2026 · Dean&apos;s List, Spring 2026</p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Experience</h2>
        <ol className="space-y-4">
          {experience.map((item) => (
            <li key={item.role + item.org} className="rounded-xl border border-stone-200 bg-white p-5">
              <p className="font-semibold">
                {item.role} · <span className="font-normal">{item.org}</span>
              </p>
              <p className="text-sm text-stone-500">{item.period}</p>
              <p className="mt-2 text-stone-600">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Skills</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <div key={skill.group} className="rounded-xl border border-stone-200 bg-white p-5">
              <dt className="font-semibold">{skill.group}</dt>
              <dd className="mt-1 text-stone-600">{skill.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/projects">See my projects</ButtonLink>
        <ButtonLink href="/contact-me-server-form" variant="secondary">
          Contact me
        </ButtonLink>
      </div>
    </div>
  );
}
