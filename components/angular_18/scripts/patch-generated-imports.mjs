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
  }
];

const utilsReplacements = [
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
    from: /export const proxyOutputs = \(instance: any, el: any, events: string\[\]\) => {\n  events\.forEach\(\(eventName\) => \(instance\[eventName\] = fromEvent\(el, eventName\)\)\);\n};\n\nexport const defineCustomElement =/g,
    to: `export const proxyOutputs = (instance: any, el: any, events: string[]) => {
  events.forEach((eventName) => (instance[eventName] = fromEvent(el, eventName)));
};

const predefineStyleId = 'accretion-ui-predefine-style';
const predefineStyleSelectors = [
  'accretion-button:not(:defined)',
  'accretion-accordion:not(:defined)',
  'accretion-accordion-item:not(:defined)',
  'accretion-accordion-header:not(:defined)',
  'accretion-accordion-trigger:not(:defined)',
  'accretion-accordion-panel:not(:defined)',
];

const hasServerRenderedAccretionMarkup = () => {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.querySelector('accretion-button, accretion-accordion, accretion-accordion-item, accretion-accordion-header, accretion-accordion-trigger, accretion-accordion-panel') !== null;
};

const installPredefineStyle = () => {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(predefineStyleId)) {
    return;
  }

  const style = document.createElement('style');
  style.id = predefineStyleId;
  style.textContent = \`\${predefineStyleSelectors.join(',\\n')} {\\n  visibility: hidden;\\n}\`;
  document.head.appendChild(style);
};

const deferredDefinitions = new WeakSet<() => void>();

const runWhenDomReady = (callback: () => void) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
};

const runAfterLoad = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (document.readyState === 'complete') {
    callback();
    return;
  }

  window.addEventListener('load', callback, { once: true });
};

const defineCustomElementDeferred = (defineCustomElementFn?: () => void) => {
  if (defineCustomElementFn === undefined || typeof window === 'undefined') {
    return;
  }

  if (deferredDefinitions.has(defineCustomElementFn)) {
    return;
  }

  deferredDefinitions.add(defineCustomElementFn);

  const runDefinition = () => {
    deferredDefinitions.delete(defineCustomElementFn);
    defineCustomElementFn();
  };

  runWhenDomReady(() => {
    runAfterLoad(() => {
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(runDefinition);
        });
        return;
      }

      window.setTimeout(runDefinition, 0);
    });
  });
};

export const defineCustomElement =`
  },
  {
    from: /    if \(defineCustomElementFn !== undefined\) {\n      defineCustomElementFn\(\);\n    }\n\n    if \(inputs\) {/g,
    to: `    if (defineCustomElementFn !== undefined) {
      const shouldDeferForPotentialSsr = typeof document !== 'undefined' && document.readyState === 'loading';

      if (shouldDeferForPotentialSsr || hasServerRenderedAccretionMarkup()) {
        installPredefineStyle();
        defineCustomElementDeferred(defineCustomElementFn);
      } else {
        defineCustomElementFn();
      }
    }

    if (inputs) {`
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
