# Accretion UI

Accretion UI is a cross-framework component system built from one core web component library and distributed as independent framework packages.

For product and design leadership, the core proof point is simple: one implementation can ship a consistent button experience across React, Angular 18-20, and Angular 21+ without duplicating component logic.

## Start Here (2-Minute Demo)

If you only have a few minutes, open these first:

| Framework Target | Storybook | Chromatic Project | npm Package |
|---|---|---|---|
| React (`@accretion_ui/react`) | [View Storybook](https://69a694b696baf333e562e9f1-fxnzzvdoqy.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a694b696baf333e562e9f1) | [@accretion_ui/react](https://www.npmjs.com/package/@accretion_ui/react) |
| Angular 18 (`@accretion_ui/angular_18`) | [View Storybook](https://69a69540931282436807583e-fuxraacovf.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a69540931282436807583e) | [@accretion_ui/angular_18](https://www.npmjs.com/package/@accretion_ui/angular_18) |
| Angular 21 (`@accretion_ui/angular_21`) | [View Storybook](https://69a69585a3c2c8accf671d8d-ojydhqlaui.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a69585a3c2c8accf671d8d) | [@accretion_ui/angular_21](https://www.npmjs.com/package/@accretion_ui/angular_21) |

Core package (single source of truth): [@accretion_ui/core](https://www.npmjs.com/package/@accretion_ui/core)

## Figma Design Source

- Accretion UI Figma library: [Accretion UI (Figma)](https://www.figma.com/design/d45s1jniPNl5aEbn0DXwV7/Accretion-UI?node-id=0-1&p=f&t=aPkeN5qIwUccQOYk-0)
- Current status: the Figma library is currently empty.
- Component styles are taken from the tokens folder files like:
  - `/tokens/primitives.json`
  - `/tokens/semantic/button.json`
  - `/tokens/semantic/accordion.json`

## What to Look For in the Demos

- Same component API across frameworks.
- Same visual intent hierarchy (`primary`, `secondary`, `tertiary`).
- Same behavior for hover, active, focus, and disabled states.
- Same slotted content behavior and clickable interactions.
- Framework-native state updates driven by the same underlying web component.

## Table of Contents

- [Start Here (2-Minute Demo)](#start-here-2-minute-demo)
- [Figma Design Source](#figma-design-source)
- [What to Look For in the Demos](#what-to-look-for-in-the-demos)
- [Support Matrix](#support-matrix)
- [Packages](#packages)
- [How It Works (Single Core, Multiple Frameworks)](#how-it-works-single-core-multiple-frameworks)
- [Install](#install)
- [Framework Setup Examples](#framework-setup-examples)
- [Testing Strategy and Setup](#testing-strategy-and-setup)
- [Smoke Testing (How It Works)](#smoke-testing-how-it-works)
- [Storybook and Chromatic Workflow](#storybook-and-chromatic-workflow)
- [Release and Publish Workflow](#release-and-publish-workflow)
- [Publish Command Reference](#publish-command-reference)
- [Known Bugs](#known-bugs)
- [Contributing](#contributing)
- [Repository and Branch Map](#repository-and-branch-map)
- [Package and Chromatic Repositories](#package-and-chromatic-repositories)
- [Project Layout](#project-layout)
- [Coming Soon (TODO)](#coming-soon-todo)

## Support Matrix

| Area | Oldest Supported | Newest Supported |
|---|---|---|
| Angular wrappers | Angular `18.x` (`@accretion_ui/angular_18`) | Angular `21.x` (`@accretion_ui/angular_21`) |
| React wrapper | React `18.2.0` | React `19.x` |
| Angular package split | `@accretion_ui/angular_18` for `>=18 <21` | `@accretion_ui/angular_21` for `>=21 <22` |

## Packages

| Package | Purpose | npm |
|---|---|---|
| `@accretion_ui/core` | Source of truth (core Stencil web components) | [npm](https://www.npmjs.com/package/@accretion_ui/core) |
| `@accretion_ui/react` | React wrapper (v18+) | [npm](https://www.npmjs.com/package/@accretion_ui/react) |
| `@accretion_ui/angular_18` | Angular wrapper (v18-v20) | [npm](https://www.npmjs.com/package/@accretion_ui/angular_18) |
| `@accretion_ui/angular_21` | Angular wrapper (v21+, includes signals) | [npm](https://www.npmjs.com/package/@accretion_ui/angular_21) |

## How It Works (Single Core, Multiple Frameworks)

Accretion UI uses [Stencil](https://stenciljs.com/docs/introduction) to compile standards-based web components and generate framework wrappers.

Key Stencil references:

- [Stencil Introduction](https://stenciljs.com/docs/introduction)
- [Stencil Output Targets](https://stenciljs.com/docs/output-targets)
- [Stencil React Integration](https://stenciljs.com/docs/react)
- [Stencil Angular Integration](https://stenciljs.com/docs/angular)

Flow:

1. Components are authored once in `components/core`.
2. Stencil builds `@accretion_ui/core`.
3. Stencil output tooling generates React and Angular wrappers.
4. Wrappers publish as standalone npm packages.
5. App teams consume wrappers directly with normal package installs. No app-side code generation is required.

## Install

### React

```bash
npm install @accretion_ui/react
```

### Angular 18-20

```bash
npm install @accretion_ui/angular_18 @accretion_ui/core
```

### Angular 21+

```bash
npm install @accretion_ui/angular_21 @accretion_ui/core
```

## Framework Setup Examples

### Angular 18 (`npx @angular/cli@18 new my-app`)

```bash
npx @angular/cli@18 new my-app
cd my-app
npm install @accretion_ui/angular_18 @accretion_ui/core
```

`src/app/app.component.ts`

```ts
import { Component } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_18';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: `
    <p>Count: {{ count }}</p>
    <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
    <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
    <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
  `
})
export class AppComponent {
  count = 0;

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  reset() {
    this.count = 0;
  }
}
```

### Latest Angular (`ng new my-app`)

```bash
ng new my-app
cd my-app
npm install @accretion_ui/angular_21 @accretion_ui/core
```

`src/app/app.ts`

```ts
import { Component, signal } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_21';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: `
    <p>Count: {{ count() }}</p>
    <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
    <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
    <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
  `
})
export class App {
  count = signal(0);

  increment() {
    this.count.update((value) => value + 1);
  }

  decrement() {
    this.count.update((value) => value - 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

### React + Vite

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install @accretion_ui/react
```

`src/App.tsx`

```tsx
import { useState } from 'react';
import { AccretionButton } from '@accretion_ui/react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>Increment Count</AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>Decrement Count</AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>Reset Count</AccretionButton>
    </>
  );
}
```

### React + CRA

```bash
npx create-react-app@latest my-app --template typescript
cd my-app
npm install @accretion_ui/react
```

`src/App.tsx`

```tsx
import { useState } from 'react';
import { AccretionButton } from '@accretion_ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>Increment Count</AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>Decrement Count</AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>Reset Count</AccretionButton>
    </>
  );
}

export default App;
```

### React + Next.js

```bash
npx create-next-app@latest my-app --typescript
cd my-app
npm install @accretion_ui/react
```

`app/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { AccretionButton } from '@accretion_ui/react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>Increment Count</AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>Decrement Count</AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>Reset Count</AccretionButton>
    </>
  );
}
```

## Testing Strategy and Setup

### Fast summary (non-engineering)

Accretion UI uses multiple independent test layers so releases are not validated by a single signal:

- Story-level behavior tests confirm stories behave the way they claim.
- Accessibility scans catch WCAG-impacting markup/semantics issues.
- Keyboard and zoom-focused checks validate interaction quality beyond static rules.
- Smoke tests validate real app installs in React and Angular before and after publish.

### What each test layer validates

| Test layer | Command | Primary purpose | Typical failure signal |
|---|---|---|---|
| Core package test runner | `npm --prefix components/core run test` | Runs Stencil spec/e2e suite (currently no committed spec files; command kept CI-safe). | Build/test harness failure in `components/core`. |
| Storybook behavior + prop coverage + Playwright accessibility | `npm --prefix chromatic run test:accordion` | Validates Accordion stories, prop behavior, and framework parity across React, Angular 18, Angular 21. | Story behavior regression, prop contract break, keyboard/interaction bug. |
| Storybook accessibility addon (`@storybook/addon-a11y`) | Included in each Storybook preview/build | Provides per-story a11y scans in Storybook UI and Chromatic context. | WCAG rule violations flagged in Storybook addon panel. |
| USWDS-aligned keyboard/zoom checks (Playwright) | Included in `npm --prefix chromatic run test:accordion` | Covers keyboard interaction and zoom behavior that static axe scans do not fully cover. | Focus order, keyboard toggle, zoom overflow/clipping regressions. |
| Local package smoke matrix | `npm --prefix testing run verify:local` | Verifies local tarballs install/build in React Vite, React CRA, React Next, Angular 18, Angular 21. | Consumer import/build failures before publish. |
| npm package smoke matrix | `npm --prefix testing run verify:npm` | Verifies published npm artifacts install/build in the same framework matrix. | Published package regression, bad manifest/exports/dependency issues. |
| npm runtime browser smoke matrix | `npm --prefix testing run verify:npm:browser` | Starts each npm smoke app in a real browser and validates button + accordion interactions with Playwright. | Runtime hydration/interaction failures not caught by build-only smoke checks. |

### Why both Storybook a11y and Playwright a11y are used

- `addon-a11y` and `@axe-core/playwright` both run axe rules, but in different execution contexts.
- Axe does not fully cover keyboard workflow expectations (for example, open/close behavior on `Enter`/`Space`, tab sequencing through panel content), so dedicated keyboard tests remain required.
- Accordion-specific keyboard/zoom tests in `chromatic/tests/specs/accordion.uswds-a11y.spec.ts` cover USWDS-style interaction expectations that are not purely rule-based.

### How to run the full release-quality test gate

From repo root:

```bash
npm --prefix components/core run test
npm --prefix chromatic run test:accordion
npm --prefix testing run verify:local
```

After publish, run:

```bash
npm --prefix testing run verify:npm
npm --prefix testing run verify:npm:browser
```

### How to extend the test setup for new component behavior

1. Add or update Storybook stories first in each framework workspace (`chromatic/react`, `chromatic/angular_18`, `chromatic/angular_21`).
2. Add story IDs to `chromatic/tests/specs/helpers.ts` and keep IDs framework-agnostic (for example, `accretion-accordion--*`).
3. Add behavior and prop assertions in `accordion.behavior.spec.ts` and/or `accordion.props.spec.ts`.
4. Add accessibility expectations in:
   - `accordion.a11y.spec.ts` for axe blocking violations.
   - `accordion.uswds-a11y.spec.ts` for keyboard/zoom/interaction expectations.
5. Re-run `npm --prefix chromatic run test:accordion` and both smoke scripts before publish.

## Smoke Testing (How It Works)

The `testing/` workspace is the smoke-test harness that replaced committed demo apps (`apps/` and `live_apps/`).

This keeps the repository slim while still verifying real install paths.

### Commands

```bash
# 1) Verify local package changes before publish
npm --prefix testing run verify:local

# 2) Verify npm-published packages after publish
npm --prefix testing run verify:npm

# 3) Verify npm-published runtime behavior in a real browser
npm --prefix testing run verify:npm:browser
```

### `verify:local` flow

1. Builds local packages: `core`, `react`, `angular_18`, `angular_21`.
2. Packs each into tarballs.
3. Generates temporary apps under `.tmp/smoke-local`:
   - React Vite
   - React CRA
   - React Next.js
   - Angular 18
   - Angular 21
4. Installs local tarballs into those apps.
5. Runs framework builds to confirm imports and compilation.

### `verify:npm` flow

1. Generates temporary apps under `.tmp/smoke-npm` for the same framework matrix.
2. Installs from npm registry instead of local tarballs.
3. Runs framework builds to validate published artifacts.
4. If a published wrapper version does not yet expose Accordion exports, the harness falls back to button-only smoke checks and logs that fallback explicitly.

### `verify:npm:browser` flow

1. Runs `verify:npm` first to regenerate npm smoke apps.
2. Starts each generated app server sequentially.
3. Runs Playwright Chromium checks against each framework target:
   - React Vite
   - React CRA
   - React Next.js
   - Angular 18
   - Angular 21
4. Validates runtime behavior in browser (button interactions + Accordion interaction where exports exist).

Version pinning is supported:

```bash
ACCRETION_CORE_VERSION=<core_version> \
ACCRETION_REACT_VERSION=<react_version> \
ACCRETION_ANGULAR_18_VERSION=<angular_18_version> \
ACCRETION_ANGULAR_21_VERSION=<angular_21_version> \
npm --prefix testing run verify:npm
```

For Accordion release validation, always pin the just-published package versions so the smoke run validates Accordion imports directly (instead of fallback mode).

### Manual runtime checks after smoke scripts

```bash
npm --prefix .tmp/smoke-local/react-vite-local start
npm --prefix .tmp/smoke-local/react-cra-local start
npm --prefix .tmp/smoke-local/react-next-local dev
npm --prefix .tmp/smoke-local/angular-18-local start
npm --prefix .tmp/smoke-local/angular-21-local start
```

Validate:

- The three variants render with distinct visual intent.
- Slot text appears inside the button.
- Increment/decrement/reset actions update framework state.
- Accordion imports render in React and Angular smoke apps without compile/runtime errors.
- Accordion trigger/panel interactions render expected expanded/collapsed states.

## Storybook and Chromatic Workflow

Chromatic workspace folders:

- `chromatic/react`
- `chromatic/angular_18`
- `chromatic/angular_21`

Install dependencies once:

```bash
cd chromatic
npm run install:all
```

Run Storybook locally:

```bash
npm run storybook:react
npm run storybook:angular_18
npm run storybook:angular_21
```

Publish to Chromatic:

```bash
npm run chromatic:react
npm run chromatic:angular_18
npm run chromatic:angular_21
```

Required environment variables (`~/.config/accretion_ui/chromatic.env`):

```bash
export CHROMATIC_PROJECT_TOKEN_REACT="<token>"
export CHROMATIC_PROJECT_TOKEN_ANGULAR_18="<token>"
export CHROMATIC_PROJECT_TOKEN_ANGULAR_21="<token>"
```

## Release and Publish Workflow

### Required publish checklist

Use this checklist before merging a release branch and publishing packages:

- [ ] Scope is confirmed for all framework wrappers (`core`, `react`, `angular_18`, `angular_21`).
- [ ] Storybook stories are updated for all affected frameworks.
- [ ] `npm --prefix components/core run test` passes.
- [ ] `npm --prefix chromatic run test:accordion` passes.
- [ ] `npm --prefix testing run verify:local` passes.
- [ ] Package versions are bumped and wrapper core ranges are aligned.
- [ ] Production builds for all publishable packages pass.
- [ ] npm authentication is confirmed (`npm whoami`).
- [ ] Publish commands run in strict dependency order (`core` first).
- [ ] `npm --prefix testing run verify:npm` passes using published versions.
- [ ] `npm --prefix testing run verify:npm:browser` passes against published versions.

### Phase 1: Release Checklist (Non-Technical First)

Use this section for design leads, product, and engineering leads before commands are run.

1. Confirm release scope:
   - Which components changed, what behavior changed, and which frameworks are impacted.
2. Confirm visual sign-off:
   - Review Storybook/Chromatic for React, Angular 18-20, and Angular 21+.
3. Confirm compatibility sign-off:
   - React track (`@accretion_ui/react`) and Angular tracks (`@accretion_ui/angular_18`, `@accretion_ui/angular_21`) still match the support matrix.
4. Confirm rollout communication:
   - Decide release notes and internal/external announcement timing.
5. Confirm go/no-go:
   - Release only after smoke checks pass and npm publish credentials are available.

### Phase 2: Engineering Runbook

Run all commands from repo root unless noted otherwise.

#### 0) Preflight

```bash
# Confirm npm auth (required for publish)
npm whoami

# Optional: verify clean working tree before release
git status --short
```

#### 1) Production-readiness gate

```bash
# Core package test runner
npm --prefix components/core run test

# Story-level behavior + prop + accessibility coverage
npm --prefix chromatic run test:accordion

# Full local artifact + consumer smoke matrix (React Vite/CRA/Next + Angular 18/21)
npm --prefix testing run verify:local
```

#### 2) Update package versions

Choose `patch`, `minor`, or `major` based on the release scope.

```bash
npm --prefix components/core version patch --no-git-tag-version
npm --prefix components/react version patch --no-git-tag-version
npm --prefix components/angular_18 version patch --no-git-tag-version
npm --prefix components/angular_21 version patch --no-git-tag-version
```

After bumping core, align wrapper references to the new core version:

```bash
CORE_VERSION="$(node -p "require('./components/core/package.json').version")"
npm --prefix components/react pkg set "dependencies.@accretion_ui/core=^${CORE_VERSION}"
npm --prefix components/angular_18 pkg set "peerDependencies.@accretion_ui/core=^${CORE_VERSION}"
npm --prefix components/angular_21 pkg set "peerDependencies.@accretion_ui/core=^${CORE_VERSION}"
npm --prefix components/react install --package-lock-only
npm --prefix components/angular_18 install --package-lock-only
npm --prefix components/angular_21 install --package-lock-only
```

#### 3) Build production artifacts

```bash
npm --prefix components/core run build
npm --prefix components/react run build
npm --prefix components/angular_18 run build
npm --prefix components/angular_21 run build
```

#### 4) Publish to npm (strict order)

```bash
npm --prefix components/core run publish:package
npm --prefix components/react run publish:package
npm --prefix components/angular_18 run publish:package
npm --prefix components/angular_21 run publish:package
```

#### 5) Post-publish validation

```bash
CORE_VERSION="$(node -p "require('./components/core/package.json').version")"
REACT_VERSION="$(node -p "require('./components/react/package.json').version")"
ANGULAR_18_VERSION="$(node -p "require('./components/angular_18/package.json').version")"
ANGULAR_21_VERSION="$(node -p "require('./components/angular_21/package.json').version")"

npm view @accretion_ui/core version
npm view @accretion_ui/react version
npm view @accretion_ui/angular_18 version
npm view @accretion_ui/angular_21 version

ACCRETION_CORE_VERSION="$CORE_VERSION" \
ACCRETION_REACT_VERSION="$REACT_VERSION" \
ACCRETION_ANGULAR_18_VERSION="$ANGULAR_18_VERSION" \
ACCRETION_ANGULAR_21_VERSION="$ANGULAR_21_VERSION" \
npm --prefix testing run verify:npm

ACCRETION_CORE_VERSION="$CORE_VERSION" \
ACCRETION_REACT_VERSION="$REACT_VERSION" \
ACCRETION_ANGULAR_18_VERSION="$ANGULAR_18_VERSION" \
ACCRETION_ANGULAR_21_VERSION="$ANGULAR_21_VERSION" \
npm --prefix testing run verify:npm:browser
```

Release guardrails:

- Publish `@accretion_ui/core` first.
- Publish wrapper packages only after core publish succeeds.
- Never republish an existing version number.
- If publish fails mid-sequence, fix the issue and resume from the first unpublished package.

## Publish Command Reference

Run from repo root in this exact order:

```bash
npm --prefix components/core run publish:package
npm --prefix components/react run publish:package
npm --prefix components/angular_18 run publish:package
npm --prefix components/angular_21 run publish:package
```

Recommended post-publish verification:

```bash
CORE_VERSION="$(node -p "require('./components/core/package.json').version")"
REACT_VERSION="$(node -p "require('./components/react/package.json').version")"
ANGULAR_18_VERSION="$(node -p "require('./components/angular_18/package.json').version")"
ANGULAR_21_VERSION="$(node -p "require('./components/angular_21/package.json').version")"

ACCRETION_CORE_VERSION="$CORE_VERSION" \
ACCRETION_REACT_VERSION="$REACT_VERSION" \
ACCRETION_ANGULAR_18_VERSION="$ANGULAR_18_VERSION" \
ACCRETION_ANGULAR_21_VERSION="$ANGULAR_21_VERSION" \
npm --prefix testing run verify:npm

ACCRETION_CORE_VERSION="$CORE_VERSION" \
ACCRETION_REACT_VERSION="$REACT_VERSION" \
ACCRETION_ANGULAR_18_VERSION="$ANGULAR_18_VERSION" \
ACCRETION_ANGULAR_21_VERSION="$ANGULAR_21_VERSION" \
npm --prefix testing run verify:npm:browser
```

## Known Bugs

- React + Next.js 16 (Turbopack) interoperability status for Accordion:
  - Fixed in upcoming `0.2.2`: runtime error `syncFromRoot is not a function`
  - Fixed in upcoming `0.2.2`: hydration mismatch involving `accretion-accordion-item`
  - Still under investigation: brief style flash on refresh before component styles fully apply

## Contributing

### Branch strategy

- Branch from `main`.
- Use `codex/<feature_name>` naming.
- Keep change sets scoped (core logic, wrappers, stories, docs, testing).

### Typical change flow

1. Update component logic/styles in `components/core`.
2. Build wrappers (`components/react`, `components/angular_18`, `components/angular_21`).
3. Run smoke tests in `testing/` (`verify:local`, then `verify:npm` + `verify:npm:browser` after publish).
4. Update affected stories in `chromatic/*`.
5. Publish Chromatic and verify links.
6. Update README if behavior, support ranges, or workflows changed.

## Repository and Branch Map

### Main development repository

- [accretion_ui](https://github.com/BrianARuff/accretion_ui)

### Active branches

- [`main`](https://github.com/BrianARuff/accretion_ui/tree/main): stable integration branch.
- [`codex/primitive_tokens`](https://github.com/BrianARuff/accretion_ui/tree/codex/primitive_tokens): primitive token definitions and naming.
- [`codex/component_library`](https://github.com/BrianARuff/accretion_ui/tree/codex/component_library): initial multi-wrapper package architecture.
- [`codex/storybook_chromatic`](https://github.com/BrianARuff/accretion_ui/tree/codex/storybook_chromatic): Storybook and Chromatic integration.
- [`codex/button_semantic_tokens`](https://github.com/BrianARuff/accretion_ui/tree/codex/button_semantic_tokens): semantic button token work and variant behavior updates.

## Package and Chromatic Repositories

### Package repositories

- Core development context: [accretion_ui](https://github.com/BrianARuff/accretion_ui)
- React package repo: [accretion_react](https://github.com/BrianARuff/accretion_react)
- Angular 18 package repo: [accretion_angular_18](https://github.com/BrianARuff/accretion_angular_18)
- Angular 21 package repo: [accretion_angular_21](https://github.com/BrianARuff/accretion_angular_21)

### Chromatic repositories

- React Chromatic repo: [accretion_ui_react_chromatic](https://github.com/BrianARuff/accretion_ui_react_chromatic)
- Angular 18 Chromatic repo: [accretion_ui_angular_18_chromatic](https://github.com/BrianARuff/accretion_ui_angular_18_chromatic)
- Angular 21 Chromatic repo: [accretion_ui_angular_21_chromatic](https://github.com/BrianARuff/accretion_ui_angular_21_chromatic)

## Project Layout

- `components/core`: Stencil core (`@accretion_ui/core`)
- `components/react`: React wrapper (`@accretion_ui/react`)
- `components/angular_18`: Angular 18-20 wrapper (`@accretion_ui/angular_18`)
- `components/angular_21`: Angular 21 wrapper (`@accretion_ui/angular_21`)
- `chromatic`: Storybook + Chromatic projects for all wrappers
- `testing`: generated smoke-test harness for local tarballs and npm-installed packages
- `.tmp`: temporary generated apps used by smoke testing (gitignored)

## Coming Soon (TODO)

- Add per-component Figma references with direct token mapping links.
- Move proof-of-concept Button styles to finalized Figma-backed token definitions.
- Expand component coverage beyond Button while preserving one-core/multi-wrapper generation.
- Add documented accessibility expectations and test status per component.
