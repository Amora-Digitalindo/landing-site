# Amora — Static landing site

This repository contains a simple, self-contained HTML/CSS landing site and pricing page for Amora, ready to host on GitHub Pages.

Files:

- [index.html](index.html)
- [pricing.html](pricing.html)
- [styles.css](styles.css)
- [assets/logo.svg](assets/logo.svg)

Preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Deploy to GitHub Pages (quick):

1. Create a new repository on GitHub and push this folder as the repository root.
2. In the repository Settings → Pages, set the Source to the `main` branch (root) or the `gh-pages` branch.
3. Save; your site will be published at `https://<your-username>.github.io/<repo>` (or at `https://<your-username>.github.io` for a repo named `<your-username>.github.io`).

Example git commands:

```bash
git init
git add .
git commit -m "Initial Amora landing site"
git branch -M main
git remote add origin git@github.com:USERNAME/REPO.git
git push -u origin main
```

If you prefer a project site using the `docs/` folder, move these files into a `docs/` directory and set Pages source to `main` → `/docs`.

Contact form and auto-deploy

- Contact form: The landing site includes a client-side contact form that posts to Formspree. Replace the placeholder action URL in `index.html` (the `action` on the `#contact-form`) with your Formspree form endpoint, e.g. `https://formspree.io/f/your-form-id`.

- Auto-deploy: A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. When you push to `main`, the workflow uploads the site and publishes it to GitHub Pages automatically. Ensure Pages is enabled in repository Settings → Pages and that branch protection (if any) allows the action to write Pages. You can also trigger the workflow manually from the Actions tab.
