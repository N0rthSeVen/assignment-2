# Prompt Log & Incremental Development Walkthrough

This document records the step-by-step AI-assisted development process for the modern portfolio web application built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. It reflects the iterative prompts, code refactoring decisions, Git commit history, and manual verification/critique logs.

---

## 1. Step-by-Step Prompt History & Commit Mapping

### Step 1: Project Scaffolding
* **Objective:** Initialize the Next.js 16 project structure with TypeScript, Tailwind CSS, and App Router layout conventions.
* **Prompt:**
  > "Hey! I'm starting a personal portfolio project. Could you help me set up a fresh Next.js 16 app with TypeScript, Tailwind CSS, and the App Router? Let's make sure we have basic folders like `app`, `components`, and `lib` ready."
* **Result & Commit:** Scaffolded Next.js base app with basic layout and routing structure (`commit 3d08a4d`).

---

### Step 2: Font Configuration & Reusable UI Components
* **Objective:** Remove external web font dependencies in favor of system fonts and extract modular UI components (`NavBar`, `PageHeader`, `ProjectCard`, `ButtonLink`).
* **Prompt:**
  > "Thanks! Before we build the pages, let's clean up the layout. Please switch the main font to native system fonts instead of loading external Google fonts in `layout.tsx`. Also, create shared UI components under `components/` like `NavBar`, `PageHeader`, `ProjectCard`, and `ButtonLink` so we can reuse them easily."
* **Result & Commit:** Refactored font configuration, added core UI components under `components/` (`commit 3d08a4d`).

---

### Step 3: Page Routes & Dynamic Project Slug Navigation
* **Objective:** Build Home (`/`), About Me (`/about-me`), Projects (`/projects`), and dynamic routes (`/projects/[slug]`) linked to `lib/projects.ts`, complete with custom `notFound()` logic.
* **Prompt:**
  > "Now let's build the project routes. Create the main landing page, about page, project list page, and a dynamic route at `/projects/[slug]` that loads data from `lib/projects.ts`. If a slug doesn't exist, call `notFound()` to display a custom not-found page under `app/projects/[slug]/not-found.tsx`."
* **Result & Commit:** Created core pages, dynamic routing logic, and slug-specific 404 pages (`commit 595c057`).

---

### Step 4: HTTP 404 Header Fix (Disabling Experimental Streaming Cache)
* **Objective:** Fix a bug where invalid project slugs rendered the 404 page UI but returned an `HTTP 200 OK` status code due to early stream headers.
* **Prompt:**
  > "I ran a `curl` check on `/projects/invalid-slug` after building the app, and noticed a bug. Even though it shows the not-found UI, the HTTP response status is actually 200 OK because of streaming. Could you update `next.config.ts` to disable `cacheComponents` and `partialPrefetching` so invalid project URLs return a real HTTP 404 status?"
* **Result & Commit:** Disabled experimental caching options in `next.config.ts` to ensure strict `404 Not Found` response headers (`commit 595c057`).

---

### Step 5: Server Actions Contact Form UI
* **Objective:** Create the server-rendered contact form UI under `/contact-me-server-form`.
* **Prompt:**
  > "Let's move on to the contact page at `/contact-me-server-form`. Build a server-rendered contact form using Next.js Server Actions to handle input fields for name, email, and message."
* **Result & Commit:** Added form page component and Server Action integration (`commit ede10d2`).

---

### Step 6: Step-by-Step Rule Validation (Avoiding Complex Regex)
* **Objective:** Replace cryptic regex email validation with clear, explicit step-by-step rules in `lib/contact/validation.ts`.
* **Prompt:**
  > "The complex regex for email validation is a bit messy and hard to maintain. Let's rewrite `lib/contact/validation.ts` to use explicit step-by-step rules instead: trim all inputs first, ensure there's no internal whitespace, verify there is exactly one `@` symbol, check for a non-empty username before `@`, and confirm the domain has valid dot-separated parts. Also make sure name and message are non-empty."
* **Result & Commit:** Implemented rule-based validation logic with support for unit test verification (`commit ede10d2`).

---

### Step 7: Atomic JSON Persistence & Write Queue
* **Objective:** Ensure thread-safe JSON file writes to `data/contact-submissions.json` via write queuing, atomic file renaming, and error recovery for corrupted files.
* **Prompt:**
  > "Now let's safely persist valid submissions to `data/contact-submissions.json`. To avoid file corruption or race conditions from concurrent writes, implement a write queue and atomic file saves in `lib/contact/store.ts` by writing to a temporary file first and then renaming it. If the JSON file happens to be corrupted, log the error on the server and preserve the file instead of wiping it out."
* **Result & Commit:** Implemented atomic store logic in `lib/contact/store.ts` (`commit ede10d2`).

---

### Step 8: Multi-state Form UI Feedback
* **Objective:** Connect the form UI with `lib/contact/form-state.ts` to render explicit state feedback (`success`, `validation-error`, `save-failure`).
* **Prompt:**
  > "Let's polish the `ContactForm` UI so users get clear feedback. Make sure it explicitly handles and displays distinct UI banners for validation errors, backend save failures, and successful submissions."
* **Result & Commit:** Enhanced `ContactForm.tsx` with dedicated alert banners for each state (`commit ede10d2`).

---

### Step 9: Documentation & Verification Summary
* **Objective:** Create the `README.md` file and finalize `PROMPT_LOG.md`.
* **Prompt:**
  > "Everything works great now! Let me wrap up by adding a simple `README.md` with setup instructions, and a `PROMPT_LOG.md` that summarizes our prompts, git commits, and critique examples explaining how we tested the HTTP 404 header, email validation edge cases, and file error handling."
* **Result & Commit:** Finalized project documentation and log records.

---

## 2. Technical Critiques & Manual Verifications

### Critique 1: Cache Components Caused Invalid Slugs to Return HTTP 200 — `next.config.ts` (`commit 595c057`)
* **Problem:** With `cacheComponents` and `partialPrefetching` enabled, requests to invalid routes like `/projects/does-not-exist` streamed the page shell early, causing the HTTP status code to be **200 OK** despite rendering "Project not found".
* **Solution:** Removed both experimental flags from `next.config.ts`.
* **Agent's Check:** Ran `curl -I` on all project routes after running `npm run build && next start`. Before the fix, invalid slugs returned `200`. After the fix, invalid slugs returned `404` while valid slugs returned `200`.
* **Developer Check & Outcome:** Executed `curl -I http://localhost:3000/projects/non-existent-slug` in terminal. Confirmed status header `HTTP/1.1 404 Not Found`.

---

### Critique 2: Explicit Email Validation Rules — `lib/contact/validation.ts` (`commit ede10d2`)
* **Problem:** Traditional single-line regular expressions are prone to false positives/negatives and catastrophic backtracking.
* **Solution:** Refactored `validateContactInput()` into explicit sequential checks:
  1. Trim whitespace from all string fields.
  2. Reject inputs with internal whitespace in the email address.
  3. Require exactly one `@` symbol.
  4. Require non-empty text before `@`.
  5. Require a domain containing at least one dot where no segment between dots is empty.
* **Agent's Check:** Executed test suite against 21 boundary cases (e.g., `a@b.co`, `pad@ex.com  `, `a@b`, `a@.com`, `@b.com`, `a@@b.com`). All 21 cases passed as expected.
* **Developer Check & Outcome:** Submitted test strings (`a@b`, `  pad@ex.com  `, and blank fields) into the live `/contact-me-server-form` interface; verified that error banners accurately identified invalid formats.

---

### Critique 3: Safe Atomic Writes & Corruption Fallback — `lib/contact/store.ts` (`commit ede10d2`)
* **Problem:** Concurrent submissions could overwrite each other (Race Condition), and server crashes during write operations could result in invalid/corrupted JSON files.
* **Solution:** 
  1. Implemented an asynchronous queue to serialize write requests.
  2. Used atomic file writes (write payload to `contact-submissions.json.tmp`, then atomically `rename` over target).
  3. Added corrupted file fallback: if reading `contact-submissions.json` fails due to syntax errors (e.g., `{broken`), the server logs the error, preserves the broken file for debugging, and returns a `save-failure` response without data destruction.
* **Agent's Check:** Sent 4 concurrent POST requests to the live server (1 valid, 3 invalid). Only 1 record was written. Manually corrupted `contact-submissions.json` with `{broken` and resubmitted; verified the server logged the error and preserved the broken file without wiping it.
* **Developer Check & Outcome:** Verified new records appended safely inside `data/contact-submissions.json` upon submitting valid data through the form.