# @accretion/angular_21

Angular wrappers for Accretion UI web components for Angular 21 applications.

## Installation

```bash
npm install @accretion/angular_21 @accretion/core
```

## Usage (standalone)

```ts
import { Component } from '@angular/core';
import { AccretionButton } from '@accretion/angular_21';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: '<accretion-button>Click Me</accretion-button>'
})
export class AppComponent {}
```

## Peer dependencies

- `@angular/core` `>=21.0.0 <22.0.0`
- `@angular/common` `>=21.0.0 <22.0.0`
- `rxjs` `^7.8.0`
- `@accretion/core` `^0.1.0`
