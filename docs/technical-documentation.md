# Technical Documentation

## 1. Overview

A static portfolio site with no dependencies and no build step.

| File | Role |
| ---- | ---- |
| `index.html` | Structure, plus a short inline script that applies the saved theme before first paint |
| `css/styles.css` | Presentation, transitions, keyframe animations |
| `js/projects.js` | Project data as a `PROJECTS` array |
| `js/script.js` | All behaviour, in commented sections: storage helpers, greeting, theme, projects, GitHub, form, reveal, visit timer |

A framework is still not needed. The interactive parts are a list of four items, one API
call, one form, and a timer, which plain DOM code handles in about 400 lines.

## 2. Projects: filter, search, sort

Projects live in `js/projects.js` as objects with `title`, `year`, `tags`, `summary`,
`stack`, `role`, `image`, and `alt`. It is a script rather than JSON so the site also
works when `index.html` is opened from the file system.

`renderProjects()` runs on load and after every filter click, keystroke, or sort change:

```js
const shown = PROJECTS
  .filter((p) => activeFilter === "all" || p.tags.includes(activeFilter))
  .filter((p) => matches(p, query))
  .sort(SORTS[sortSelect.value].compare);
```

1. **Filter by type.** Keeps everything for `all`, otherwise projects whose `tags`
   include the chosen type.
2. **Filter by search.** Keeps projects whose joined title, summary, stack, and tags
   contain the search text (case insensitive).
3. **Sort.** `filter` returns a new array, so `sort` never reorders `PROJECTS` itself.

The sort options live in one `SORTS` object. Each entry has a label for the message and a
compare function:

| Key | Order | Compare |
| --- | ----- | ------- |
| `newest` | Date descending (year and month), then title A to Z | `dateValue(b) - dateValue(a) \|\| a.title.localeCompare(b.title)` |
| `oldest` | Date ascending, then title A to Z | `dateValue(a) - dateValue(b) \|\| a.title.localeCompare(b.title)` |
| `az` | Title A to Z | `a.title.localeCompare(b.title)` |
| `za` | Title Z to A | `b.title.localeCompare(a.title)` |

dateValue() turns a project’s date into a number of months (year * 12 + month), so year and month compare as one number. A missing month counts as 0

When two years are equal, the subtraction gives `0`, so `||` falls through to the title
comparison. Adding a new sort means adding one entry to `SORTS` and one `<option>`.

`describeView()` builds the message above the list from the same state, for example
`Showing 2 of 4 team projects matching "hydro", oldest first`. When nothing matches, the
empty state with a Clear filters button is shown instead of the list.

Project text is written with `textContent`, never `innerHTML`.

## 3. State management

All storage goes through `load()`, `save()`, and `remove()`, which wrap `localStorage`
in `try/catch` because it can throw when storage is blocked.

| Key | Value | Written when | Read when |
| --- | ----- | ------------ | --------- |
| `theme` | `light` or `dark` | Theme button pressed | Page load (inline script in `<head>`) |
| `visitorName` | First name | Valid form submitted | Greeting update |
| `projectView` | `{"filter": "team", "sort": "oldest"}` | Filter or sort changed | Page load |
| `visitCount` | Number as text | Every page load | Page load |

**Validation on load.** `loadView()` parses `projectView` inside `try/catch`, then only
accepts a filter that is one of the chip values and a sort that is an own key of
`SORTS` (`Object.hasOwn`). Anything else, including broken JSON or a value like
`"toString"` that `in` would wrongly accept, falls back to `all` and `newest`. This was
tested by writing bad values into localStorage and reloading.

The search text is deliberately not saved. A returning visitor would otherwise see a
filtered list without knowing why.

**Forget my name.** When `visitorName` is stored, a button appears under the greeting.
Pressing it removes the key and updates the greeting, and the button hides itself again.

## 4. Visit counter and timer

- `visitCount` is read, increased by one, and saved once per page load.
- The timer adds up only the time the tab is visible. `visibleSince` holds when the
  current visible stretch started, or `null` while hidden. `activeMs` holds the total of
  earlier stretches.
- On `visibilitychange` to hidden, the current stretch is added to `activeMs` and
  `visibleSince` becomes `null`. On return, a new stretch starts and the display updates
  straight away.
- A `setInterval` updates the footer once per second, and skips the update while hidden.
- `formatDuration()` shows `45s`, `3m 07s`, or `1h 12m`. The footer uses tabular
  numbers so the text does not jitter as digits change.

## 5. Expand and collapse

The details panel animates `grid-template-rows` from `0fr` to `1fr` when the `open`
class is added. `overflow: hidden` keeps the content inside the shrinking row, and
`visibility: hidden` keeps closed content out of the Tab order. The button carries
`aria-expanded` and `aria-controls`.

## 6. GitHub API

```
GET https://api.github.com/users/xcwezr/repos?sort=updated&per_page=6
```

No key is needed. Unauthenticated requests are limited to 60 per hour per IP.

| Situation | What the visitor sees |
| --------- | --------------------- |
| Waiting | Spinner and "Loading repositories…" |
| 200 with repositories | Cards with name, description, language, last update |
| 200, empty (or only forks) | "No public repositories yet" |
| 404 | "That GitHub user was not found" plus Try again |
| 403 | Rate limit message plus Try again |
| No network | Connection message plus Try again |
| Over 8 seconds | Timeout message plus Try again (`AbortController`) |

## 7. Form validation

`rules` maps each field to a function returning an error string or `""`. On submit every
field is checked, focus moves to the first invalid one, and the form only succeeds when
all three pass. A flagged field is re-checked on each keystroke so its error clears as
soon as it is fixed. The message has a 500 character limit with a live counter.

## 8. Performance

### Changes in Assignment 3

| Change | Why |
| ------ | --- |
| Profile photo converted from a 345 KB PNG to a 22 KB WebP, with a 37 KB JPEG fallback in `<picture>` | The PNG was 85% of the page weight. The photo has no transparency, so PNG gained nothing |
| `width`/`height` on the photo corrected to its real 475 × 492 | Wrong ratios cause layout shift while the image loads |
| `fetchpriority="high"` on the photo | It is the largest element on first view |
| Fade-in removed from the hero | The hero started at `opacity: 0`, which delays the Largest Contentful Paint until the animation runs |
| Unused `profile-placeholder.svg` removed | No longer referenced |
| Per-card `nth-child` delays replaced by one rule using a `--i` custom property | Less repeated CSS, works for any number of projects |
| Timer skips DOM updates while the tab is hidden | No wasted work in the background |

### Lighthouse results

| | Performance | Accessibility | Best practices | SEO |
| - | - | - | - | - |
| Assignment 2, mobile (measured by Claude) | 89 | 100 | 96 | 100 |
| Assignment 3, mobile | 99 | 100 | 100 | 100 |
| Assignment 3, desktop | 100 | 100 | 100 | 100 |

Assignment 3 scores are my own Lighthouse runs in Chrome on `localhost`, in an Incognito
window. In a normal window Best practices showed 96, caused by a Content Security Policy
issue from a browser extension, not by the site.

## 9. Accessibility

- Skip to content link.
- Filter chips use `aria-pressed`. Project buttons use `aria-expanded`.
- Search and sort have visually hidden labels.
- Project count, API state, and form status are live regions.
- Errors are tied to their inputs with `aria-describedby`, invalid inputs use `aria-invalid`.
- Every control works with the keyboard.
- Motion is switched off under `prefers-reduced-motion`.

## 10. Testing performed

| Area | How |
| ---- | --- |
| Sort | Each option, combined with each filter and with a search |
| Saved view | Reload keeps filter and sort. Broken JSON and invalid values fall back to defaults |
| Forget my name | Hidden with no name, shown after a valid submit, hides and clears greeting when pressed |
| Timer | Counts while visible, pauses while the tab is hidden, resumes on return |
| Counter | Increases by one per reload |
| API | Success, 404, and network failure (mocked in a headless browser) |
| Form | Empty submit, bad email, short message, valid submit |
| Layout | 375 px (no horizontal scroll) and desktop |
| Errors | No JavaScript console errors |

Chrome “All features work”, Edge “All features work”

## 11. Known limitations

- The contact form has no backend.
- The GitHub API allows 60 unauthenticated requests per hour per visitor IP.
- Project images are still placeholders.
