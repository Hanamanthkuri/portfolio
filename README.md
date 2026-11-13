# Hanamanth Kuri – Portfolio

Plain HTML, CSS and vanilla JavaScript. No build step.

## Run
Open the `portfolio` folder in VS Code, right-click `index.html`, choose **Open with Live Server**.

## Structure
- `index.html` – all sections
- `css/style.css` – theme (dark/light), layout, responsive rules
- `js/script.js` – theme, typing, nav, reveal, skills, contact form
- `js/projects.js` – curated projects (from resume), filters, detail popup
- `js/github.js` – GitHub API (`fetch`), loading, error and rate-limit handling
- `assets/images/profile.png` – placeholder; replace with your photo (keep the name)
- `assets/resume/Hanamanth-Kuri-Resume.pdf` – the Download resume button

## Notes
- Projects come from your resume. Other non-fork GitHub repos are added automatically with their real description and language.
- A project's GitHub button points to its repo when a repo name contains "bank", "agri" or "learn"; otherwise to your repositories page. Edit `match` in `js/projects.js` to fix.
- The contact form opens your email app (mailto). It does not send to a server.
- Unauthenticated GitHub API calls are limited to 60/hour per IP; the page shows a retry message if that is hit.
