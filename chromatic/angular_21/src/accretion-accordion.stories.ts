import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccretionAngularModule } from '@accretion_ui/angular_21';

type AccordionArgs = {
  type: 'single' | 'multiple';
  collapsible: boolean;
  disabled: boolean;
  focusLoop: boolean;
  orientation: 'vertical' | 'horizontal';
  sizeVariant: 'compact' | 'comfortable' | 'spacious';
  keepMounted: boolean;
};

type AccordionItemConfig = {
  value: string;
  title: string;
  content: string;
};

type StoryRenderOptions = {
  initialOpenValues?: string[];
  disabledItemValues?: string[];
  disabledTriggerValues?: string[];
  hiddenUntilFoundValues?: string[];
  containerStyle?: string;
  items?: AccordionItemConfig[];
  panelContentByValue?: Partial<Record<string, string>>;
  summaryTitle?: string;
  summaryText?: string;
  summaryKeywords?: string[];
};

const PLUS_ICON = `
  <svg aria-hidden="true" data-accordion-indicator fill="currentColor" focusable="false" viewBox="0 0 12 12" width="14" height="14">
    <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
  </svg>
`;

const BASE_ITEMS: AccordionItemConfig[] = [
  {
    value: 'what-is-accretion',
    title: 'What is Accretion UI?',
    content:
      'Accretion UI is a shared component foundation that powers both React and Angular teams from a single web-component source.'
  },
  {
    value: 'getting-started',
    title: 'How do I get started?',
    content:
      'Start with the core package, then consume wrappers from &#64;accretion_ui/react or the Angular package aligned to your framework version.'
  },
  {
    value: 'project-use',
    title: 'Can I use it for my project?',
    content:
      'Yes. The accordion parts are composable so teams can add wrappers, helper text, icons, and nested layout without breaking keyboard or screen-reader behavior.'
  }
];

const KEEP_MOUNTED_ITEMS: AccordionItemConfig[] = [
  {
    value: 'session-notes',
    title: 'Session notes',
    content: 'Type a note, collapse this section, then reopen it. The same input element should still hold your draft.'
  },
  {
    value: 'scope-checklist',
    title: 'Scope checklist',
    content:
      'Keep mounted is useful when a collapsed panel contains partially completed form fields, toggles, or other in-progress state.'
  },
  {
    value: 'handoff-comment',
    title: 'Handoff comment',
    content: 'Use this when preserving user-entered panel state is more important than removing hidden DOM nodes.'
  }
];

const HIDDEN_UNTIL_FOUND_ITEMS: AccordionItemConfig[] = [
  {
    value: 'always-visible',
    title: 'Visible baseline',
    content: 'This panel stays visible so you have a baseline while testing browser find behavior.'
  },
  {
    value: 'search-index-alpha',
    title: 'Search target alpha',
    content:
      'Contains keyword cosmic-orbit-index. Collapse this item, then use browser find to jump to this hidden-until-found content.'
  },
  {
    value: 'search-index-beta',
    title: 'Search target beta',
    content:
      'Contains keyword lattice-signal-window. Browser find can reveal this collapsed panel because hiddenUntilFound is enabled.'
  }
];

const HORIZONTAL_ITEMS: AccordionItemConfig[] = [
  {
    value: 'first',
    title: 'First trigger',
    content: 'Focus starts here when tabbing into the accordion.'
  },
  {
    value: 'middle',
    title: 'Middle trigger',
    content: 'Arrow navigation moves left and right because orientation is horizontal.'
  },
  {
    value: 'last',
    title: 'Last trigger',
    content: 'With focusLoop disabled, ArrowRight on this trigger keeps focus here.'
  }
];

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const renderSummaryBlock = (title?: string, text?: string, keywords: string[] = []): string => {
  if (!title && !text && keywords.length === 0) {
    return '';
  }

  const keywordTemplate =
    keywords.length > 0
      ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">${keywords
          .map(
            (keyword) =>
              `<code style="background:#e8f1fb;border:1px solid #b9cee8;border-radius:8px;color:#1f4068;padding:2px 8px;">${escapeHtml(keyword)}</code>`
          )
          .join('')}</div>`
      : '';

  return `
    <div style="background:#f4f8fc;border:1px solid #c9d8ea;border-radius:12px;color:#1f2d40;display:grid;gap:8px;padding:12px 14px;">
      ${title ? `<p style="margin:0;"><strong>${escapeHtml(title)}</strong></p>` : ''}
      ${text ? `<p style="margin:0;">${escapeHtml(text)}</p>` : ''}
      ${keywordTemplate}
    </div>
  `;
};

const createKeepMountedPanelContent = (title: string, content: string): string => `
  <div style="display:grid;gap:10px;">
    <p style="margin:0;">${escapeHtml(content)}</p>
    <label style="color:#2f486b;display:grid;font-weight:600;gap:6px;">
      Draft for ${escapeHtml(title)}
      <input type="text" placeholder="Type here, then collapse and reopen" style="border:1px solid #9eb4cf;border-radius:8px;font:inherit;padding:8px;" />
    </label>
  </div>
`;

const renderAccordion = (args: AccordionArgs, options: StoryRenderOptions = {}) => {
  const items = options.items ?? BASE_ITEMS;
  const initialOpenValues = new Set(options.initialOpenValues ?? [items[0]?.value ?? '']);
  const disabledItemValues = new Set(options.disabledItemValues ?? []);
  const disabledTriggerValues = new Set(options.disabledTriggerValues ?? []);
  const hiddenUntilFoundValues = new Set(options.hiddenUntilFoundValues ?? []);
  const panelContentByValue = options.panelContentByValue ?? {};
  const containerStyle = options.containerStyle ?? 'max-width:48rem;padding:1rem;display:grid;gap:0.875rem;';
  const summaryBlock = renderSummaryBlock(options.summaryTitle, options.summaryText, options.summaryKeywords ?? []);

  const itemsTemplate = items
    .map(({ value, title, content }) => {
      const itemOpen = initialOpenValues.has(value);
      const itemDisabled = disabledItemValues.has(value);
      const triggerDisabled = disabledTriggerValues.has(value);
      const hiddenUntilFound = hiddenUntilFoundValues.has(value);
      const panelContent = panelContentByValue[value] ?? `<p style="margin:0;">${escapeHtml(content)}</p>`;

      return `
        <accretion-accordion-item value="${value}" [open]="${itemOpen}" [disabled]="${itemDisabled}">
          <accretion-accordion-header>
            <accretion-accordion-trigger [disabled]="${triggerDisabled}">
              ${escapeHtml(title)}
              ${PLUS_ICON}
            </accretion-accordion-trigger>
          </accretion-accordion-header>
          <accretion-accordion-panel [keepMounted]="keepMounted" [hiddenUntilFound]="${hiddenUntilFound}">
            ${panelContent}
          </accretion-accordion-panel>
        </accretion-accordion-item>
      `;
    })
    .join('');

  return {
    props: args,
    template: `
      <div style="${containerStyle}">
        ${summaryBlock}
        <accretion-accordion
          [type]="type"
          [collapsible]="collapsible"
          [disabled]="disabled"
          [focusLoop]="focusLoop"
          [orientation]="orientation"
          [sizeVariant]="sizeVariant"
        >
          ${itemsTemplate}
        </accretion-accordion>
      </div>
    `
  };
};

const meta: Meta<AccordionArgs> = {
  title: 'Accretion/Accordion',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccretionAngularModule]
    })
  ],
  args: {
    type: 'single',
    collapsible: true,
    disabled: false,
    focusLoop: true,
    orientation: 'vertical',
    sizeVariant: 'compact',
    keepMounted: false
  },
  argTypes: {
    type: {
      control: { type: 'inline-radio' },
      options: ['single', 'multiple']
    },
    collapsible: {
      control: { type: 'boolean' }
    },
    disabled: {
      control: { type: 'boolean' }
    },
    focusLoop: {
      control: { type: 'boolean' }
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['vertical', 'horizontal']
    },
    sizeVariant: {
      control: { type: 'inline-radio' },
      options: ['compact', 'comfortable', 'spacious']
    },
    keepMounted: {
      control: { type: 'boolean' }
    }
  },
  render: (args) => renderAccordion(args)
};

export default meta;

type Story = StoryObj<AccordionArgs>;

export const Summary: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docsOnly: true,
    docs: {
      source: { code: '' },
      canvas: { sourceState: 'none' }
    },
    previewTabs: {
      'storybook/controls/panel': { hidden: true },
      'storybook/actions/panel': { hidden: true },
      'storybook/interactions/panel': { hidden: true }
    }
  },
  render: () => ({
    template: ''
  })
};

export const InteractiveOverview: Story = {
  render: (args) =>
    renderAccordion(args, {
      summaryTitle: 'Interactive baseline',
      summaryText:
        'Use this story as the baseline behavior reference: one item open, keyboard navigation enabled, and collapsible single-item mode.'
    })
};

export const ControlledFromState: Story = {
  args: {
    type: 'multiple',
    collapsible: true
  },
  render: (args) => {
    const openValues = signal<string[]>(['what-is-accretion']);

    return {
      props: {
        ...args,
        openValues,
        isOpen: (value: string) => openValues().includes(value),
        openFirst: () => {
          openValues.set(['what-is-accretion']);
        },
        openAll: () => {
          openValues.set(BASE_ITEMS.map(({ value }) => value));
        },
        collapseAll: () => {
          openValues.set([]);
        },
        handleAccordionChange: (event: CustomEvent<{ openValues: string[] }>) => {
          openValues.set([...event.detail.openValues]);
        }
      },
      template: `
        <div style="display:grid;gap:0.875rem;max-width:48rem;padding:1rem;">
          <div style="background:#f4f8fc;border:1px solid #c9d8ea;border-radius:12px;color:#1f2d40;display:grid;gap:8px;padding:12px 14px;">
            <p style="margin:0;"><strong>Controlled from outside state</strong></p>
            <p style="margin:0;">This story binds each item open state to an Angular signal and syncs from accretionAccordionChange.</p>
          </div>

          <div style="align-items:center;display:flex;flex-wrap:wrap;gap:8px;">
            <button type="button" (click)="openFirst()">Open first</button>
            <button type="button" (click)="openAll()">Open all</button>
            <button type="button" (click)="collapseAll()">Collapse all</button>
            <p style="margin:0;"><strong>Open values:</strong> {{ openValues().length ? openValues().join(', ') : 'none' }}</p>
          </div>

          <accretion-accordion
            [type]="type"
            [collapsible]="collapsible"
            [disabled]="disabled"
            [focusLoop]="focusLoop"
            [orientation]="orientation"
            [sizeVariant]="sizeVariant"
            (accretionAccordionChange)="handleAccordionChange($event)"
          >
            <accretion-accordion-item value="what-is-accretion" [open]="isOpen('what-is-accretion')">
              <accretion-accordion-header>
                <accretion-accordion-trigger>
                  What is Accretion UI?
                  ${PLUS_ICON}
                </accretion-accordion-trigger>
              </accretion-accordion-header>
              <accretion-accordion-panel [keepMounted]="keepMounted">
                <p style="margin:0;">Accretion UI is a shared component foundation that powers both React and Angular teams from a single web-component source.</p>
              </accretion-accordion-panel>
            </accretion-accordion-item>

            <accretion-accordion-item value="getting-started" [open]="isOpen('getting-started')">
              <accretion-accordion-header>
                <accretion-accordion-trigger>
                  How do I get started?
                  ${PLUS_ICON}
                </accretion-accordion-trigger>
              </accretion-accordion-header>
              <accretion-accordion-panel [keepMounted]="keepMounted">
                <p style="margin:0;">Start with the core package, then consume wrappers from &#64;accretion_ui/react or the Angular package aligned to your framework version.</p>
              </accretion-accordion-panel>
            </accretion-accordion-item>

            <accretion-accordion-item value="project-use" [open]="isOpen('project-use')">
              <accretion-accordion-header>
                <accretion-accordion-trigger>
                  Can I use it for my project?
                  ${PLUS_ICON}
                </accretion-accordion-trigger>
              </accretion-accordion-header>
              <accretion-accordion-panel [keepMounted]="keepMounted">
                <p style="margin:0;">Yes. The accordion parts are composable so teams can add wrappers, helper text, icons, and nested layout without breaking keyboard or screen-reader behavior.</p>
              </accretion-accordion-panel>
            </accretion-accordion-item>
          </accretion-accordion>
        </div>
      `
    };
  }
};

export const MultipleOpen: Story = {
  args: {
    type: 'multiple',
    collapsible: true
  },
  render: (args) =>
    renderAccordion(args, {
      initialOpenValues: ['what-is-accretion', 'getting-started']
    })
};

export const SingleNonCollapsible: Story = {
  args: {
    type: 'single',
    collapsible: false
  }
};

export const KeepMountedPanels: Story = {
  args: {
    keepMounted: true,
    type: 'multiple'
  },
  render: (args) =>
    renderAccordion(args, {
      items: KEEP_MOUNTED_ITEMS,
      initialOpenValues: ['session-notes'],
      summaryTitle: 'What this story demonstrates',
      summaryText:
        'Each collapsed panel stays mounted in the DOM. Type into a field, collapse it, and reopen it to verify the same input instance retains its value.',
      panelContentByValue: {
        'session-notes': createKeepMountedPanelContent('Session notes', KEEP_MOUNTED_ITEMS[0].content),
        'scope-checklist': createKeepMountedPanelContent('Scope checklist', KEEP_MOUNTED_ITEMS[1].content),
        'handoff-comment': createKeepMountedPanelContent('Handoff comment', KEEP_MOUNTED_ITEMS[2].content)
      }
    })
};

export const ItemDisabled: Story = {
  args: {
    type: 'multiple'
  },
  render: (args) =>
    renderAccordion(args, {
      disabledItemValues: ['getting-started'],
      initialOpenValues: ['what-is-accretion', 'getting-started'],
      summaryTitle: 'Item disabled',
      summaryText:
        'The full item is disabled. Trigger and panel are treated as disabled together, so the entire row and content area appear inactive.'
    })
};

export const TriggerDisabled: Story = {
  args: {
    type: 'multiple'
  },
  render: (args) =>
    renderAccordion(args, {
      disabledTriggerValues: ['project-use'],
      initialOpenValues: ['what-is-accretion', 'project-use'],
      summaryTitle: 'Trigger disabled',
      summaryText:
        'Only the trigger button is disabled. This story keeps that panel open so you can still see content while the control itself is non-interactive.',
      panelContentByValue: {
        'project-use': `
          <div style="display:grid;gap:8px;">
            <p style="margin:0;">This panel is intentionally pre-opened while its trigger is disabled.</p>
            <p style="color:#305176;margin:0;">Visual cue: disabled scope is at trigger level, not item level.</p>
          </div>
        `
      }
    })
};

export const HiddenUntilFound: Story = {
  args: {
    keepMounted: false,
    type: 'multiple'
  },
  render: (args) =>
    renderAccordion(args, {
      items: HIDDEN_UNTIL_FOUND_ITEMS,
      initialOpenValues: ['always-visible'],
      hiddenUntilFoundValues: ['search-index-alpha', 'search-index-beta'],
      summaryTitle: 'Hidden until found',
      summaryText:
        'Collapsed panels below use hidden="until-found". Collapse them and run browser Find (Cmd/Ctrl+F) with one of these keywords to reveal a match.',
      summaryKeywords: ['cosmic-orbit-index', 'lattice-signal-window']
    })
};

export const HorizontalNoLoop: Story = {
  args: {
    type: 'multiple',
    orientation: 'horizontal',
    focusLoop: false
  },
  render: (args) =>
    renderAccordion(args, {
      items: HORIZONTAL_ITEMS,
      initialOpenValues: ['first', 'middle'],
      summaryTitle: 'Horizontal keyboard behavior with no loop',
      summaryText:
        'Use Left/Right arrows across triggers. When focus reaches the last trigger, ArrowRight keeps focus there instead of wrapping to the first trigger.',
      containerStyle: 'max-width:58rem;padding:1rem;display:grid;gap:0.875rem;'
    })
};

export const SpaciousDisabled: Story = {
  args: {
    disabled: true,
    sizeVariant: 'spacious'
  }
};
