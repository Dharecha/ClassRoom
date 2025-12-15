# Git push fix: "src refspec main does not match any"

Typical cause: no commits or your local branch isn't named `main`.

Recommended commands to fix for a fresh repo:

1. Check status:
   git status

2. Add files and create initial commit:
   git add .
   git commit -m "Initial commit"

3. Rename current branch to main (optional but common):
   git branch -M main

4. Push and set upstream:
   git push -u origin main

Alternate: push current branch to remote main without renaming:
   git push origin HEAD:main

If your remote default is `master` or different, run:
   git remote show origin
and push to the appropriate branch name.

Debugging:
- Confirm commits exist: git log --oneline -n 5
- Confirm branches: git branch -a
- If remote rejected due to authentication, ensure your remote credentials/token are valid.
