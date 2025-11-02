# CI/CD Playground


## What's inside
- Simple Node.js web app (Express)
- Unit tests (Jest)
- Dockerfile (containerize the app)
- CI workflow (build + lint + test) with caching and matrix
- Release workflow (build & push container to GHCR, then call a reusable deploy workflow)
- Reusable workflow (org-standard deploy stub)
- Composite action: `.github/actions/setup-node-tooling` (DRY setup across jobs)
- Paths filter job to skip work when only docs change
- CodeQL workflow (security scanning)
- Examples of permissions hardening, concurrency, environment protection

