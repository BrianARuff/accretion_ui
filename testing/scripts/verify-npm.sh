#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WORK_DIR="${ACCRETION_TEST_WORKDIR:-$ROOT_DIR/.tmp/smoke-npm}"

CORE_VERSION="${ACCRETION_CORE_VERSION:-latest}"
REACT_VERSION="${ACCRETION_REACT_VERSION:-latest}"
ANGULAR_18_VERSION="${ACCRETION_ANGULAR_18_VERSION:-latest}"
ANGULAR_21_VERSION="${ACCRETION_ANGULAR_21_VERSION:-latest}"

log() {
  printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

npm_exec() {
  env -u npm_config_prefix -u npm_prefix npm "$@"
}

write_react_vite_app() {
  local app_dir="$WORK_DIR/react-vite-npm"

  mkdir -p "$app_dir/src"

  cat > "$app_dir/package.json" <<EOF_PACKAGE
{
  "name": "accretion-react-vite-npm-smoke",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "start": "vite"
  },
  "dependencies": {
    "@accretion_ui/react": "$REACT_VERSION",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "typescript": "^5.9.3",
    "vite": "^7.3.1"
  }
}
EOF_PACKAGE

  cat > "$app_dir/index.html" <<'EOF_HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Accretion React Vite NPM Smoke</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF_HTML

  cat > "$app_dir/tsconfig.json" <<'EOF_TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
EOF_TSCONFIG

cat > "$app_dir/src/main.tsx" <<'EOF_MAIN'
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AccretionAccordion,
  AccretionAccordionHeader,
  AccretionAccordionItem,
  AccretionAccordionPanel,
  AccretionAccordionTrigger,
  AccretionButton
} from '@accretion_ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p><strong>Button count:</strong> {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
        Decrement Count
      </AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
        Reset Count
      </AccretionButton>

      <AccretionAccordion
        type="single"
        collapsible
        style={{ marginTop: '0.5rem', maxWidth: '36rem' }}
      >
        <AccretionAccordionItem value="smoke-accordion" open>
          <AccretionAccordionHeader>
            <AccretionAccordionTrigger>Accordion import smoke check</AccretionAccordionTrigger>
          </AccretionAccordionHeader>
          <AccretionAccordionPanel>
            <p style={{ margin: 0 }}>
              React wrapper + core custom elements for Accordion render successfully.
            </p>
          </AccretionAccordionPanel>
        </AccretionAccordionItem>
      </AccretionAccordion>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
EOF_MAIN

  log "Installing React Vite npm smoke app dependencies"
  npm_exec --prefix "$app_dir" install

  local react_has_accordion='false'
  local react_components_dts="$app_dir/node_modules/@accretion_ui/react/dist/generated/components.d.ts"

  if [[ -f "$react_components_dts" ]] && rg -q 'AccretionAccordion' "$react_components_dts"; then
    react_has_accordion='true'
  fi

  if [[ "$react_has_accordion" != 'true' ]]; then
    log "Published @accretion_ui/react does not expose Accordion yet; falling back to button-only npm smoke test"
    cat > "$app_dir/src/main.tsx" <<'EOF_MAIN_FALLBACK'
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AccretionButton } from '@accretion_ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p><strong>Button count:</strong> {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
        Decrement Count
      </AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
        Reset Count
      </AccretionButton>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
EOF_MAIN_FALLBACK
  fi

  log "Building React Vite npm smoke app"
  npm_exec --prefix "$app_dir" run build
}

write_react_cra_app() {
  local app_dir="$WORK_DIR/react-cra-npm"

  mkdir -p "$app_dir/public" "$app_dir/src"

  cat > "$app_dir/package.json" <<EOF_PACKAGE
{
  "name": "accretion-react-cra-npm-smoke",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "build": "react-scripts build",
    "start": "react-scripts start"
  },
  "dependencies": {
    "@accretion_ui/react": "$REACT_VERSION",
    "@types/node": "^20.19.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  }
}
EOF_PACKAGE

  cat > "$app_dir/tsconfig.json" <<'EOF_TSCONFIG'
{
  "extends": "./node_modules/react-scripts/tsconfig.json",
  "include": ["src"]
}
EOF_TSCONFIG

  cat > "$app_dir/public/index.html" <<'EOF_HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Accretion React CRA NPM Smoke</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF_HTML

  cat > "$app_dir/src/index.tsx" <<'EOF_INDEX'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
EOF_INDEX

  cat > "$app_dir/src/react-app-env.d.ts" <<'EOF_ENV'
/// <reference types="react-scripts" />
EOF_ENV

  cat > "$app_dir/src/App.tsx" <<'EOF_APP'
import { useState } from 'react';
import {
  AccretionAccordion,
  AccretionAccordionHeader,
  AccretionAccordionItem,
  AccretionAccordionPanel,
  AccretionAccordionTrigger,
  AccretionButton
} from '@accretion_ui/react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p><strong>Button count:</strong> {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
        Decrement Count
      </AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
        Reset Count
      </AccretionButton>

      <AccretionAccordion
        type="single"
        collapsible
        style={{ marginTop: '0.5rem', maxWidth: '36rem' }}
      >
        <AccretionAccordionItem value="smoke-accordion" open>
          <AccretionAccordionHeader>
            <AccretionAccordionTrigger>Accordion import smoke check</AccretionAccordionTrigger>
          </AccretionAccordionHeader>
          <AccretionAccordionPanel>
            <p style={{ margin: 0 }}>
              React wrapper + core custom elements for Accordion render successfully.
            </p>
          </AccretionAccordionPanel>
        </AccretionAccordionItem>
      </AccretionAccordion>
    </main>
  );
}
EOF_APP

  log "Installing React CRA npm smoke app dependencies"
  npm_exec --prefix "$app_dir" install

  local react_has_accordion='false'
  local react_components_dts="$app_dir/node_modules/@accretion_ui/react/dist/generated/components.d.ts"

  if [[ -f "$react_components_dts" ]] && rg -q 'AccretionAccordion' "$react_components_dts"; then
    react_has_accordion='true'
  fi

  if [[ "$react_has_accordion" != 'true' ]]; then
    log "Published @accretion_ui/react does not expose Accordion yet; falling back to button-only npm smoke test"
    cat > "$app_dir/src/App.tsx" <<'EOF_APP_FALLBACK'
import { useState } from 'react';
import { AccretionButton } from '@accretion_ui/react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p><strong>Button count:</strong> {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
        Decrement Count
      </AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
        Reset Count
      </AccretionButton>
    </main>
  );
}
EOF_APP_FALLBACK
  fi

  log "Building React CRA npm smoke app"
  CI=true npm_exec --prefix "$app_dir" run build
}

write_react_next_app() {
  local app_dir="$WORK_DIR/react-next-npm"

  mkdir -p "$app_dir/app"

  cat > "$app_dir/package.json" <<EOF_PACKAGE
{
  "name": "accretion-react-next-npm-smoke",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "start": "next start"
  },
  "dependencies": {
    "@accretion_ui/react": "$REACT_VERSION",
    "next": "^16.1.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.18.9",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "typescript": "^5.9.3"
  }
}
EOF_PACKAGE

  cat > "$app_dir/next.config.mjs" <<'EOF_NEXT_CONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
EOF_NEXT_CONFIG

  cat > "$app_dir/tsconfig.json" <<'EOF_TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF_TSCONFIG

  cat > "$app_dir/next-env.d.ts" <<'EOF_NEXT_ENV'
/// <reference types="next" />
/// <reference types="next/image-types/global" />
EOF_NEXT_ENV

  cat > "$app_dir/app/layout.tsx" <<'EOF_LAYOUT'
import type { ReactNode } from 'react';
import '@accretion_ui/react/predefine.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF_LAYOUT

cat > "$app_dir/app/page.tsx" <<'EOF_PAGE'
'use client';

import { useState } from 'react';
import {
  AccretionAccordion,
  AccretionAccordionHeader,
  AccretionAccordionItem,
  AccretionAccordionPanel,
  AccretionAccordionTrigger,
  AccretionButton
} from '@accretion_ui/react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p><strong>Button count:</strong> {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
        Decrement Count
      </AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
        Reset Count
      </AccretionButton>

      <AccretionAccordion
        type="single"
        collapsible
        style={{ marginTop: '0.5rem', maxWidth: '36rem' }}
      >
        <AccretionAccordionItem value="smoke-accordion" open>
          <AccretionAccordionHeader>
            <AccretionAccordionTrigger>Accordion import smoke check</AccretionAccordionTrigger>
          </AccretionAccordionHeader>
          <AccretionAccordionPanel>
            <p style={{ margin: 0 }}>
              React wrapper + core custom elements for Accordion render successfully.
            </p>
          </AccretionAccordionPanel>
        </AccretionAccordionItem>
      </AccretionAccordion>
    </main>
  );
}
EOF_PAGE

  log "Installing React Next npm smoke app dependencies"
  npm_exec --prefix "$app_dir" install

  local react_has_accordion='false'
  local react_components_dts="$app_dir/node_modules/@accretion_ui/react/dist/generated/components.d.ts"

  if [[ -f "$react_components_dts" ]] && rg -q 'AccretionAccordion' "$react_components_dts"; then
    react_has_accordion='true'
  fi

  if [[ "$react_has_accordion" != 'true' ]]; then
    log "Published @accretion_ui/react does not expose Accordion yet; falling back to button-only npm smoke test"
    cat > "$app_dir/app/page.tsx" <<'EOF_PAGE_FALLBACK'
'use client';

import { useState } from 'react';
import { AccretionButton } from '@accretion_ui/react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p><strong>Button count:</strong> {count}</p>
      <AccretionButton variant="primary" onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </AccretionButton>
      <AccretionButton variant="secondary" onClick={() => setCount((value) => value - 1)}>
        Decrement Count
      </AccretionButton>
      <AccretionButton variant="tertiary" onClick={() => setCount(0)}>
        Reset Count
      </AccretionButton>
    </main>
  );
}
EOF_PAGE_FALLBACK
  fi

  log "Building React Next npm smoke app"
  npm_exec --prefix "$app_dir" run build
}

setup_angular_app() {
  local angular_major="$1"
  local wrapper_package="$2"
  local wrapper_version="$3"
  local app_dir="$WORK_DIR/angular-${angular_major}-npm"
  local app_name="angular-${angular_major}-npm"

  log "Scaffolding Angular ${angular_major} npm smoke app"
  (
    cd "$WORK_DIR"
    npm_exec exec --yes @angular/cli@"${angular_major}" -- new "$app_name" \
      --skip-git \
      --skip-tests \
      --defaults \
      --standalone \
      --routing false \
      --style css \
      --package-manager npm
  )

  log "Installing ${wrapper_package}@${wrapper_version} and @accretion_ui/core@${CORE_VERSION}"
  npm_exec --prefix "$app_dir" install "@accretion_ui/core@${CORE_VERSION}" "${wrapper_package}@${wrapper_version}"

  cat > "$app_dir/src/styles.css" <<EOF_STYLES
@import "${wrapper_package}/predefine.css";
EOF_STYLES

  local angular_has_accordion='false'
  local wrapper_dir="$app_dir/node_modules/${wrapper_package}"

  if [[ -d "$wrapper_dir" ]] && rg -q 'AccretionAccordion' "$wrapper_dir" --glob '*.d.ts'; then
    angular_has_accordion='true'
  fi

  if [[ "$angular_has_accordion" == 'true' ]]; then
    if [[ -f "$app_dir/src/app/app.ts" ]]; then
      cat > "$app_dir/src/app/app.ts" <<'EOF_APP_21'
import { Component, signal } from '@angular/core';
import {
  AccretionAccordion,
  AccretionAccordionHeader,
  AccretionAccordionItem,
  AccretionAccordionPanel,
  AccretionAccordionTrigger,
  AccretionButton
} from '@accretion_ui/angular_21';

type AccordionItem = {
  content: string;
  open: boolean;
  title: string;
  value: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AccretionAccordion,
    AccretionAccordionHeader,
    AccretionAccordionItem,
    AccretionAccordionPanel,
    AccretionAccordionTrigger,
    AccretionButton
  ],
  templateUrl: './app.html'
})
export class App {
  count = signal(0);
  accordionItems = signal<AccordionItem[]>([
    {
      content: 'First item panel content.',
      open: false,
      title: 'First section',
      value: 'item-1'
    },
    {
      content: 'Second item panel content.',
      open: true,
      title: 'Second section',
      value: 'item-2'
    },
    {
      content: 'Third item panel content.',
      open: false,
      title: 'Third section',
      value: 'item-3'
    }
  ]);

  increment() {
    this.count.update((value) => value + 1);
  }

  decrement() {
    this.count.update((value) => value - 1);
  }

  reset() {
    this.count.set(0);
  }

  handleAccordionOpenChange(event: Event) {
    const detail = (event as CustomEvent<{ openValueLookup: Record<string, true> }>).detail;

    this.accordionItems.update((items) =>
      items.map((item) => ({
        ...item,
        open: Boolean(detail.openValueLookup[item.value])
      }))
    );
  }
}
EOF_APP_21
      cat > "$app_dir/src/app/app.html" <<'EOF_APP_21_HTML'
<main style="display:grid;gap:12px;max-width:560px;padding:16px;">
  <p><strong>Count:</strong> {{ count() }}</p>
  <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
  <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
  <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>

  <accretion-accordion
    type="multiple"
    [collapsible]="true"
    [sizeVariant]="'compact'"
    (accretionOpenChange)="handleAccordionOpenChange($event)"
    style="margin-top:8px;"
  >
    @for (item of accordionItems(); track item.value) {
      <accretion-accordion-item [open]="item.open" [value]="item.value">
        <accretion-accordion-header>
          <accretion-accordion-trigger>{{ item.title }}</accretion-accordion-trigger>
        </accretion-accordion-header>
        <accretion-accordion-panel>
          <p style="margin:0;">{{ item.content }}</p>
        </accretion-accordion-panel>
      </accretion-accordion-item>
    }
  </accretion-accordion>
</main>
EOF_APP_21_HTML
    else
      cat > "$app_dir/src/app/app.component.ts" <<'EOF_APP_18'
import { Component } from '@angular/core';
import {
  AccretionAccordion,
  AccretionAccordionHeader,
  AccretionAccordionItem,
  AccretionAccordionPanel,
  AccretionAccordionTrigger,
  AccretionButton
} from '@accretion_ui/angular_18';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AccretionAccordion,
    AccretionAccordionHeader,
    AccretionAccordionItem,
    AccretionAccordionPanel,
    AccretionAccordionTrigger,
    AccretionButton
  ],
  template: `
    <main style="display:grid;gap:12px;max-width:560px;padding:16px;">
      <p><strong>Count:</strong> {{ count }}</p>
      <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
      <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
      <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>

      <accretion-accordion type="single" [collapsible]="true" style="margin-top:8px;">
        <accretion-accordion-item value="smoke-accordion" [open]="true">
          <accretion-accordion-header>
            <accretion-accordion-trigger>Accordion import smoke check</accretion-accordion-trigger>
          </accretion-accordion-header>
          <accretion-accordion-panel>
            <p style="margin:0;">Angular wrapper + core custom elements for Accordion render successfully.</p>
          </accretion-accordion-panel>
        </accretion-accordion-item>
      </accretion-accordion>
    </main>
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
EOF_APP_18
    fi
  else
    log "Published ${wrapper_package} does not expose Accordion yet; falling back to button-only npm smoke test"
    if [[ -f "$app_dir/src/app/app.ts" ]]; then
      cat > "$app_dir/src/app/app.ts" <<'EOF_APP_21_BUTTON_ONLY'
import { Component, signal } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_21';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  templateUrl: './app.html'
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
EOF_APP_21_BUTTON_ONLY
      cat > "$app_dir/src/app/app.html" <<'EOF_APP_21_BUTTON_ONLY_HTML'
<main style="display:grid;gap:12px;max-width:320px;padding:16px;">
  <p><strong>Count:</strong> {{ count() }}</p>
  <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
  <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
  <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
</main>
EOF_APP_21_BUTTON_ONLY_HTML
    else
      cat > "$app_dir/src/app/app.component.ts" <<'EOF_APP_18_BUTTON_ONLY'
import { Component } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_18';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: `
    <main style="display:grid;gap:12px;max-width:320px;padding:16px;">
      <p><strong>Count:</strong> {{ count }}</p>
      <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
      <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
      <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
    </main>
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
EOF_APP_18_BUTTON_ONLY
    fi
  fi

  log "Building Angular ${angular_major} npm smoke app"
  npm_exec --prefix "$app_dir" run build
}

main() {
  log "Cleaning smoke work directory: $WORK_DIR"
  rm -rf "$WORK_DIR"
  mkdir -p "$WORK_DIR"

  write_react_vite_app
  write_react_cra_app
  write_react_next_app
  setup_angular_app 18 "@accretion_ui/angular_18" "$ANGULAR_18_VERSION"
  setup_angular_app 21 "@accretion_ui/angular_21" "$ANGULAR_21_VERSION"

  log "All npm smoke checks passed. Artifacts left in: $WORK_DIR"
}

main "$@"
