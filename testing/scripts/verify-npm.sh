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
import { AccretionButton } from '@accretion_ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p>Count: {count}</p>
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
EOF_MAIN

  log "Installing React Vite npm smoke app dependencies"
  npm_exec --prefix "$app_dir" install

  log "Building React Vite npm smoke app"
  npm_exec --prefix "$app_dir" run build
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
    "dev": "next dev"
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
import { AccretionButton } from '@accretion_ui/react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <main style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
      <p>Count: {count}</p>
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
EOF_PAGE

  log "Installing React Next npm smoke app dependencies"
  npm_exec --prefix "$app_dir" install

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

  if [[ -f "$app_dir/src/app/app.ts" ]]; then
    cat > "$app_dir/src/app/app.ts" <<'EOF_APP_21'
import { Component, signal } from '@angular/core';
import { AccretionButton } from '@accretion_ui/angular_21';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccretionButton],
  template: `
    <main style="display:grid;gap:12px;max-width:320px;padding:16px;">
      <p><strong>Count:</strong> {{ count() }}</p>
      <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
      <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
      <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
    </main>
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
EOF_APP_21
  else
    cat > "$app_dir/src/app/app.component.ts" <<'EOF_APP_18'
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
EOF_APP_18
  fi

  log "Building Angular ${angular_major} npm smoke app"
  npm_exec --prefix "$app_dir" run build
}

main() {
  log "Cleaning smoke work directory: $WORK_DIR"
  rm -rf "$WORK_DIR"
  mkdir -p "$WORK_DIR"

  write_react_vite_app
  write_react_next_app
  setup_angular_app 18 "@accretion_ui/angular_18" "$ANGULAR_18_VERSION"
  setup_angular_app 21 "@accretion_ui/angular_21" "$ANGULAR_21_VERSION"

  log "All npm smoke checks passed. Artifacts left in: $WORK_DIR"
}

main "$@"
