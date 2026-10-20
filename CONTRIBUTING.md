# Contributing

Thanks for helping out. This is a small project, so the process is light.

## Setup

```bash
npm install
npm run dev     # dev server on http://localhost:5173
npm run lint
npm run build   # type check + production build
```

Please make sure `lint` and `build` pass before opening a PR.

## Never share real exports

Don't commit, attach or paste a real `.spass` file, a decrypted export or a CSV, not even your own. If you need test data, create an export from a test account or build one by hand (the format is described in the README).

## Format changes

Most bugs here come from Samsung changing the export format. If you're fixing one, mention the format version (the first line of the decrypted file) and the Samsung Pass version in the PR. Check [spass-manager](https://github.com/0xdeb7ef/spass-manager) too, it may already have the answer.

## Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <summary>

<optional body: what changed and why>

<optional footer, e.g. Fixes #12>
```

Types:

| Type       | For                                           |
| ---------- | --------------------------------------------- |
| `feat`     | New functionality                             |
| `fix`      | Bug fixes                                     |
| `docs`     | README, CONTRIBUTING, comments                |
| `style`    | UI and styling changes without logic changes  |
| `refactor` | Code changes that don't change behavior       |
| `chore`    | Dependencies, config, tooling                 |

Rules:

- Summary in imperative mood, lowercase, no trailing period, max ~72 characters.
- One logical change per commit. Formatting fixes don't belong in a bug fix commit.
- Use the body to explain *why* when it's not obvious from the diff.
- Reference issues in the footer (`Fixes #1`).

Examples:

```
fix(parser): find next_table regardless of header length

Format 25 added a header line, so the marker is no longer on line 3.

Fixes #1
```

```
feat: export cards as a separate CSV
```

```
chore: drop MUI in favor of plain Tailwind
```

## Pull requests

- Branch off `master` and keep PRs focused on one thing.
- Describe what you changed and how you tested it.
- For UI changes, add a screenshot.
