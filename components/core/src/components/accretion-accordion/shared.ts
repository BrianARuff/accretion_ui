export type AccordionType = 'single' | 'multiple';
export type AccordionOrientation = 'vertical' | 'horizontal';
export type AccordionSizeVariant = 'compact' | 'comfortable' | 'spacious';
export type AccordionFocusAction = 'next' | 'previous' | 'first' | 'last';

export interface AccordionItemSnapshot {
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

export const ACCORDION_TOGGLE_REQUEST = 'accretionAccordionToggleRequest';
export const ACCORDION_FOCUS_REQUEST = 'accretionAccordionFocusRequest';
export const ACCORDION_ITEM_STATE_CHANGE = 'accretionAccordionItemStateChange';

let generatedItemCount = 0;

const sanitizeForId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createAccordionItemIds = (value?: string) => {
  generatedItemCount += 1;

  const normalizedValue = sanitizeForId(value ?? '');
  const base = `accretion-accordion-item-${normalizedValue || 'generated'}-${generatedItemCount}`;

  return {
    triggerId: `${base}-trigger`,
    panelId: `${base}-panel`,
    fallbackValue: `${normalizedValue || 'item'}-${generatedItemCount}`
  };
};

export const getClosestAccordion = (element: HTMLElement | null): HTMLElement | null =>
  element?.closest('accretion-accordion') ?? null;

export const getClosestAccordionItem = (element: HTMLElement | null): AccordionItemElement | null =>
  (element?.closest('accretion-accordion-item') as AccordionItemElement | null) ?? null;
