# Testing Harness

This folder replaces the old `apps/` and `live_apps/` folders with reproducible smoke tests generated on demand.

## Why this approach

- Keeps the main repo slim.
- Tests local package changes before publish.
- Tests npm-published packages in clean framework projects.
- Covers the same high-risk integration paths that previously required keeping many sample apps in source control.

## Smoke targets

- React Vite (`@accretion_ui/react`)
- React Next.js (`@accretion_ui/react`)
- Angular 18 (`@accretion_ui/angular_18` + `@accretion_ui/core`)
- Angular 21 (`@accretion_ui/angular_21` + `@accretion_ui/core`)

## Prerequisites

- Recommended Node runtime: `v25.7.0` (your current setup).
- Angular 21 CLI scaffolding requires at least Node `20.19` or `22.12` when `ng` executes.

## Run local-package smoke tests

From repo root:

```bash
npm --prefix testing run verify:local
```

What it does:

1. Builds `core`, `react`, `angular_18`, and `angular_21` from this repo.
2. Packs each package into tarballs.
3. Creates temporary apps under `.tmp/smoke-local`.
4. Installs tarballs and runs framework builds.

## Run npm-published smoke tests

From repo root:

```bash
npm --prefix testing run verify:npm
```

Default uses `latest` versions. You can pin versions:

```bash
ACCRETION_CORE_VERSION=0.1.5 \
ACCRETION_REACT_VERSION=0.1.3 \
ACCRETION_ANGULAR_18_VERSION=0.1.2 \
ACCRETION_ANGULAR_21_VERSION=0.1.2 \
npm --prefix testing run verify:npm
```

## Manual UI validation after smoke build

After either script runs, use generated apps in `.tmp/smoke-local` or `.tmp/smoke-npm`:

- React Vite: `npm --prefix .tmp/smoke-*/react-vite-* start`
- React Next.js: `npm --prefix .tmp/smoke-*/react-next-* dev`
- Angular 18: `npm --prefix .tmp/smoke-*/angular-18-* start`
- Angular 21: `npm --prefix .tmp/smoke-*/angular-21-* start`

Validate:

- All three variants (`primary`, `secondary`, `tertiary`) render differently.
- Slot text appears inside the button content.
- Count actions (increment/decrement/reset) update framework state.
