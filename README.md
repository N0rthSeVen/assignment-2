# Assignment 2 – Portfolio Website (Part 1)

A personal portfolio built with **Next.js 16 (App Router), TypeScript and Tailwind CSS**. It has four pages, a dynamic project route, and a contact form handled on the server that saves every submission to a JSON file.

## Run it locally

```
npm install
npm run dev
```

Then open http://localhost:3000. You need Node.js 20 or newer.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page with an intro, focus areas and featured projects |
| `/about-me` | Background, education, experience and skills |
| `/projects` | List of projects |
| `/projects/[slug]` | Project details. Valid slugs are `product-inventory-cli` and `urban-logistics-optimization`. Any other slug returns HTTP 404 and a "Project not found" page that links back to `/projects`. |
| `/contact-me-server-form` | Contact form that is validated and saved on the server |

## Project structure

```
app/
  layout.tsx                      Root layout: NavBar + main + footer
  page.tsx                        Landing page
  about-me/page.tsx               About Me page
  projects/page.tsx               Project list
  projects/[slug]/page.tsx        Dynamic project page (generateStaticParams + notFound)
  projects/[slug]/not-found.tsx   Friendly 404 for unknown project slugs
  contact-me-server-form/
    page.tsx                      Contact page (renders ContactForm)
    actions.ts                    Server Action: validate -> save -> return feedback
components/                       Reusable UI: NavBar, PageHeader, ButtonLink, ProjectCard, ContactForm
lib/
  site.ts                         Site name and navigation links
  projects.ts                     Project records + getAllProjects / getProjectBySlug
  contact/validation.ts           Server-side validation rules
  contact/store.ts                Read/append submissions in data/contact-submissions.json
  contact/form-state.ts           Shape and initial value of the form's state
data/contact-submissions.json     All contact form submissions
```

The code is split by responsibility: pages live in `app/`, reusable UI in `components/`, and server logic and data in `lib/`.

## Contact form flow

1. **Page:** `app/contact-me-server-form/page.tsx` renders `components/ContactForm.tsx`.
2. **Form:** `ContactForm` is a Client Component. It binds the `<form>` to the Server Action through React's `useActionState`, which provides the latest state and a `pending` flag. The form has labeled `name`, `email` and `message` fields and uses `noValidate`, so the server makes the validation decisions.
3. **Server endpoint:** On submit, the browser POSTs the form data to the server, which runs `submitContactForm` in `app/contact-me-server-form/actions.ts` (a Server Action, marked `"use server"`).
4. **Validation:** `validateContact` in `lib/contact/validation.ts` trims each field and rejects:
   - a blank name or message (including input that is only spaces);
   - an email that contains whitespace, does not have exactly one `@`, has nothing before the `@`, or has a domain without a dot or with an empty part (`a@b`, `a@.com`, `a@b.`, `a@b..com`).
5. **Storage:** Valid input is appended to `data/contact-submissions.json` by `saveSubmission` in `lib/contact/store.ts`. Each record gets an `id`, `createdAt` and `source`. Writes are queued, and each save goes to a temporary file that is then renamed into place, so concurrent or failed saves can't corrupt the file.
6. **Feedback:** The action returns a state object. `ContactForm` shows one of three things:
   - a green success message, and the form clears;
   - red errors next to each invalid field, with the user's input kept;
   - a separate red message if the save itself failed.

## Development process

This project was built with an AI coding agent. The course's required agent, Viber, was not available while I was building it: the class promo code returned "This AI promo code has expired", and the course site showed "Enrollment required". I reported this to the instructor by email on Nov 9, 2026 and built Part 1 with Claude (Anthropic) in the meantime. Major prompts, the agent's proposals, my decisions and my checks are recorded in [PROMPT_LOG.md](PROMPT_LOG.md).
