# ExpensO Legal Pages

Static, dependency-free HTML pages for ExpensO - The Expense Organiser's legal
documents, meant to be hosted with **GitHub Pages** and linked from the Play
Console.

- `index.html` — landing page linking to all four documents
- `privacy.html` — Privacy Policy (the URL Play Console needs)
- `terms.html` — Terms & Conditions
- `data-deletion.html` — Data Deletion instructions (the URL Play Console's
  "Data safety" section needs)
- `disclosures.html` — the first-run in-app disclosure summary
- `style.css` — shared styling, no external fonts or scripts

These mirror `documentation/legal/*.md` in the main ExpensO repo. If those
change, regenerate these pages to match and bump the version/date shown at
the top of `privacy.html` / `terms.html`.

## Hosting on GitHub Pages

1. Create a new **public** GitHub repository named `expenso-privacy-policy`
   (public is required — GitHub Pages on a free plan only serves public
   repos).
2. Copy all the files in this folder into the root of that repo and push:

   ```bash
   cd expenso-privacy-policy
   git init
   git add .
   git commit -m "Add ExpensO legal pages"
   git branch -M main
   git remote add origin https://github.com/<your-username>/expenso-privacy-policy.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages** (left sidebar, under "Code and
   automation").
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
6. Wait ~1 minute, then reload the Pages settings screen — it shows the live
   URL, of the form:

   ```
   https://<your-username>.github.io/expenso-privacy-policy/
   ```

7. Verify each page loads directly:
   - `https://<your-username>.github.io/expenso-privacy-policy/privacy.html`
   - `https://<your-username>.github.io/expenso-privacy-policy/terms.html`
   - `https://<your-username>.github.io/expenso-privacy-policy/data-deletion.html`
   - `https://<your-username>.github.io/expenso-privacy-policy/disclosures.html`

## Using the links in Play Console

In **Play Console → your app → Policy → App content**:

- **Privacy policy** → paste the `privacy.html` URL.
- **Data safety → "Learn how users can request data deletion"** (or the
  equivalent field) → paste the `data-deletion.html` URL.

Both fields require a URL that is **publicly reachable without login** —
GitHub Pages satisfies this as long as the repo stays public and Pages stays
enabled.

## Keeping it in sync

Whenever `documentation/legal/*.md` changes in the main ExpensO repo (a new
policy/terms version, a new effective date), update the matching `.html`
file here, commit, and push — GitHub Pages redeploys automatically within a
minute or two. No further Play Console action is needed unless the *URL*
itself changes.
