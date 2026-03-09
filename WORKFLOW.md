# Workflow

## Commit + push after each change

Default rule for this repo: whenever a change is made, commit and push immediately (unless batching is explicitly requested, or push is blocked by authentication).

### Steps

1. `git status`
2. `git add <files>`
3. `git commit -m "<message>"`
4. `git push`

## Private-content boundary

- `/Users/jsp-16/github-projects/private` is the canonical private workspace.
- Do not move/copy JD/private study material into this public repo unless explicitly requested.
- Keep this repo limited to site/app content intended for this project.
