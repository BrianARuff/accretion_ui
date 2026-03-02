# Accretion UI Component Library Structure

This repository uses independent package folders under `components/` rather than npm workspaces.

## Packages

- `components/core` -> `@accretion/core` (Stencil web components)
- `components/react` -> `@accretion/react` (React wrappers)
- `components/angular` -> `@accretion/angular` (Angular wrappers)

## Dependency strategy

- `@accretion/core` is the source of truth for component implementation.
- React and Angular wrappers are generated from the Stencil build output.
- Wrapper packages declare `@accretion/core` as a `peerDependency` so consumers control compatible core versions.
- Wrapper packages also include `@accretion/core` as a local `devDependency` (`file:../core`) so they can build in this repo without a workspace.

## Build order

1. Build `@accretion/core`
2. Build `@accretion/react` and/or `@accretion/angular`

Each wrapper package also runs core generation in its own `build` script, so they can be built independently from their package directory.

## Publish order

1. Publish `@accretion/core`
2. Publish `@accretion/react` and `@accretion/angular` (in any order)

When releasing breaking core changes, update peer ranges in wrapper packages before publishing.

## Publish commands

- Core: `cd components/core && npm run publish:package`
- React: `cd components/react && npm run publish:package`
- Angular: `cd components/angular && npm run publish:package`
