# Prompt Log & Code Critique — Assignment 2 Part 1

**Agent used:** Claude (Anthropic). Viber was not available on Nov 9, 2026: the class promo code `ISBA2438STUDENTVIBERS1` returned "This AI promo code has expired", and isba2438.ajchan.io showed "Enrollment required". I emailed the instructor about both problems before I started building.

## Major prompts and resulting changes

| # | My prompt (summary) | What the agent did | Commit |
|---|---|---|---|
| 1 | Shared the Assignment 2 handout and asked the agent to complete Part 1. | Read the requirements and the rubric, and checked the Next.js 16 docs bundled in `node_modules/next/dist/docs`. | — |
| 2 | Since the instructor would not reply in time, asked the agent to build Part 1 with Claude. | Scaffolded the app with `create-next-app` (TypeScript, Tailwind, App Router). | `3d08a4d` |
| 3 | (same request) Four pages plus dynamic project routes. | Added Home, About Me, Projects and `/projects/[slug]`, with shared components and a project-specific not-found page. Removed Cache Components so unknown slugs return 404. Switched to system fonts. | `595c057` |
| 4 | (same request) Server contact form that saves to JSON. | Added the Server Action, validation, JSON store and form UI with success, validation-error and save-failure states. | `ede10d2` |

<!-- TODO (Mars): add any later prompts, e.g. content edits to About Me or projects, with their commits. -->

## Critique examples

> **TODO (Mars):** For each example, fill in "My decision", "Why" and "My check". Before you write anything there, run the check yourself in the browser. The "Agent's check" lines are the checks Claude ran, with their actual output.

### 1. Cache Components made unknown project slugs return HTTP 200 — `next.config.ts`, commit `595c057`

- **What the agent proposed:** The scaffold turned on `cacheComponents` and `partialPrefetching`. With those settings, `/projects/does-not-exist` showed "Project not found", but the HTTP status was **200**, because the page shell had already been streamed. The agent proposed removing both options so `notFound()` returns a real 404.
- **Agent's check:** Ran `curl` on each route after `npm run build && next start`. Before the change, the unknown slug returned `200`. After the change, it returns `404` and the body contains "Project not found" and "Back to all projects". Both valid slugs return `200` with different titles.
- **My decision:** _TODO (accepted / changed / rejected)_
- **Why:** _TODO_
- **My check and outcome:** _TODO (e.g. "Opened /projects/abc in Chrome; the DevTools Network tab showed 404 and the page showed …")_

### 2. Email validation written as explicit rules instead of a regex — `lib/contact/validation.ts`, commit `ede10d2`

- **What the agent proposed:** Instead of one long regex, check each rule from the handout in order: no whitespace, exactly one `@`, non-empty text before the `@`, and a domain with at least one dot where no part is empty. Name, email and message are trimmed first.
- **Agent's check:** Ran a script with 21 cases. It accepted `a@b.co`, `first.last@example.com`, `x@sub.domain.org` and `"  pad@ex.com  "` (trimmed). It rejected `""`, `a@b`, `a@.com`, `a@b.`, `a@b..com`, `a b@c.com`, `a@@b.com`, `@b.com`, `a@b@c.com`, `ab.com`, `a@b .com` and `a@<tab>b.com`, as well as blank or whitespace-only names and messages. **Result: all 21 cases passed.**
- **My decision:** _TODO_
- **Why:** _TODO_
- **My check and outcome:** _TODO (submit `a@b` and a name made of spaces on the page and describe what you see)_

### 3. Safe JSON writes and a separate save-failure message — `lib/contact/store.ts` and `actions.ts`, commit `ede10d2`

- **What the agent proposed:** Queue writes so that two submissions arriving at the same time can't overwrite each other. Write to a temporary file and rename it into place. If the save fails, show a different message than for validation errors.
- **Agent's check:** POSTed the real form to the running server four times: one valid submission and three invalid ones. The JSON file went from 0 to **1** record, so only the valid submission was saved. Then the agent replaced the file with invalid JSON (`{broken`) and submitted again. The page showed "Sorry, your message couldn't be saved…", the server logged the error, and the broken file was **left unchanged** rather than overwritten.
- **My decision:** _TODO_
- **Why:** _TODO_
- **My check and outcome:** _TODO (send a valid message and confirm a new record in data/contact-submissions.json)_
