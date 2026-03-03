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

## Peer dependencies

- `@angular/core` `>=18.0.0 <21.0.0`
- `@angular/common` `>=18.0.0 <21.0.0`
- `rxjs` `^7.8.0`
- `@accretion_ui/core` `^0.1.0`
