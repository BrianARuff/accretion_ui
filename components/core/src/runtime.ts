const ACCRETION_CUSTOM_ELEMENT_TAGS = [
  'accretion-button',
  'accretion-accordion',
  'accretion-accordion-item',
  'accretion-accordion-header',
  'accretion-accordion-trigger',
  'accretion-accordion-panel'
] as const;

const ACCRETION_PREDEFINE_STYLE_ID = 'accretion-ui-predefine-style';
const ACCRETION_PREDEFINE_SHEET_SYMBOL = Symbol.for('accretion_ui.predefine_sheet');
const ACCRETION_PREDEFINE_CSS = `${ACCRETION_CUSTOM_ELEMENT_TAGS.map((tagName) => `${tagName}:not(:defined)`).join(
  ',\n'
)} {\n  visibility: hidden;\n}`;

type AdoptableDocument = Document & { adoptedStyleSheets: CSSStyleSheet[] };
type GlobalWithPredefineSheet = typeof globalThis & {
  [ACCRETION_PREDEFINE_SHEET_SYMBOL]?: CSSStyleSheet;
};

const canUseAdoptedStyleSheets = (doc: Document): boolean =>
  'adoptedStyleSheets' in doc &&
  typeof CSSStyleSheet !== 'undefined' &&
  typeof CSSStyleSheet.prototype.replaceSync === 'function';

export const ensureAccretionPredefineStyles = (
  doc: Document | undefined = typeof document === 'undefined' ? undefined : document
): void => {
  if (!doc) {
    return;
  }

  if (canUseAdoptedStyleSheets(doc)) {
    const adoptableDocument = doc as AdoptableDocument;
    const globalRegistry = (doc.defaultView ?? globalThis) as GlobalWithPredefineSheet;
    let sheet = globalRegistry[ACCRETION_PREDEFINE_SHEET_SYMBOL];

    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(ACCRETION_PREDEFINE_CSS);
      globalRegistry[ACCRETION_PREDEFINE_SHEET_SYMBOL] = sheet;
    }

    if (!adoptableDocument.adoptedStyleSheets.includes(sheet)) {
      adoptableDocument.adoptedStyleSheets = [...adoptableDocument.adoptedStyleSheets, sheet];
    }

    return;
  }

  if (doc.getElementById(ACCRETION_PREDEFINE_STYLE_ID)) {
    return;
  }

  const style = doc.createElement('style');
  style.id = ACCRETION_PREDEFINE_STYLE_ID;
  style.textContent = ACCRETION_PREDEFINE_CSS;
  doc.head.appendChild(style);
};
