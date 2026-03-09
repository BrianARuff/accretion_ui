import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const componentsFile = resolve(process.cwd(), 'src/lib/stencil-generated/components.ts');
const utilsFile = resolve(process.cwd(), 'src/lib/stencil-generated/angular-component-lib/utils.ts');

const componentReplacements = [
  {
    from: /import type \{ AccordionItemElement as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionItemElement as $1 } from '@accretion_ui/core';"
  },
  {
    from: /import type \{ AccordionToggleRequestDetail as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionToggleRequestDetail as $1 } from '@accretion_ui/core';"
  },
  {
    from: /import type \{ AccordionFocusRequestDetail as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionFocusRequestDetail as $1 } from '@accretion_ui/core';"
  },
  {
    from: /import type \{ AccordionValueChangeDetail as ([^}]+) \} from '@accretion_ui\/core\/dist\/components';/g,
    to: "import type { AccordionValueChangeDetail as $1 } from '@accretion_ui/core';"
  },
  {
    from: /export class AccretionAccordion {\n  protected el: HTMLAccretionAccordionElement;/g,
    to: `export class AccretionAccordion {
  protected el: HTMLAccretionAccordionElement;
  declare collapsible: Components.AccretionAccordion['collapsible'];
  declare disabled: Components.AccretionAccordion['disabled'];
  declare focusLoop: Components.AccretionAccordion['focusLoop'];
  declare loop: Components.AccretionAccordion['loop'];
  declare orientation: Components.AccretionAccordion['orientation'];
  declare sizeVariant: Components.AccretionAccordion['sizeVariant'];
  declare type: Components.AccretionAccordion['type'];`
  },
  {
    from: /export class AccretionAccordionHeader {\n  protected el: HTMLAccretionAccordionHeaderElement;/g,
    to: `export class AccretionAccordionHeader {
  protected el: HTMLAccretionAccordionHeaderElement;
  declare level: Components.AccretionAccordionHeader['level'];`
  },
  {
    from: /export class AccretionAccordionItem {\n  protected el: HTMLAccretionAccordionItemElement;/g,
    to: `export class AccretionAccordionItem {
  protected el: HTMLAccretionAccordionItemElement;
  declare disabled: Components.AccretionAccordionItem['disabled'];
  declare open: Components.AccretionAccordionItem['open'];
  declare value: Components.AccretionAccordionItem['value'];`
  },
  {
    from: /export class AccretionAccordionPanel {\n  protected el: HTMLAccretionAccordionPanelElement;/g,
    to: `export class AccretionAccordionPanel {
  protected el: HTMLAccretionAccordionPanelElement;
  declare hiddenUntilFound: Components.AccretionAccordionPanel['hiddenUntilFound'];
  declare keepMounted: Components.AccretionAccordionPanel['keepMounted'];`
  },
  {
    from: /export class AccretionAccordionTrigger {\n  protected el: HTMLAccretionAccordionTriggerElement;/g,
    to: `export class AccretionAccordionTrigger {
  protected el: HTMLAccretionAccordionTriggerElement;
  declare disabled: Components.AccretionAccordionTrigger['disabled'];`
  },
  {
    from: /export class AccretionButton {\n  protected el: HTMLAccretionButtonElement;/g,
    to: `export class AccretionButton {
  protected el: HTMLAccretionButtonElement;
  declare disabled: Components.AccretionButton['disabled'];
  declare variant: Components.AccretionButton['variant'];`
  }
];

const utilsReplacements = [
  {
    from: /import \{ fromEvent \} from 'rxjs';\n/g,
    to: "import { fromEvent } from 'rxjs';\nimport { ensureAccretionPredefineStyles } from '@accretion_ui/core';\n"
  },
  {
    from: /return this\.z\.runOutsideAngular\(\(\) => this\.el\[methodName\]\.apply\(this\.el, args\)\);/g,
    to: `return this.z.runOutsideAngular(() => {
        const method = this.el[methodName];

        if (typeof method !== 'function') {
          return Promise.resolve(undefined);
        }

        return method.apply(this.el, args);
      });`
  },
  {
    from: /    if \(defineCustomElementFn !== undefined\) {\n      defineCustomElementFn\(\);\n    }\n/g,
    to: `    if (defineCustomElementFn !== undefined) {
      ensureAccretionPredefineStyles();
      defineCustomElementFn();
    }
`
  }
];

const applyReplacements = (filePath, replacements) => {
  const current = readFileSync(filePath, 'utf8');
  const next = replacements.reduce((source, replacement) => source.replace(replacement.from, replacement.to), current);

  if (next !== current) {
    writeFileSync(filePath, next, 'utf8');
  }
};

applyReplacements(componentsFile, componentReplacements);
applyReplacements(utilsFile, utilsReplacements);
