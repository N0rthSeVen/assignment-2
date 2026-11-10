export type Project = {
  slug: string;
  title: string;
  summary: string;
  context: string;
  problem: string;
  tech: string[];
  highlights: string[];
  link?: { label: string; href: string };
};

const projects: Project[] = [
  {
    slug: "product-inventory-cli",
    title: "Product Inventory CLI",
    summary:
      "A Python command-line tool that lets a small store create, read, update and delete product records stored in a JSON file.",
    context: "ISBA 2438 · Assignment 1 · Fall 2026",
    problem:
      "Small stores often track stock in spreadsheets that are easy to break. This tool gives them a predictable, scriptable interface with strict validation, so bad input never corrupts the data.",
    tech: ["Python 3", "argparse", "JSON", "unittest", "Git"],
    highlights: [
      "Add, list, get, update and delete commands with clear exit codes (0 / 1 / 2)",
      "Atomic saves: a failed command never changes the data file or consumes an ID",
      "Custom low-stock reorder report that lists products at or below a threshold",
      "27 end-to-end tests covering validation, file errors and the full command contract",
    ],
    link: { label: "View on GitHub", href: "https://github.com/N0rthSeVen/inventory-cli" },
  },
  {
    slug: "urban-logistics-optimization",
    title: "Sustainable Urban Logistics Optimization",
    summary:
      "Optimization models that plan delivery routes and facility use for a city logistics company while balancing cost and sustainability.",
    context: "ISBA 2405 · Project 1",
    problem:
      "GreenCity Logistics needed to decide how to serve customers across the city at the lowest cost without ignoring environmental impact.",
    tech: ["Python", "PuLP", "Linear programming", "Vehicle routing"],
    highlights: [
      "Built a Haversine distance matrix from real coordinates",
      "Formulated four PuLP optimization models and compared their trade-offs",
      "Ran sensitivity analysis to show how the recommendation changes with key inputs",
      "Extended the work with a vehicle routing (VRP) bonus model and seven visualizations",
    ],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
