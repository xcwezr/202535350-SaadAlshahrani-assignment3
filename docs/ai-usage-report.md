# AI Usage Report

## Tools Used & Use Cases

| Tool | How I used it |
| ---- | ------------- |
| Claude (claude-opus-5-5), Claude app | Generated the Assignment 3 features from my Assignment 2 repository: sorting combined with filter and search, saved filter and sort, visit counter and timer, Forget my name button. Converted my profile photo to WebP and JPEG, ran Lighthouse before and after, tested the features in a headless browser, and drafted the README, technical documentation, and this report's structure. It also found a bug I had introduced in Assignment 2 (stray text in `styles.css`). |
| [Any other tool, e.g. Copilot] | [What for] |

## Usage Log

Full conversations are in `conversations/` and the unedited AI output is in
`artifacts/` inside the AI Evidence ZIP on Blackboard
(`202535350-SaadAlshahrani-assignment3-ai-evidence.zip`).

| C01 | Claude (claude-opus-5-5) | 2026-11-21 | Conversation: build Assignment 3 features on my Assignment 2 code, optimise performance, draft documentation. Claude also guided me through testing step by step | All files below | Added month-based date sorting myself (projects.js, script.js), tested every feature in Chrome and Edge, ran Lighthouse myself, and updated the technical documentation with my results. |
| A01 | Claude (claude-opus-5-5) | 2026-11-21 | Sort, saved view, contextual count message, Forget my name, visit counter and timer | `js/script.js` | Added `dateValue()` and changed the newest/oldest compare functions so projects sort by year and month, not just year (three projects shared 2025). Verified: each sort with each filter and a search, reload keeps filter and sort, timer pauses in a background tab, visit count rises on reload, Forget my name clears the greeting. |
| A02 | Claude (claude-opus-5-5) | 2026-11-21 | Sort control, Forget my name button, visit info, `<picture>` for the photo | `index.html` | No changes. Verified the sort dropdown, Forget my name, footer visit info and photo display in Chrome and Edge. |
| A03 | Claude (claude-opus-5-5) | 2026-11-21 | Styles for new controls, single animation delay rule, removed my stray text bug | `css/styles.css` | No changes. Verified the layout and card animations in Chrome and Edge. |
| A04 | Claude (claude-opus-5-5) | 2026-11-21 | Converted my photo `saad2.png` (345 KB) to `saad.webp` (22 KB) and `saad.jpg` (37 KB), removed unused placeholder | `assets/images/` | No changes. Verified the photo loads and looks sharp, and ran Lighthouse myself: Performance 99 mobile, 100 desktop. |
| A05 | Claude (claude-opus-5-5) | 2026-11-21 | Drafts of README, technical documentation, and this report's structure | `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Replaced Claude's Lighthouse numbers with my own Incognito runs and explained the extension issue, documented the month sort, filled in the browser table, removed the fixed year-only limitation. Wrote the reflection sections myself. |

## Benefits & Challenges

**Benefits.** AI assisted me in writing the code. It also found a bug I had introduced in
Assignment 2, stray text in `styles.css` that broke the project title hover colour, which
I had not noticed. It showed that my profile photo was 345 KB, most of the page's
weight, and converted it to a 22 KB WebP, which made the page load much faster.

**Challenges.** I faced some challenges when analysing the page with Lighthouse. The
Best Practices score was lower than expected, and I found that a browser extension was
affecting the results. Running Lighthouse in an Incognito window, where extensions are
off, gave the real scores.

## Learning Outcomes

I learned how to measure my website's performance using Lighthouse, and how to sort
projects by month as well as year.

## Understanding

When a filter is clicked, the code filters the projects twice and then sorts them. The
first filter keeps projects with the chosen tag, the second keeps those matching the
search text, and because `filter` creates a new array, the original list remains
unchanged.

`year * 12` converts the date into a single number representing total months, while
`|| 0` uses zero when a project does not have a month value.

The timer tracks how long the page is visible by saving each visible period and adding it
to `activeMs` when the user switches tabs. When the user returns, it starts a new period,
and the footer displays the saved time plus the current period; updates pause while the
page is hidden.

## Responsible Use & Modifications

I checked the AI's output by testing every feature against the assignment requirements:
sorting with each filter and a search, saved settings after a reload, the timer pausing
in a background tab, the visit counter, Forget my name, the theme, and the GitHub
section, in both Chrome and Edge. I also measured performance myself with Lighthouse.

I improved the sorting accuracy by adding a month to each project and changing the
compare functions to use it, because three projects shared the year 2025 and could not
be ordered correctly by year alone.

I made sure I understand the code by having Claude explain the parts I did not
understand, then writing the Understanding section above in my own words.

## Declaration

I declare that this report and the attached evidence document all of my AI use in this
assignment, with complete and unedited conversations, and that I understand and can
explain all the code I submitted. I understand that undeclared AI use or a false
declaration will be treated as plagiarism according to KFUPM regulations.

Name: Saad Alshahrani
Student ID: 202535350
Date: 11/21/2026
Signature: Saad Alshahrani
