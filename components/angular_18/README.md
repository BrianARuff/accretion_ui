# @accretion_ui/angular_18

Angular wrappers for Accretion UI web components for Angular 18-20 applications.

## Installation

```bash
npm install @accretion_ui/angular_18 @accretion_ui/core
```

## Usage (standalone)

```ts
import { Component } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_18';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: '<accretion-button>Click Me</accretion-button>'
})
export class AppComponent {}
```

## SSR and SSG

Import the package predefine stylesheet in your application stylesheet so unresolved custom elements stay hidden until the browser defines them:

```css
@import "@accretion_ui/angular_18/predefine.css";
```

Runtime style injection still runs as a client fallback, but it cannot prevent a first-paint flash if this stylesheet was not already part of the initial HTML or CSS payload.

## Peer dependencies

- `@angular/core` `>=18.0.0 <21.0.0`
- `@angular/common` `>=18.0.0 <21.0.0`
- `rxjs` `^7.8.0`
- `@accretion_ui/core` `^0.1.0`
