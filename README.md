# Accretion UI

Accretion UI is a component library built on Stencil web components with framework wrappers for React and Angular.

## Table of Contents

- [What Is Accretion UI?](#what-is-accretion-ui)
- [Packages](#packages)
- [Install in an Existing Project](#install-in-an-existing-project)
- [Setup Examples](#setup-examples)
  - [Angular 18 (`npx @angular/cli@18 new my-app`)](#angular-18-npx-angularcli18-new-my-app)
  - [Latest Angular (`ng new my-app`)](#latest-angular-ng-new-my-app)
  - [React + Vite](#react--vite)
  - [React + CRA](#react--cra)
  - [React + Next.js](#react--nextjs)
- [Repository Layout](#repository-layout)

## What Is Accretion UI?

Accretion UI provides:

- A shared core package of web components: `@accretion_ui/core`
- React wrappers: `@accretion_ui/react`
- Angular wrappers for Angular 18-20: `@accretion_ui/angular_18`
- Angular wrappers for Angular 21: `@accretion_ui/angular_21`

The goal is one component system with framework-friendly APIs.

## Packages

| Package | Use For |
|---|---|
| `@accretion_ui/core` | Base Stencil web components |
| `@accretion_ui/react` | React apps (Vite, CRA, Next.js) |
| `@accretion_ui/angular_18` | Angular 18-20 apps |
| `@accretion_ui/angular_21` | Angular 21 apps |

## Install in an Existing Project

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

## Setup Examples

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

`src/app/app.ts` or `src/app/app.component.ts` (depending on Angular project template)

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

## Repository Layout

- `components/core`: Stencil core components (`@accretion_ui/core`)
- `components/react`: React wrapper package (`@accretion_ui/react`)
- `components/angular`: Angular 18 wrapper package (`@accretion_ui/angular_18`)
- `components/angular_21`: Angular 21 wrapper package (`@accretion_ui/angular_21`)
- `apps`: local integration apps using local package references
- `live_apps`: local integration apps using npm-published packages
