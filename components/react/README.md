# @accretion_ui/react

React wrappers for Accretion UI web components.

## Installation

```bash
npm install @accretion_ui/react
```

## Usage

```tsx
import { AccretionButton } from '@accretion_ui/react';

export function Example() {
  return <AccretionButton>Click Me</AccretionButton>;
}
```

## SSR and SSG

Import the package predefine stylesheet in your top-level entry so unresolved custom elements stay hidden until the browser defines them:

```tsx
import '@accretion_ui/react/predefine.css';
```

Runtime style injection still runs as a client fallback, but it cannot prevent a first-paint flash if this stylesheet was not already part of the initial HTML or CSS payload.

## Peer dependencies

- `react` `^18.2.0 || ^19.0.0`
- `react-dom` `^18.2.0 || ^19.0.0`

`@accretion_ui/core` is installed automatically as a direct dependency of `@accretion_ui/react`.
