# AGENTS.md

## Persistent Project Rules

1. Structure the root-level `README.md` so the first few sections are written for a non-technical product/design leadership audience.
2. Do not include specific role titles, company names, or company-identifying details in that framing.
3. Keep early sections focused on what Accretion UI is, why it matters, and where to validate value quickly. Later sections are targeted at software engineers.
4. Accessibility guidelines:
    - [WCAG 2+](https://www.w3.org/WAI/standards-guidelines/wcag/)
    - [WCAG 3](https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/)
5. Cross-library parity rule: when a component is changed in one library (core, React, Angular 18, Angular 21, or storybook coverage), apply the same user-facing change to the sibling libraries using the same approach, adapted only for framework/version constraints.

## Release Readiness Protocol (Codex)

When asked to prepare a component for merge/publish, run this protocol unless the user explicitly narrows scope:

1. Build and test gate (from repo root):
   - `npm --prefix components/core run test`
   - `npm --prefix chromatic run test:accordion`
   - `npm --prefix testing run verify:local`
2. Production builds:
   - `npm --prefix components/core run build`
   - `npm --prefix components/react run build`
   - `npm --prefix components/angular_18 run build`
   - `npm --prefix components/angular_21 run build`
3. Versioning:
   - Bump `core`, `react`, `angular_18`, and `angular_21`.
   - Align wrapper `@accretion_ui/core` dependency/peerDependency ranges to the new core version.
4. Post-publish verification target:
   - `npm --prefix testing run verify:npm` with explicit version pins when validating a just-published release.
   - `npm --prefix testing run verify:npm:browser` for real-browser checks across React Vite, React CRA, React Next.js, Angular 18, and Angular 21.
5. Documentation:
   - Update root `README.md` publish checklist and testing instructions when workflow/tooling changes.
   - Keep README early sections non-technical per persistent rules above.
