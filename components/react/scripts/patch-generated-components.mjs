import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const targetFile = resolve(process.cwd(), 'src/generated/components.ts');
const current = readFileSync(targetFile, 'utf8');

const helperBlock = `const accretionElements = [
    'accretion-button',
    'accretion-accordion',
    'accretion-accordion-item',
    'accretion-accordion-header',
    'accretion-accordion-trigger',
    'accretion-accordion-panel'
];
const predefineStyleId = 'accretion-ui-predefine-style';
const deferredDefinitions = new Set<string>();

const runAfterLoad = (callback: () => void): void => {
    if (typeof window === 'undefined') {
        return;
    }

    if (document.readyState === 'complete') {
        callback();
        return;
    }

    window.addEventListener('load', callback, { once: true });
};

const installPredefineStyle = (): void => {
    if (typeof document === 'undefined') {
        return;
    }

    if (document.getElementById(predefineStyleId)) {
        return;
    }

    const style = document.createElement('style');
    style.id = predefineStyleId;
    style.textContent = \`\${accretionElements.map((tag) => \`\${tag}:not(:defined)\`).join(',\\n')} {\\n  visibility: hidden;\\n}\`;
    document.head.appendChild(style);
};

const hasServerRenderedMarkupForTag = (tagName: string): boolean => {
    if (typeof document === 'undefined') {
        return false;
    }

    return document.querySelector(tagName) !== null;
};

const defineCustomElementWithSsrGuard = (tagName: string, defineCustomElement: () => void): void => {
    if (typeof window === 'undefined' || typeof customElements === 'undefined') {
        return;
    }

    if (customElements.get(tagName)) {
        return;
    }

    if (!hasServerRenderedMarkupForTag(tagName)) {
        defineCustomElement();
        return;
    }

    installPredefineStyle();

    if (deferredDefinitions.has(tagName)) {
        return;
    }

    deferredDefinitions.add(tagName);

    const runDefinition = (): void => {
        deferredDefinitions.delete(tagName);

        if (!customElements.get(tagName)) {
            defineCustomElement();
        }
    };

    runAfterLoad(() => {
        if (typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(runDefinition);
            });
            return;
        }

        window.setTimeout(runDefinition, 0);
    });
};`;

const replacements = [
  {
    from: /defineCustomElement: defineAccretionAccordion\b/g,
    to: "defineCustomElement: () => defineCustomElementWithSsrGuard('accretion-accordion', defineAccretionAccordion)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionHeader\b/g,
    to: "defineCustomElement: () => defineCustomElementWithSsrGuard('accretion-accordion-header', defineAccretionAccordionHeader)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionItem\b/g,
    to: "defineCustomElement: () => defineCustomElementWithSsrGuard('accretion-accordion-item', defineAccretionAccordionItem)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionPanel\b/g,
    to: "defineCustomElement: () => defineCustomElementWithSsrGuard('accretion-accordion-panel', defineAccretionAccordionPanel)"
  },
  {
    from: /defineCustomElement: defineAccretionAccordionTrigger\b/g,
    to: "defineCustomElement: () => defineCustomElementWithSsrGuard('accretion-accordion-trigger', defineAccretionAccordionTrigger)"
  },
  {
    from: /defineCustomElement: defineAccretionButton\b/g,
    to: "defineCustomElement: () => defineCustomElementWithSsrGuard('accretion-button', defineAccretionButton)"
  }
];

let next = current;

if (!next.includes('const accretionElements = [')) {
  next = next.replace("import React from 'react';\n", `import React from 'react';\n\n${helperBlock}\n\n`);
}

replacements.forEach(({ from, to }) => {
  next = next.replace(from, to);
});

if (next !== current) {
  writeFileSync(targetFile, next, 'utf8');
}
