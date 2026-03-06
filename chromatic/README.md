# Chromatic Workspace

This folder contains independent Storybook + Chromatic setups for Accretion UI wrappers:

- `react` for `@accretion_ui/react`
- `angular_18` for `@accretion_ui/angular_18`
- `angular_21` for `@accretion_ui/angular_21`

## Target Chromatic Repositories

- React Chromatic repo: [accretion_ui_react_chromatic](https://github.com/BrianARuff/accretion_ui_react_chromatic)
- Angular 18 Chromatic repo: [accretion_ui_angular_18_chromatic](https://github.com/BrianARuff/accretion_ui_angular_18_chromatic)
- Angular 21 Chromatic repo: [accretion_ui_angular_21_chromatic](https://github.com/BrianARuff/accretion_ui_angular_21_chromatic)

## Latest Published Links

- React Storybook: https://69a694b696baf333e562e9f1-yyktylvmmk.chromatic.com/
- Angular 18 Storybook: https://69a69540931282436807583e-ymgtpgyqrh.chromatic.com/
- Angular 21 Storybook: https://69a69585a3c2c8accf671d8d-ejbsnuffvz.chromatic.com/

## One-Time Setup

```bash
cd /Users/brianruff/Documents/accretion_ui/chromatic
npm run install:all
```

## Run Storybook Locally

```bash
npm run storybook:react      # http://localhost:6008
npm run storybook:angular_18 # http://localhost:6006
npm run storybook:angular_21 # http://localhost:6007
```

### Storybook Accessibility Panel

All three Storybooks include `@storybook/addon-a11y` so accessibility checks are visible directly in the Storybook UI for each Accordion story.

## Run Professional Accordion Test Suites

The Accordion test harness lives in `chromatic/tests` and runs real-browser behavior + accessibility checks across:

- React Storybook
- Angular 18 Storybook
- Angular 21 Storybook

Current suite structure:

- `accordion.behavior.spec.ts`: Story behavior assertions (interactive claims, state transitions, keyboard model, controlled-mode behavior)
- `accordion.props.spec.ts`: Prop-level coverage for root/item/header/trigger/panel APIs
- `accordion.a11y.spec.ts`: Axe checks (critical + serious filtering) via `@axe-core/playwright`
- `accordion.uswds-a11y.spec.ts`: USWDS-aligned keyboard and zoom checks that are deterministic in browser automation

Install Playwright browsers once:

```bash
npx playwright install chromium
```

Run tests (builds all three storybooks first):

```bash
npm run test:accordion
```

Open interactive runner:

```bash
npm run test:accordion:ui
```

Open HTML report:

```bash
npm run test:accordion:report
```

## Publish to Chromatic

These commands require OS-level environment variables:

- `CHROMATIC_PROJECT_TOKEN_REACT`
- `CHROMATIC_PROJECT_TOKEN_ANGULAR_18`
- `CHROMATIC_PROJECT_TOKEN_ANGULAR_21`

Global env file path (already created locally in this workspace):

- `~/.config/accretion_ui/chromatic.env`

Load it in the current shell:

```bash
source ~/.config/accretion_ui/chromatic.env
```

```bash
npm run chromatic:react
npm run chromatic:angular_18
npm run chromatic:angular_21
```

Or run all three:

```bash
npm run chromatic:all
```

## Push Subfolders to Separate Chromatic Repos

Run from project root:

```bash
# React
git subtree split --prefix chromatic/react -b tmp/chromatic-react
git push git@github.com:BrianARuff/accretion_ui_react_chromatic.git tmp/chromatic-react:main

# Angular 18
git subtree split --prefix chromatic/angular_18 -b tmp/chromatic-angular-18
git push https://github.com/BrianARuff/accretion_ui_angular_18_chromatic tmp/chromatic-angular-18:main

# Angular 21
git subtree split --prefix chromatic/angular_21 -b tmp/chromatic-angular-21
git push https://github.com/BrianARuff/accretion_ui_angular_21_chromatic tmp/chromatic-angular-21:main
```

Optional cleanup:

```bash
git branch -D tmp/chromatic-react tmp/chromatic-angular-18 tmp/chromatic-angular-21
```
