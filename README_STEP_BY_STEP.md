# Step-by-step guide (copy/paste friendly)

## 0) Prereqs (install once)
- Install: Git, Node.js LTS (18 or 20), Docker Desktop, and GitHub CLI (`gh`).
- Sign in to GitHub: `gh auth login` and clone this repo after you download it.

## 1) Create a new GitHub repo and push
```bash
git init
git branch -M main
git add .
git commit -m "feat: bootstrap CI/CD lab"
gh repo create your-username/gha-newbie-lab --public --source=. --remote=origin --push
```
Open your repo on GitHub → **Actions** tab; workflows will appear on first push.

## 2) Run CI on a Pull Request
1. Create a branch and make a change:
```bash
git switch -c feat/hello
echo "// tiny change" >> app/src/index.js
git add -A && git commit -m "chore: tiny change"
git push -u origin HEAD
```
2. Open a Pull Request. The **CI** workflow should run (build, lint, test).
3. Explore the run: job logs, artifacts, cache hit/miss, Job Summary.

## 3) Understand caching & artifacts
- Caching: `actions/setup-node` enables `cache: npm` by default in this lab.
- Artifacts: test reports are uploaded; find them on the run summary page.

## 4) Try the matrix & selective runs
- The CI workflow tests Node 18 and 20. Break a test to see a red matrix cell.
- Touch only docs (e.g., `README.md`) and push; the `paths-ignore` will skip CI.

## 5) Build and push a container to GHCR
- Ensure you’re logged in locally (optional): `echo $CR_PAT | gh auth token | docker login ghcr.io -u USERNAME --password-stdin`
- On merge to `main`, `release.yml` builds and pushes `ghcr.io/<OWNER>/<REPO>:<sha>` automatically using `GITHUB_TOKEN`.

## 6) Use a reusable workflow for deploys
- `release.yml` calls `.github/workflows/reusable-deploy.yml` with the image tag.
- Replace the stub `echo` with your real IaC (Terraform/Pulumi) or a cloud deploy script.

## 7) Protect production with environments
- In GitHub → Settings → Environments → `production`:
  - Add required reviewers and an optional wait timer (e.g., 5 minutes).
  - Store prod-only secrets here if needed.

## 8) Pin actions by commit SHA
- Replace action refs with commit SHAs:
  - Visit an action’s Marketplace page → **View full version history** → copy the commit SHA of a version (e.g., v4) and use `@<sha>`.
- This lab uses version tags for readability; practice pinning once you’re comfortable.

## 9) (Optional) Cloud OIDC (AWS example)
- Create an IAM role with a trust policy for GitHub’s OIDC provider (`token.actions.githubusercontent.com`).
- Allow `sts:AssumeRoleWithWebIdentity`. Restrict by `sub` to your org/repo/branch.
- In your job, set `permissions: id-token: write` and use AWS CLI to assume the role.
- No long-lived cloud keys needed.

Trust policy example (edit ORG, REPO, BRANCH):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:ORG/REPO:ref:refs/heads/BRANCH"
        }
      }
    }
  ]
}
```

Workflow snippet to assume role:
```yaml
permissions:
  id-token: write
  contents: read
steps:
  - uses: actions/checkout@v4
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_NAME>
      aws-region: us-east-1
# now run terraform/cli/whatever with ephemeral creds
```

## 10) Security & quality gates
- Enable CodeQL: it’s included (`codeql.yml`).
- Turn on:
  - Branch protections (require PR, status checks).
  - Secret scanning & Dependabot alerts.
  - Required reviewers for `production` environment.
- Add `CODEOWNERS` to enforce reviews per path.

## 11) Monorepo optional lab
- The CI includes a path filter job using `dorny/paths-filter` to skip jobs when only docs change.
- Extend it so each package runs only when its files change.

## 12) Debugging
- Re-run jobs with the same commit (`Re-run jobs`).
- Toggle `ACTIONS_STEP_DEBUG` repository secret to `true` for verbose step logs.
- Use `continue-on-error` only for non-blocking checks.

## 13) Clean up costs
- Shorten artifact retention (Actions → Settings).
- Use `concurrency` to cancel superseded runs.
- Keep caches small and scoped.
