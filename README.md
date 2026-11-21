# Personal Portfolio - Assignment 3

The third version of my SWE 363 portfolio. It builds on Assignments 1 and 2 and adds
sorting combined with filtering and search, remembered view settings, a visit counter
and time-on-page timer, a way to clear stored data, and performance work measured with
Lighthouse. Plain HTML, CSS, and JavaScript: no frameworks, no dependencies, no build step.

**Student:** Saad Alshahrani
**Student ID:** 202535350
**Course:** SWE 363, semester 261
**Live site:** `<add your GitHub Pages link here>`

## What changed since Assignment 2

| Area | Assignment 2 | Assignment 3 |
| ---- | ------------ | ------------ |
| Projects | Filter and search | Filter, search, and sort (newest, oldest, A to Z, Z to A), applied in one pipeline |
| Messages | Fixed "Showing X of Y" | Describes the current view, e.g. "Showing 2 of 4 team projects matching "hydro", oldest first" |
| State | Theme and visitor name | Plus chosen filter and sort, visit count, and a Forget my name button |
| Timer | None | Time on page that pauses while the tab is hidden |
| Performance | 345 KB PNG photo | 22 KB WebP with JPEG fallback, hero no longer hidden on load, unused image removed |
| Code | Card delays hard coded per card | One CSS rule that works for any number of projects |

## Features

### API integration
The GitHub section loads my six most recently updated public repositories from
`api.github.com`. It shows a loading spinner, gives up after 8 seconds, and shows a
friendly message with a Try again button for "user not found", rate limits, and lost
connections.

### Complex logic
- **Filter, search, sort.** Every change runs three steps in order: filter by type, then
  by search text, then sort. Sorting by year breaks ties alphabetically.
- **Contextual message.** The line above the list is built from the current filter,
  search text, and sort.
- **Contact form.** Each field is checked separately (not empty, valid email, message at
  least 10 characters). Submission only succeeds when all pass, and focus moves to the
  first invalid field.
- **Timer and counter.** The footer shows the visit number and the time spent on the
  page. Switching tabs pauses the timer and coming back resumes it.

### State management (localStorage)
| Key | Stores |
| --- | ------ |
| `theme` | Light or dark mode |
| `visitorName` | First name from the contact form, used in the greeting |
| `projectView` | Chosen filter and sort, as JSON |
| `visitCount` | Number of visits |

Saved values are validated when loaded, so broken or edited data falls back to defaults.

### Performance
Measured with Lighthouse (see `docs/technical-documentation.md` for scores).

## Running it locally

```bash
git clone https://github.com/xcwezr/202535350-SaadAlshahrani-assignment3.git
cd 202535350-SaadAlshahrani-assignment3
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Opening `index.html` directly also works.

### Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Settings, then Pages.
3. Source: Deploy from a branch. Branch: `main`, folder: `/ (root)`. Save.
4. The site appears at `https://xcwezr.github.io/202535350-SaadAlshahrani-assignment3/`.

## How to use the site

- Choose a type, type in the search box, or change the sort. The list updates straight
  away, and the type and sort are remembered next time.
- Press Show details on a project to expand it.
- The Dark and Light button switches theme and remembers the choice.
- After sending a message, the greeting uses your name. Press Forget my name to clear it.
- If the GitHub section shows an error, press Try again.

## Folder structure

```
.
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── projects.js      project data
│   └── script.js        all behaviour
├── assets/
│   └── images/
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## Browser support

Current Chrome, Firefox, Safari, and Edge. Uses `fetch`, `AbortController`,
`IntersectionObserver`, `Object.hasOwn`, and WebP images, all supported by these
browsers. The photo falls back to JPEG where WebP is not supported.

## AI use, in short

Claude (Anthropic) generated the Assignment 3 features, the image optimisation, and
documentation drafts from my Assignment 2 code. I reviewed, tested, and modified the
output before committing. Every AI conversation and artifact is listed in
[`docs/ai-usage-report.md`](docs/ai-usage-report.md), and AI-assisted commits carry an
`Assisted-by` line.

## License

Coursework for SWE 363 at KFUPM.
