# Accretion UI

Accretion UI is a cross-framework component system built from one core web component library and distributed to multiple framework ecosystems.

For design and product leadership, the key proof point is simple: one component implementation can ship consistent UX across React and multiple Angular major lines without fragmenting the design language.

## Start Here (2-Minute Demo)

If you only have a few minutes, open these first:

| Framework Target | Storybook | Chromatic Project | npm Package |
|---|---|---|---|
| React (`@accretion_ui/react`) | [View Storybook](https://69a694b696baf333e562e9f1-zcrcmxxtjj.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a694b696baf333e562e9f1) | [@accretion_ui/react](https://www.npmjs.com/package/@accretion_ui/react) |
| Angular 18 (`@accretion_ui/angular_18`) | [View Storybook](https://69a69540931282436807583e-zyafvjwbtc.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a69540931282436807583e) | [@accretion_ui/angular_18](https://www.npmjs.com/package/@accretion_ui/angular_18) |
| Angular 21 (`@accretion_ui/angular_21`) | [View Storybook](https://69a69585a3c2c8accf671d8d-rhfqmwvdgd.chromatic.com/) | [View Chromatic](https://www.chromatic.com/setup?appId=69a69585a3c2c8accf671d8d) | [@accretion_ui/angular_21](https://www.npmjs.com/package/@accretion_ui/angular_21) |

Core package (source of truth): [@accretion_ui/core](https://www.npmjs.com/package/@accretion_ui/core)

## Figma Design Source

- Accretion UI Figma library: [Accretion UI (Figma)](https://www.figma.com/design/d45s1jniPNl5aEbn0DXwV7/Accretion-UI?node-id=0-1&p=f&t=aPkeN5qIwUccQOYk-0)
- Current status: the Figma library is currently empty.
- Current note: the initial `Button` styles in this repository are proof-of-concept styles and are not yet sourced from Figma tokens or final component styling.

## What This Demonstrates

- One source of truth for component behavior, style, and accessibility in `@accretion_ui/core`.
- Auto-generated React and Angular wrappers from the same core, produced by Stencil.
- Support for older and newer Angular major lines without duplicating component implementations.
- Practical framework behavior in Storybook, including interactive state updates.

## How to Read This README

- Fast product/design view: `Start Here` -> `Figma Design Source` -> `Support Matrix` -> `How It Works`.
- Engineering implementation view: `Install` -> `Framework Setup Examples` -> `Contributing` -> `Release and Publish Workflow`.

## Table of Contents

- [Start Here (2-Minute Demo)](#start-here-2-minute-demo)
- [Figma Design Source](#figma-design-source)
- [What This Demonstrates](#what-this-demonstrates)
- [How to Read This README](#how-to-read-this-readme)
- [Support Matrix](#support-matrix)
- [Packages](#packages)
- [How It Works (Single Core, Multiple Frameworks)](#how-it-works-single-core-multiple-frameworks)
- [Install](#install)
- [Framework Setup Examples](#framework-setup-examples)
  - [Angular 18 (`npx @angular/cli@18 new my-app`)](#angular-18-npx-angularcli18-new-my-app)
  - [Latest Angular (`ng new my-app`)](#latest-angular-ng-new-my-app)
  - [React + Vite](#react--vite)
  - [React + CRA](#react--cra)
  - [React + Next.js](#react--nextjs)
- [Contributing](#contributing)
- [Storybook and Chromatic Workflow](#storybook-and-chromatic-workflow)
- [Release and Publish Workflow](#release-and-publish-workflow)
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

Accretion UI uses [Stencil](https://stenciljs.com/docs/introduction) as the compiler for standards-based web components.

Key Stencil references:

- [Stencil Introduction](https://stenciljs.com/docs/introduction)
- [Stencil Output Targets](https://stenciljs.com/docs/output-targets)
- [Stencil React Integration](https://stenciljs.com/docs/react)
- [Stencil Angular Integration](https://stenciljs.com/docs/angular)

Flow:

1. Components are authored once in `components/core`.
2. Stencil builds the core package (`@accretion_ui/core`).
3. Stencil output target tooling generates wrapper libraries for React and Angular.
4. Wrapper libraries are published as independent npm packages.
5. Application teams consume wrappers directly with standard package installs. No app-side code generation step is required.

## Install

### React

```bash
npm install @accretion_ui/react
```

### Angular 18-20

```bash
npm install @accretion_ui/angular_18 @accretion_ui/core
```

### Angular 21

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
    <accretion-button variant="primary" (click)="decrement()">Decrement Count</accretion-button>
    <accretion-button variant="primary" (click)="reset()">Reset Count</accretion-button>
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
    <accretion-button variant="primary" (click)="decrement()">Decrement Count</accretion-button>
    <accretion-button variant="primary" (click)="reset()">Reset Count</accretion-button>
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
      <AccretionButton variant="primary" onClick={() => setCount((value) => value - 1)}>Decrement Count</AccretionButton>
      <AccretionButton variant="primary" onClick={() => setCount(0)}>Reset Count</AccretionButton>
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
      <AccretionButton variant="primary" onClick={() => setCount((value) => value - 1)}>Decrement Count</AccretionButton>
      <AccretionButton variant="primary" onClick={() => setCount(0)}>Reset Count</AccretionButton>
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
      <AccretionButton variant="primary" onClick={() => setCount((value) => value - 1)}>Decrement Count</AccretionButton>
      <AccretionButton variant="primary" onClick={() => setCount(0)}>Reset Count</AccretionButton>
    </>
  );
}
```

## Contributing

### Branch strategy

- Branch from `main`.
- Use `codex/<feature_name>` naming.
- Keep changes scoped by concern (core component logic, wrappers, docs, or chromatic).

### Making component changes

1. Update the component in `components/core`.
2. Build core.
3. Build wrappers (`components/react`, `components/angular`, `components/angular_21`).
4. Validate in `apps/*` (local package flow).
5. Validate in `live_apps/*` (npm-installed package flow).
6. Update stories in `chromatic/*` for changed behavior.

### Pull request checklist

- Builds pass for all touched packages.
- Component behavior validated in at least one Angular app and one React app.
- Storybook stories updated.
- Chromatic publish completed for affected wrapper(s).

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

If needed in your current terminal:

```bash
source ~/.zshrc
```

Where to edit stories and Storybook config:

- React stories: `chromatic/react/src/*.stories.tsx`
- Angular 18 stories: `chromatic/angular_18/src/*.stories.ts`
- Angular 21 stories: `chromatic/angular_21/src/*.stories.ts`
- Storybook config: each package’s `.storybook/` folder

Detailed split-repo sync instructions are in `chromatic/README.md`.

## Release and Publish Workflow

Run from repo root:

```bash
# Core
cd components/core
npm version patch
npm run build
npm publish --access public

# React
cd ../react
npm version patch
npm run build
npm publish --access public

# Angular 18
cd ../angular
npm version patch
npm run build
npm publish ./dist --access public

# Angular 21
cd ../angular_21
npm version patch
npm run build
npm publish ./dist --access public
```

Release notes:

- Publish `@accretion_ui/core` first.
- Then update wrapper dependency ranges if needed.
- Publish wrappers after core is available.
- Never republish an existing version number.

## Repository and Branch Map

### Main development repository

- [accretion_ui](https://github.com/BrianARuff/accretion_ui)

### Active branches

- [`main`](https://github.com/BrianARuff/accretion_ui/tree/main): stable integration branch.
- [`codex/primitive_tokens`](https://github.com/BrianARuff/accretion_ui/tree/codex/primitive_tokens): token naming and token guidance updates.
- [`codex/component_library`](https://github.com/BrianARuff/accretion_ui/tree/codex/component_library): component library foundation and wrapper package setup.
- [`codex/storybook_chromatic`](https://github.com/BrianARuff/accretion_ui/tree/codex/storybook_chromatic): Storybook and Chromatic integration.

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
- `apps`: local verification apps using file-based package references
- `live_apps`: verification apps using npm-published packages
- `chromatic`: Storybook + Chromatic projects for React/Angular wrappers

## Coming Soon (TODO)

- Add a Figma reference section for each component, with direct links to related design tokens.
- Align component styles to Figma token definitions as the design system matures, starting with `Button`.
- Expand component coverage beyond `Button` while preserving one-core/multi-wrapper generation.
- Document per-component accessibility expectations and test status.
