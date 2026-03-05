# Testing Harness

This folder replaces the old `apps/` and `live_apps/` folders with reproducible smoke tests generated on demand.

## Why this approach

- Keeps the main repo slim.
- Tests local package changes before publish.
- Tests npm-published packages in clean framework projects.
- Covers the same high-risk integration paths that previously required keeping many sample apps in source control.

## Smoke targets

- React Vite (`@accretion_ui/react`)
- React CRA (`@accretion_ui/react`)
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
5. Covers React Vite, React CRA, React Next.js, Angular 18, and Angular 21 app builds.

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

## Run npm smoke tests with Playwright browser validation

From repo root:

```bash
npm --prefix testing run verify:npm:browser
```

What it does:

1. Runs `verify:npm` to generate and build all npm-based smoke apps.
2. Starts each generated app server one at a time.
3. Uses Playwright Chromium to validate real browser behavior:
4. Confirms button rendering and click updates (`increment`, `decrement`, `reset`).
5. Confirms Accordion trigger/panel interaction when Accordion exports are available in the published wrapper.

## Manual UI validation after smoke build

After either script runs, use generated apps in `.tmp/smoke-local` or `.tmp/smoke-npm`:

- React Vite: `npm --prefix .tmp/smoke-*/react-vite-* start`
- React CRA: `npm --prefix .tmp/smoke-*/react-cra-* start`
- React Next.js: `npm --prefix .tmp/smoke-*/react-next-* dev` (or `start` after build)
- Angular 18: `npm --prefix .tmp/smoke-*/angular-18-* start`
- Angular 21: `npm --prefix .tmp/smoke-*/angular-21-* start`

Validate:

- All three variants (`primary`, `secondary`, `tertiary`) render differently.
- Slot text appears inside the button content.
- Count actions (increment/decrement/reset) update framework state.
- Accordion wrappers import successfully in each generated app (React + Angular).
- Accordion trigger/panel markup renders without framework build errors.
