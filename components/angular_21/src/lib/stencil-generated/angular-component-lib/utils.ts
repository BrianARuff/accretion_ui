/* eslint-disable */
/* tslint:disable */
import { fromEvent } from 'rxjs';

export const proxyInputs = (Cmp: any, inputs: string[]) => {
  const Prototype = Cmp.prototype;
  inputs.forEach((item) => {
    Object.defineProperty(Prototype, item, {
      get() {
        return this.el[item];
      },
      set(val: any) {
        this.z.runOutsideAngular(() => (this.el[item] = val));
      },
      /**
       * In the event that proxyInputs is called
       * multiple times re-defining these inputs
       * will cause an error to be thrown. As a result
       * we set configurable: true to indicate these
       * properties can be changed.
       */
      configurable: true,
    });
  });
};

export const proxyMethods = (Cmp: any, methods: string[]) => {
  const Prototype = Cmp.prototype;
  methods.forEach((methodName) => {
    Prototype[methodName] = function () {
      const args = arguments;
      return this.z.runOutsideAngular(() => {
        const method = this.el[methodName];

        if (typeof method !== 'function') {
          return Promise.resolve(undefined);
        }

        return method.apply(this.el, args);
      });
    };
  });
};

export const proxyOutputs = (instance: any, el: any, events: string[]) => {
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
  style.textContent = `${predefineStyleSelectors.join(',\n')} {\n  visibility: hidden;\n}`;
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

export const defineCustomElement = (tagName: string, customElement: any) => {
  if (customElement !== undefined && typeof customElements !== 'undefined' && !customElements.get(tagName)) {
    customElements.define(tagName, customElement);
  }
};

// tslint:disable-next-line: only-arrow-functions
export function ProxyCmp(opts: { defineCustomElementFn?: () => void; inputs?: any; methods?: any }) {
  const decorator = function (cls: any) {
    const { defineCustomElementFn, inputs, methods } = opts;

    if (defineCustomElementFn !== undefined) {
      const shouldDeferForPotentialSsr = typeof document !== 'undefined' && document.readyState === 'loading';

      if (shouldDeferForPotentialSsr || hasServerRenderedAccretionMarkup()) {
        installPredefineStyle();
        defineCustomElementDeferred(defineCustomElementFn);
      } else {
        defineCustomElementFn();
      }
    }

    if (inputs) {
      proxyInputs(cls, inputs);
    }
    if (methods) {
      proxyMethods(cls, methods);
    }
    return cls;
  };
  return decorator;
}
