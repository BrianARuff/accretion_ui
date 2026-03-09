import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const targetFile = resolve(process.cwd(), 'src/generated/components.ts');
const current = readFileSync(targetFile, 'utf8');

const helperBlock = `const defineCustomElementWithPredefineStyles = (tagName: string, defineCustomElement: () => void): void => {
    if (typeof window === 'undefined' || typeof customElements === 'undefined') {
        return;
    }

    ensureAccretionPredefineStyles();

    if (customElements.get(tagName)) {
        return;
    }

    defineCustomElement();
};`;

const replacements = [
  {
    from: /defineCustomElement: defineAccretionAccordion\b/g,
    to: "defineCustomElement: () => defineCustomElementWithPredefineStyles('accretion-accordion', defineAccretionAccordion)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionHeader\b/g,
    to: "defineCustomElement: () => defineCustomElementWithPredefineStyles('accretion-accordion-header', defineAccretionAccordionHeader)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionItem\b/g,
    to: "defineCustomElement: () => defineCustomElementWithPredefineStyles('accretion-accordion-item', defineAccretionAccordionItem)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionPanel\b/g,
    to: "defineCustomElement: () => defineCustomElementWithPredefineStyles('accretion-accordion-panel', defineAccretionAccordionPanel)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionTrigger\b/g,
    to: "defineCustomElement: () => defineCustomElementWithPredefineStyles('accretion-accordion-trigger', defineAccretionAccordionTrigger)"
  },
  {
    from: /defineCustomElement: defineAccretionButton\b/g,
    to: "defineCustomElement: () => defineCustomElementWithPredefineStyles('accretion-button', defineAccretionButton)"
  }
];

let next = current;

if (!next.includes('ensureAccretionPredefineStyles')) {
  next = next.replace(
    'import { type AccordionFocusRequestDetail, type AccordionItemElement, type AccordionToggleRequestDetail, type AccordionValueChangeDetail, type AccretionAccordionCustomEvent, type AccretionAccordionItemCustomEvent, type AccretionAccordionTriggerCustomEvent } from "@accretion_ui/core";',
    'import { ensureAccretionPredefineStyles, type AccordionFocusRequestDetail, type AccordionItemElement, type AccordionToggleRequestDetail, type AccordionValueChangeDetail, type AccretionAccordionCustomEvent, type AccretionAccordionItemCustomEvent, type AccretionAccordionTriggerCustomEvent } from "@accretion_ui/core";'
  );
}

if (!next.includes('const defineCustomElementWithPredefineStyles =')) {
  next = next.replace("import React from 'react';\n", `import React from 'react';\n\n${helperBlock}\n\n`);
}

replacements.forEach(({ from, to }) => {
  next = next.replace(from, to);
});

if (next !== current) {
  writeFileSync(targetFile, next, 'utf8');
}
