export type AccordionType = 'single' | 'multiple';
export type AccordionOrientation = 'vertical' | 'horizontal';
export type AccordionSizeVariant = 'compact' | 'comfortable' | 'spacious';
export type AccordionFocusAction = 'next' | 'previous' | 'first' | 'last';

export interface AccordionItemSnapshot {
  value: string;
  open: boolean;
  disabled: boolean;
  index: number;
  orientation: AccordionOrientation;
  triggerId: string;
  panelId: string;
}

export interface AccordionRootSnapshot {
  disabled: boolean;
  orientation: AccordionOrientation;
  index: number;
}

export interface AccordionToggleRequestDetail {
  trigger: HTMLElement;
}

export interface AccordionFocusRequestDetail {
  trigger: HTMLElement;
  action: AccordionFocusAction;
}

export interface AccordionItemStateChangeDetail {
  item: AccordionItemElement;
}

export interface AccordionValueChangeDetail {
  openValues: string[];
  openValueLookup: Record<string, true>;
}

export interface AccordionItemElement extends HTMLElement {
  open: boolean;
  disabled: boolean;
  setOpenState(open: boolean): Promise<void>;
  setIndex(index: number): Promise<void>;
  syncFromRoot(snapshot: AccordionRootSnapshot): Promise<void>;
  focusTrigger(): Promise<void>;
  getItemValue(): Promise<string>;
}

export interface AccordionHeaderElement extends HTMLElement {
  syncFromItem(snapshot: AccordionItemSnapshot): Promise<void>;
}

export interface AccordionTriggerElement extends HTMLElement {
  syncFromItem(snapshot: AccordionItemSnapshot): Promise<void>;
}

export interface AccordionPanelElement extends HTMLElement {
  syncFromItem(snapshot: AccordionItemSnapshot): Promise<void>;
}

let generatedItemCount = 0;

const sanitizeForId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createAccordionItemIds = (value?: string) => {
  const normalizedValue = sanitizeForId(value ?? '');

  // Keep IDs deterministic for SSR hydration when caller provides stable item values.
  if (normalizedValue) {
    const base = `accretion-accordion-item-${normalizedValue}`;

    return {
      triggerId: `${base}-trigger`,
      panelId: `${base}-panel`,
      fallbackValue: normalizedValue
    };
  }

  generatedItemCount += 1;
  const base = `accretion-accordion-item-generated-${generatedItemCount}`;

  return {
    triggerId: `${base}-trigger`,
    panelId: `${base}-panel`,
    fallbackValue: `item-${generatedItemCount}`
  };
};

export const getClosestAccordion = (element: HTMLElement | null): HTMLElement | null =>
  element?.closest('accretion-accordion') ?? null;

export const getClosestAccordionItem = (element: HTMLElement | null): AccordionItemElement | null =>
  (element?.closest('accretion-accordion-item') as AccordionItemElement | null) ?? null;
