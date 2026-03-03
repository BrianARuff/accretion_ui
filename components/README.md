# Accretion UI Component Library Structure

This repository uses independent package folders under `components/` rather than npm workspaces.

## Packages

- `components/core` -> `@accretion_ui/core` (Stencil web components)
- `components/react` -> `@accretion_ui/react` (React wrappers)
- `components/angular` -> `@accretion_ui/angular_18` (Angular 18-20 wrappers)
- `components/angular_21` -> `@accretion_ui/angular_21` (Angular 21 wrappers)

## Dependency strategy

- `@accretion_ui/core` is the source of truth for component implementation.
- React and Angular wrappers are generated from the Stencil build output.
- Wrapper packages declare `@accretion_ui/core` as a `peerDependency` so consumers control compatible core versions.
- Wrapper packages also include `@accretion_ui/core` as a local `devDependency` (`file:../core`) so they can build in this repo without a workspace.

## Build order

1. Build `@accretion_ui/core`
2. Build `@accretion_ui/react` and/or `@accretion_ui/angular_18` and/or `@accretion_ui/angular_21`

Each wrapper package also runs core generation in its own `build` script, so they can be built independently from their package directory.

## Publish order

1. Publish `@accretion_ui/core`
2. Publish `@accretion_ui/react`, `@accretion_ui/angular_18`, and/or `@accretion_ui/angular_21` (in any order)

When releasing breaking core changes, update peer ranges in wrapper packages before publishing.

## Publish commands

- Core: `cd components/core && npm run publish:package`
- React: `cd components/react && npm run publish:package`
- Angular 18: `cd components/angular && npm run publish:package`
- Angular 21: `cd components/angular_21 && npm run publish:package`
