# Accretion UI

Accretion UI is a cross-framework component system built from one core web component library and distributed as independent framework packages.

For product and design leadership, the core proof point is simple: one implementation can ship a consistent button experience across React, Angular 18-20, and Angular 21+ without duplicating component logic.

## Start Here (2-Minute Demo)

If you only have a few minutes, open these first:

| Framework Target | Storybook | Chromatic Project | npm Package |
|---|---|---|---|
| React (`@accretion_ui/react`) | [View Storybook](https://69a694b696baf333e562e9f1-wiagmjvomb.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a694b696baf333e562e9f1) | [@accretion_ui/react](https://www.npmjs.com/package/@accretion_ui/react) |
| Angular 18 (`@accretion_ui/angular_18`) | [View Storybook](https://69a69540931282436807583e-wcyxyqytjt.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a69540931282436807583e) | [@accretion_ui/angular_18](https://www.npmjs.com/package/@accretion_ui/angular_18) |
| Angular 21 (`@accretion_ui/angular_21`) | [View Storybook](https://69a69585a3c2c8accf671d8d-kxeidzkvyn.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a69585a3c2c8accf671d8d) | [@accretion_ui/angular_21](https://www.npmjs.com/package/@accretion_ui/angular_21) |

Core package (single source of truth): [@accretion_ui/core](https://www.npmjs.com/package/@accretion_ui/core)

## What Changed Recently

- Added semantic button token layers for default, hover, active, focus, and disabled behavior.
- Refined button intent hierarchy with distinct `primary`, `secondary`, and `tertiary` variants.
- Added interactive Storybook stories (all frameworks) that prove real framework state updates:
  - React uses `useState`.
  - Angular 18 uses class state.
  - Angular 21 uses `signal`.
- Stabilized Angular wrappers for split compatibility tracks:
  - `@accretion_ui/angular_18` for Angular 18-20.
  - `@accretion_ui/angular_21` for Angular 21+.
- Added an automated smoke-test harness (`testing/`) that validates both:
  - local tarball consumption before publish,
  - npm-installed package consumption after publish.
- Replaced large committed sample apps with generated temporary smoke apps under `.tmp/` to keep the repository lean.

## Figma Design Source

- Accretion UI Figma library: [Accretion UI (Figma)](https://www.figma.com/design/d45s1jniPNl5aEbn0DXwV7/Accretion-UI?node-id=0-1&p=f&t=aPkeN5qIwUccQOYk-0)
- Current status: the Figma library is currently empty.
- Current note: the initial `Button` styles in this repository are proof-of-concept styles and are not yet sourced from final Figma token definitions.

## What to Look For in the Demos

- Same component API across frameworks.
- Same visual intent hierarchy (`primary`, `secondary`, `tertiary`).
- Same behavior for hover, active, focus, and disabled states.
- Same slotted content behavior and clickable interactions.
- Framework-native state updates driven by the same underlying web component.

## Table of Contents

- [Start Here (2-Minute Demo)](#start-here-2-minute-demo)
- [What Changed Recently](#what-changed-recently)
- [Figma Design Source](#figma-design-source)
- [What to Look For in the Demos](#what-to-look-for-in-the-demos)
- [Support Matrix](#support-matrix)
- [Packages](#packages)
- [How It Works (Single Core, Multiple Frameworks)](#how-it-works-single-core-multiple-frameworks)
- [Install](#install)
- [Framework Setup Examples](#framework-setup-examples)
- [Smoke Testing (How It Works)](#smoke-testing-how-it-works)
- [Storybook and Chromatic Workflow](#storybook-and-chromatic-workflow)
- [Release and Publish Workflow](#release-and-publish-workflow)
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

## Smoke Testing (How It Works)

The `testing/` workspace is the smoke-test harness that replaced committed demo apps (`apps/` and `live_apps/`).

This keeps the repository slim while still verifying real install paths.

### Commands

```bash
# 1) Verify local package changes before publish
npm --prefix testing run verify:local

# 2) Verify npm-published packages after publish
npm --prefix testing run verify:npm
```

### `verify:local` flow

1. Builds local packages: `core`, `react`, `angular_18`, `angular_21`.
2. Packs each into tarballs.
3. Generates temporary apps under `.tmp/smoke-local`:
   - React Vite
   - React Next.js
   - Angular 18
   - Angular 21
4. Installs local tarballs into those apps.
5. Runs framework builds to confirm imports and compilation.

### `verify:npm` flow

1. Generates temporary apps under `.tmp/smoke-npm` for the same framework matrix.
2. Installs from npm registry instead of local tarballs.
3. Runs framework builds to validate published artifacts.

Version pinning is supported:

```bash
ACCRETION_CORE_VERSION=<core_version> \
ACCRETION_REACT_VERSION=<react_version> \
ACCRETION_ANGULAR_18_VERSION=<angular_18_version> \
ACCRETION_ANGULAR_21_VERSION=<angular_21_version> \
npm --prefix testing run verify:npm
```

### Manual runtime checks after smoke scripts

```bash
npm --prefix .tmp/smoke-local/react-vite-local start
npm --prefix .tmp/smoke-local/react-next-local dev
npm --prefix .tmp/smoke-local/angular-18-local start
npm --prefix .tmp/smoke-local/angular-21-local start
```

Validate:

- The three variants render with distinct visual intent.
- Slot text appears inside the button.
- Increment/decrement/reset actions update framework state.

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
# Full local artifact + consumer smoke matrix (React Vite/Next + Angular 18/21)
npm --prefix testing run verify:local
```

#### 2) Update package versions

Choose `patch`, `minor`, or `major` based on the release scope.

```bash
npm --prefix components/core version patch --no-git-tag-version
npm --prefix components/react version patch --no-git-tag-version
npm --prefix components/angular version patch --no-git-tag-version
npm --prefix components/angular_21 version patch --no-git-tag-version
```

After bumping core, align wrapper references to the new core version:

```bash
CORE_VERSION="$(node -p "require('./components/core/package.json').version")"
npm --prefix components/react pkg set "dependencies.@accretion_ui/core=^${CORE_VERSION}"
npm --prefix components/angular pkg set "peerDependencies.@accretion_ui/core=^${CORE_VERSION}"
npm --prefix components/angular_21 pkg set "peerDependencies.@accretion_ui/core=^${CORE_VERSION}"
npm --prefix components/react install --package-lock-only
npm --prefix components/angular install --package-lock-only
npm --prefix components/angular_21 install --package-lock-only
```

#### 3) Build production artifacts

```bash
npm --prefix components/core run build
npm --prefix components/react run build
npm --prefix components/angular run build
npm --prefix components/angular_21 run build
```

#### 4) Publish to npm (strict order)

```bash
npm --prefix components/core run publish:package
npm --prefix components/react run publish:package
npm --prefix components/angular run publish:package
npm --prefix components/angular_21 run publish:package
```

#### 5) Post-publish validation

```bash
CORE_VERSION="$(node -p "require('./components/core/package.json').version")"
REACT_VERSION="$(node -p "require('./components/react/package.json').version")"
ANGULAR_18_VERSION="$(node -p "require('./components/angular/package.json').version")"
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
```

Release guardrails:

- Publish `@accretion_ui/core` first.
- Publish wrapper packages only after core publish succeeds.
- Never republish an existing version number.
- If publish fails mid-sequence, fix the issue and resume from the first unpublished package.

## Contributing

### Branch strategy

- Branch from `main`.
- Use `codex/<feature_name>` naming.
- Keep change sets scoped (core logic, wrappers, stories, docs, testing).

### Typical change flow

1. Update component logic/styles in `components/core`.
2. Build wrappers (`components/react`, `components/angular`, `components/angular_21`).
3. Run smoke tests in `testing/` (`verify:local`, then `verify:npm` when needed).
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
- `components/angular`: Angular 18-20 wrapper (`@accretion_ui/angular_18`)
- `components/angular_21`: Angular 21 wrapper (`@accretion_ui/angular_21`)
- `chromatic`: Storybook + Chromatic projects for all wrappers
- `testing`: generated smoke-test harness for local tarballs and npm-installed packages
- `.tmp`: temporary generated apps used by smoke testing (gitignored)

## Coming Soon (TODO)

- Add per-component Figma references with direct token mapping links.
- Move proof-of-concept Button styles to finalized Figma-backed token definitions.
- Expand component coverage beyond Button while preserving one-core/multi-wrapper generation.
- Add documented accessibility expectations and test status per component.
