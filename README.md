# Accretion UI

Accretion UI is a single-source component library built with Stencil web components and published framework wrappers for React and Angular.

## Table of Contents

- [Overview](#overview)
- [Support Matrix](#support-matrix)
- [Packages](#packages)
- [Install](#install)
- [Framework Setup Examples](#framework-setup-examples)
  - [Angular 18 (`npx @angular/cli@18 new my-app`)](#angular-18-npx-angularcli18-new-my-app)
  - [Latest Angular (`ng new my-app`)](#latest-angular-ng-new-my-app)
  - [React + Vite](#react--vite)
  - [React + CRA](#react--cra)
  - [React + Next.js](#react--nextjs)
- [Architecture and Wiring](#architecture-and-wiring)
- [Contributing](#contributing)
- [Release and Publish Flow](#release-and-publish-flow)
- [Storybook and Chromatic](#storybook-and-chromatic)
- [Repository and Branch Map](#repository-and-branch-map)
- [Package and Chromatic Repositories](#package-and-chromatic-repositories)
- [Project Layout](#project-layout)

## Overview

Accretion UI is designed around one core idea:

- Build components once in `@accretion_ui/core` (Stencil web components).
- Generate and ship framework wrappers as separate packages.
- Keep each wrapper publishable independently while sharing the same core behavior and styles.

## Support Matrix

| Area | Oldest Supported | Newest Supported |
|---|---|---|
| Angular wrappers | Angular `18.x` (`@accretion_ui/angular_18`) | Angular `21.x` (`@accretion_ui/angular_21`) |
| React wrapper | React `18.2.0` | React `19.x` |
| Angular package split | `@accretion_ui/angular_18` for `>=18 <21` | `@accretion_ui/angular_21` for `>=21 <22` |

## Packages

| Package | Purpose |
|---|---|
| `@accretion_ui/core` | Stencil web components and loader output |
| `@accretion_ui/react` | React wrappers generated from core components |
| `@accretion_ui/angular_18` | Angular wrappers for Angular 18-20 |
| `@accretion_ui/angular_21` | Angular wrappers for Angular 21 |

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
  template: `<accretion-button>Click Me</accretion-button>`
})
export class AppComponent {}
```

### Latest Angular (`ng new my-app`)

```bash
ng new my-app
cd my-app
npm install @accretion_ui/angular_21 @accretion_ui/core
```

`src/app/app.ts` or `src/app/app.component.ts`

```ts
import { Component } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_21';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: `<accretion-button>Click Me</accretion-button>`
})
export class AppComponent {}
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
import { AccretionButton } from '@accretion_ui/react';

export default function App() {
  return <AccretionButton>Click Me</AccretionButton>;
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
import { AccretionButton } from '@accretion_ui/react';

function App() {
  return <AccretionButton>Click Me</AccretionButton>;
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
import { AccretionButton } from '@accretion_ui/react';

export default function Page() {
  return <AccretionButton>Click Me</AccretionButton>;
}
```

## Architecture and Wiring

### Source of truth

- Core source code lives in `components/core`.
- Components are authored once as web components in Stencil.
- Build output from core is consumed by both wrapper packages.

### React wrapper flow

- React wrapper source lives in `components/react`.
- Wrapper generation is driven by `@stencil/react-output-target` against core output.
- Published package: `@accretion_ui/react`.
- Consumer API goal: `import { AccretionButton } from '@accretion_ui/react'`.

### Angular wrapper flow

- Angular 18-20 wrapper source lives in `components/angular`.
- Angular 21 wrapper source lives in `components/angular_21`.
- Both wrappers consume the same core package but maintain Angular-version-specific compatibility.
- Published packages:
  - `@accretion_ui/angular_18` for `>=18 <21`
  - `@accretion_ui/angular_21` for `>=21 <22`

### Why separate Angular packages

- Angular metadata/runtime compatibility changed between version bands.
- Separate wrapper packages avoid forcing consumers into one Angular major line.
- Consumers install the package matching their Angular major and keep imports simple.

## Contributing

### 1. Branching model

- Branch from `main` for all work.
- Use `codex/<feature_name>` naming for feature branches.
- Keep changes focused by concern (components, wrappers, docs, or chromatic).

### 2. Local development order

When making component changes:

1. Update component code in `components/core`.
2. Build core.
3. Build wrappers (`components/react`, `components/angular`, `components/angular_21`).
4. Verify in `apps/*` (local package linking flow).
5. Verify in `live_apps/*` (npm-installed package flow).

### 3. Validation checklist before PR

- `npm run build` succeeds in each package you changed.
- Render check in at least one Angular app and one React app.
- Storybook updates added for UI behavior changes.
- Chromatic publish succeeds for affected wrappers.

## Release and Publish Flow

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

Notes:

- Publish `@accretion_ui/core` first.
- Update wrapper dependency ranges if needed, then publish wrappers.
- Never republish an existing version number.

## Storybook and Chromatic

The `chromatic` workspace contains three independent Storybook projects:

- `chromatic/react`
- `chromatic/angular_18`
- `chromatic/angular_21`

Install once:

```bash
cd chromatic
npm run install:all
```

Run local Storybooks:

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

### Required OS-level environment variables

Set in `~/.config/accretion_ui/chromatic.env`:

```bash
export CHROMATIC_PROJECT_TOKEN_REACT="<token>"
export CHROMATIC_PROJECT_TOKEN_ANGULAR_18="<token>"
export CHROMATIC_PROJECT_TOKEN_ANGULAR_21="<token>"
```

Load now (current shell):

```bash
source ~/.zshrc
```

Update Storybook or Chromatic config per package:

- React stories: `chromatic/react/src/*.stories.tsx`
- Angular 18 stories: `chromatic/angular_18/src/*.stories.ts`
- Angular 21 stories: `chromatic/angular_21/src/*.stories.ts`
- Shared Storybook settings: each package’s `.storybook/` folder

Detailed commands and split-repo syncing steps are in `chromatic/README.md`.

## Repository and Branch Map

### Main development repository

- [accretion_ui](https://github.com/BrianARuff/accretion_ui)

### Active branches in this repository

- [`main`](https://github.com/BrianARuff/accretion_ui/tree/main): stable integration branch.
- [`codex/primitive_tokens`](https://github.com/BrianARuff/accretion_ui/tree/codex/primitive_tokens): token naming and token-description work.
- [`codex/component_library`](https://github.com/BrianARuff/accretion_ui/tree/codex/component_library): core Stencil + React/Angular wrapper foundation.
- [`codex/storybook_chromatic`](https://github.com/BrianARuff/accretion_ui/tree/codex/storybook_chromatic): Storybook/Chromatic integration workspace.

## Package and Chromatic Repositories

### Package repositories

- Core package source context: [accretion_ui](https://github.com/BrianARuff/accretion_ui)
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
