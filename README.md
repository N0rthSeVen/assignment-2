# Personal Portfolio — ISBA 2438 Assignment 2

A personal portfolio built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS for Xipeng (Mars) Ma: portfolio pages with projects, a server-action contact form and a JSON contact API, and a blog with an admin page.

## Getting Started

Requires Node 20+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. A production build can be tested with `npm run build && npm run start`.

**Important:** do not run `npm run build` while `npm run dev` is running in this folder. Both share the `.next` directory (including the Turbopack cache), and concurrent runs can corrupt the dev session — observed as phantom "module has no exports" compile errors followed by an endless recompile/reload loop in the browser. Stop the dev server first.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page: short intro, buttons to `/projects` and `/contact-me-server-form`, and cards for featured projects. |
| `/about-me` | Education, experience, and skills. |
| `/projects` | Lists all projects as cards. |
| `/projects/product-inventory-cli` | Detail page for **Product Inventory CLI** (ISBA 2438 Assignment 1). |
| `/projects/urban-logistics-optimization` | Detail page for **Sustainable Urban Logistics Optimization** (ISBA 2405 Project 1). |
| `/projects/[anything-else]` | Unknown slug: `notFound()` returns a real **404 status** with the "Project not found" page and a link back to `/projects`. |
| `/contact-me-server-form` | Contact page whose form is submitted to a Server Action. |
| `/contact-me` | Contact page whose form calls the `POST /api/contact` JSON API from the browser. |
| `/blogs` | Public blog list; calls `GET /api/blogs` from the browser (newest first). |
| `/blogs/[slug]` | Blog post detail, rendered by a server component that reads the store directly. |
| `/blogs/[anything-else]` | Unknown slug: `notFound()` returns a real **404 status** with the "Post not found" page and a link back to `/blogs`. |
| `/admin/blogs` | Admin page: create posts through the API and see the list refresh (intentionally not in the NavBar). |
| `/blog-posts` | Non-permanent (307) redirect to `/blogs`, for the handout's alternate URL. |

The shared navigation bar (`components/NavBar.tsx`) highlights the active link on every route.

## Project Structure

```
assignment-2/
├── app/
│   ├── layout.tsx                      # Root layout with the NavBar
│   ├── page.tsx                        # Landing page
│   ├── about-me/page.tsx
│   ├── projects/
│   │   ├── page.tsx                    # Project list
│   │   └── [slug]/
│   │       ├── page.tsx                # Detail page (generateStaticParams + notFound())
│   │       └── not-found.tsx           # "Project not found" UI
│   ├── contact-me-server-form/
│   │   ├── page.tsx                    # Server-Action contact page
│   │   └── actions.ts                  # "use server" Server Action
│   ├── contact-me/page.tsx             # API-backed contact page
│   ├── blogs/
│   │   ├── page.tsx                    # Public blog list (browser fetch)
│   │   └── [slug]/
│   │       ├── page.tsx                # Detail page (reads the store, notFound())
│   │       └── not-found.tsx           # "Post not found" UI
│   ├── admin/blogs/page.tsx            # Admin: form + live list
│   └── api/
│       ├── blogs/route.ts              # GET (list) + POST (create)
│       ├── contact/route.ts            # POST contact submission
│       └── contacts/route.ts           # Re-exports POST from ../contact/route
├── components/
│   ├── NavBar.tsx
│   ├── ProjectCard.tsx
│   ├── ContactForm.tsx                 # Server-Action form
│   ├── ApiContactForm.tsx              # fetch-based form for /contact-me
│   ├── BlogPostForm.tsx                # fetch-based create form for /admin/blogs
│   ├── BlogPostList.tsx                # Shared list markup (loading/empty/error/list)
│   └── formStyles.ts                   # Shared Tailwind class strings for all forms
├── lib/
│   ├── projects.ts                     # Project data: getAllProjects(), getProjectBySlug()
│   ├── http.ts                         # readJsonObject() + stringField() for Route Handlers
│   ├── jsonFile.ts                     # Shared JSON-array storage (per-file write queue, temp file + rename)
│   ├── blogs/
│   │   ├── slug.ts                     # slugify()
│   │   ├── validation.ts               # validateBlogPost()
│   │   ├── store.ts                    # createBlogPost(), getAllBlogPosts(), getBlogPostBySlug()
│   │   └── useBlogPosts.ts             # Client hook: GET /api/blogs with reload
│   └── contact/
│       ├── form-state.ts               # Shared ContactFormState type
│       ├── validation.ts               # validateContactForm()
│       └── store.ts                    # appendContactSubmission()
└── data/
    ├── blogs.json                      # Committed as []; backups and temp files are gitignored
    └── contact-submissions.json        # Committed as []; backups and temp files are gitignored
```

## API

All endpoints accept and return JSON. Malformed JSON and non-object bodies return `400` with `{ ok: false, error }`; validation failures return `400` with `{ ok: false, errors }` (per-field messages). Unknown fields are ignored, and missing or non-string fields are coerced to `""` before validation.

### `POST /api/contact` (also served at `/api/contacts`)

Body: `{ "name": "...", "email": "...", "message": "..." }`

| Status | Body |
| --- | --- |
| `201` | `{ ok: true, submission: { id, name, email, message, createdAt, source: "api" } }` |
| `400` | `{ ok: false, errors: { name?, email?, message? } }` — validation failure |
| `400` | `{ ok: false, error }` — body is not valid JSON or not an object |
| `500` | `{ ok: false, error }` — saving failed |

### `POST /api/blogs`

Body: `{ "title": "...", "content": "..." }`

| Status | Body |
| --- | --- |
| `201` | `{ ok: true, post: { id, slug, title, content, createdAt } }` |
| `400` | `{ ok: false, errors: { title?, content? } }` — validation failure |
| `400` | `{ ok: false, error }` — body is not valid JSON or not an object |
| `500` | `{ ok: false, error }` — saving failed |

The `slug` is generated from the title (lowercase ASCII letters and digits, everything else collapsed to `-`); a title that slugifies to an empty string falls back to `post`. Duplicate slugs get a numeric suffix (`-2`, `-3`, …), checked inside the write queue so concurrent posts cannot collide.

### `GET /api/blogs`

Returns `200` with `{ ok: true, posts: [...] }`, newest first. Route Handlers are dynamic (uncached) by default in this Next.js version, so the list reflects posts created at runtime and is never a stale build-time snapshot. Returns `500` with `{ ok: false, error }` if reading fails.

## Blog Post Flow

1. **Admin form — `components/BlogPostForm.tsx` (client component) on `/admin/blogs`.** Keeps `title` and `content` in `useState`, `noValidate`, and on submit POSTs JSON to `/api/blogs` with `fetch` (button disabled while sending, styles from `components/formStyles.ts`).

2. **Route Handler — `app/api/blogs/route.ts`.** The body is parsed by `readJsonObject` from `lib/http.ts`: malformed JSON or a non-object body returns the shared `400 { ok: false, error }` response; every field goes through `stringField`, so a missing or non-string field becomes `""` instead of crashing validation.

3. **Validation — `lib/blogs/validation.ts`.** `validateBlogPost` trims `title` and `content`, rejects blank-after-trim values ("Title is required." / "Content is required."), and caps the title at 200 characters. Returns `{ ok: true, data }` or `{ ok: false, errors }`; the handler maps errors to `400 { ok: false, errors }`.

4. **Storage — `lib/blogs/store.ts`.** `createBlogPost` runs inside the per-file write queue from `lib/jsonFile.ts` (so simultaneous creates serialize and none are lost): it reads `data/blogs.json`, generates the slug (with `-2`/`-3` suffix for duplicates), appends `{ id, slug, title, content, createdAt }` (UUID `id`, ISO `createdAt`), and writes through a unique temp file plus an atomic `rename`. `ENOENT` means "no posts yet"; a corrupted file is backed up to `blogs.corrupt-<timestamp>.json` before starting fresh; any other read error is rethrown, which the handler turns into `500`.

5. **Admin UI update.** On `201` the form shows a green "Post created!" message linking to `/blogs/{slug}`, clears the fields, and the page refetches `GET /api/blogs` (via the `reload` from the `useBlogPosts` hook) so the new post appears in the list immediately. A `400` shows the server's per-field errors; a `500` or network error shows a red failure banner.

6. **Public list — `/blogs`.** A client page that calls `GET /api/blogs` from the browser through the `useBlogPosts` hook (`lib/blogs/useBlogPosts.ts`), with the loading / "No posts yet." / error / list states rendered by `components/BlogPostList.tsx`.

7. **Detail page — `/blogs/[slug]`.** A server component that awaits `params`, reads the post with `getBlogPostBySlug` (no HTTP round-trip), and calls `notFound()` for unknown slugs — a real `404` with the "Post not found" page from `not-found.tsx`. There is deliberately no `generateStaticParams` because posts are created at runtime; the page renders on demand, so a post created after a build still opens. Content renders with `whitespace-pre-wrap` to preserve line breaks.

## Contact Form Flow

The `/contact-me-server-form` form is handled entirely on the server. The files involved, in order:

1. **`components/ContactForm.tsx` (client component).** `useActionState(submitContactForm, initialContactFormState)` binds the form to the Server Action and exposes a `pending` flag that disables the submit button while sending. The form has `noValidate`, so browser validation is off and every rule runs on the server. Inputs are uncontrolled (`defaultValue` populated from the last returned state), so after a validation error the user's typed values are still there; on success the form remounts (via a React `key` change) and clears.

2. **Server Action — `app/contact-me-server-form/actions.ts`.** `submitContactForm(prevState, formData)` reads the raw `name`, `email`, and `message` from the submitted `FormData`, passes them to `validateContactForm`, saves valid data with `appendContactSubmission`, and returns a `ContactFormState`.

3. **Validation — `lib/contact/validation.ts`.** `validateContactForm` trims `name` and `message` and rejects either if blank after trimming. For `email` it requires: non-empty; no whitespace anywhere; exactly one `@`; non-blank text before the `@`; and a domain after the `@` that contains a dot where every dot-separated label is non-blank. It returns `{ ok: true, data }` with the trimmed values, or `{ ok: false, errors }` with per-field error messages.

4. **Storage — `lib/contact/store.ts`.** `appendContactSubmission` runs inside the per-file write queue from `lib/jsonFile.ts`, so submissions arriving at the same time are applied one after another and none are lost. Each write reads the existing JSON array, appends `{ id, name, email, message, createdAt, source: "server-form" }` (UUID `id`, ISO `createdAt`), and writes through a unique temp file followed by an atomic `rename`. A missing file (`ENOENT`) is treated as an empty list; any other read error is rethrown so the action reports a save failure instead of overwriting data. If the file exists but is corrupted (unparsable or not an array), it is first renamed to `contact-submissions.corrupt-<timestamp>.json` as a backup, then the save starts a fresh array.

5. **Returned state — `lib/contact/form-state.ts`.** The action returns `{ status, message?, errors?, values? }` where `status` is one of `idle`, `success`, `validation-error`, or `save-error`.

6. **UI states.** `success` shows a green confirmation banner and clears the form. `validation-error` shows a red per-field error under the offending input while keeping the user's values. `save-error` shows a separate red banner ("Something went wrong while saving your message. Please try again."), also keeping the user's values, clearly distinct from a successful send.

The `/contact-me` page submits through the same validation and storage via `POST /api/contact` (see the API section above) and saves with `source: "api"`, so both contact forms share `data/contact-submissions.json`.

## Midterm

- **Notes — `/notes`.** Client-only page for quick notes (title + text) persisted to `localStorage` under the key `notes`. On load, a missing key, unparsable JSON, or JSON that is not an array of well-shaped `{ id, title, text, createdAt }` objects all fall back to an empty list instead of crashing. Reads go through `useSyncExternalStore` (no hydration mismatch, plus cross-tab sync via the `storage` event); each note can be deleted.
- **Job application tracker — `/applications`.** Create form (company, role, status, applied date, notes) and cards with colored status badges (`Wishlist`, `Applied`, `Interviewing`, `Offer`, `Rejected`), plus Edit and Delete per card. Submissions are stored in `data/applications.json`.
- **Full CRUD.** Blogs, contact submissions, and projects now support create/read/update/delete end to end. Projects moved out of hardcoded data into `data/projects.json`, and the project pages render dynamically (`force-dynamic`) so runtime API changes appear immediately. Edit forms send the full record, so editing never silently blanks unshown fields.
- **Admin — `/admin`.** Hub page linking to `/admin/projects`, `/admin/blogs`, and `/admin/contacts`; each lists records with inline Edit forms and Delete buttons, plus a create form. The hub is linked from the NavBar as "Admin".

### API endpoints (midterm)

Every handler logs `[api] METHOD /path` server-side. Errors follow the repo convention: `400 { ok: false, error | errors }`, `404 { ok: false, error }`, `409 { ok: false, errors }` for a duplicate project slug.

| Endpoint | Methods |
| --- | --- |
| `/api/blogs` | GET, POST |
| `/api/blogs/[slug]` | PUT, DELETE |
| `/api/contact` | GET, POST (POST also served at `/api/contacts`) |
| `/api/contact/[id]` | GET, PUT, DELETE |
| `/api/applications` | GET, POST |
| `/api/applications/[id]` | GET, PUT, DELETE |
| `/api/projects` | GET, POST |
| `/api/projects/[slug]` | GET, PUT, DELETE |
