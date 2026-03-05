import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AccretionAccordion,
  AccretionAccordionHeader,
  AccretionAccordionItem,
  AccretionAccordionPanel,
  AccretionAccordionTrigger
} from '@accretion_ui/react';

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
  containerStyle?: CSSProperties;
  items?: AccordionItemConfig[];
  panelContentByValue?: Partial<Record<string, ReactNode>>;
  summaryTitle?: string;
  summaryText?: string;
  summaryKeywords?: string[];
};

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    data-accordion-indicator
    fill="currentColor"
    focusable="false"
    viewBox="0 0 12 12"
    width="14"
    height="14"
  >
    <path d="M6.75 0H5.25V5.25H0V6.75L5.25 6.75V12H6.75V6.75L12 6.75V5.25H6.75V0Z" />
  </svg>
);

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
      'Start with the core package, then consume wrappers from @accretion_ui/react or the Angular package aligned to your framework version.'
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
    content: 'Arrow navigation moves left/right because orientation is horizontal.'
  },
  {
    value: 'last',
    title: 'Last trigger',
    content: 'With focusLoop disabled, ArrowRight on this trigger keeps focus here.'
  }
];

const NOTE_CARD_STYLE: CSSProperties = {
  background: '#f4f8fc',
  border: '1px solid #c9d8ea',
  borderRadius: '0.75rem',
  color: '#1f2d40',
  display: 'grid',
  gap: '0.5rem',
  padding: '0.75rem 0.875rem'
};

const CHIP_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem'
};

const renderSummary = (title?: string, text?: string, keywords: string[] = []) => {
  if (!title && !text && keywords.length === 0) {
    return null;
  }

  return (
    <div style={NOTE_CARD_STYLE}>
      {title ? (
        <p style={{ margin: 0 }}>
          <strong>{title}</strong>
        </p>
      ) : null}
      {text ? <p style={{ margin: 0 }}>{text}</p> : null}
      {keywords.length > 0 ? (
        <div style={CHIP_ROW_STYLE}>
          {keywords.map((keyword) => (
            <code
              key={keyword}
              style={{
                background: '#e8f1fb',
                border: '1px solid #b9cee8',
                borderRadius: '0.5rem',
                color: '#1f4068',
                padding: '0.125rem 0.5rem'
              }}
            >
              {keyword}
            </code>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const KeepMountedPanelContent = ({ title, content }: { title: string; content: string }) => {
  const [draft, setDraft] = useState('');

  return (
    <div style={{ display: 'grid', gap: '0.625rem' }}>
      <p style={{ margin: 0 }}>{content}</p>
      <label style={{ color: '#2f486b', display: 'grid', fontWeight: 600, gap: '0.375rem' }}>
        Draft for {title}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type here, then collapse and reopen"
          style={{ border: '1px solid #9eb4cf', borderRadius: '0.5rem', font: 'inherit', padding: '0.5rem' }}
        />
      </label>
    </div>
  );
};

const renderAccordion = ({ keepMounted, ...args }: AccordionArgs, options: StoryRenderOptions = {}) => {
  const items = options.items ?? BASE_ITEMS;
  const initialOpenValues = options.initialOpenValues ?? [items[0]?.value ?? ''];
  const panelContentByValue = options.panelContentByValue ?? {};
  const disabledItemValues = new Set(options.disabledItemValues ?? []);
  const disabledTriggerValues = new Set(options.disabledTriggerValues ?? []);
  const hiddenUntilFoundValues = new Set(options.hiddenUntilFoundValues ?? []);

  return (
    <div
      style={{
        display: 'grid',
        gap: '0.875rem',
        maxWidth: '48rem',
        padding: '1rem',
        ...options.containerStyle
      }}
    >
      {renderSummary(options.summaryTitle, options.summaryText, options.summaryKeywords)}

      <AccretionAccordion {...args}>
        {items.map(({ value, title, content }) => (
          <AccretionAccordionItem
            key={value}
            value={value}
            open={initialOpenValues.includes(value)}
            disabled={disabledItemValues.has(value)}
          >
            <AccretionAccordionHeader>
              <AccretionAccordionTrigger disabled={disabledTriggerValues.has(value)}>
                {title}
                <PlusIcon />
              </AccretionAccordionTrigger>
            </AccretionAccordionHeader>
            <AccretionAccordionPanel
              keepMounted={keepMounted}
              hiddenUntilFound={hiddenUntilFoundValues.has(value)}
            >
              {panelContentByValue[value] ?? <p style={{ margin: 0 }}>{content}</p>}
            </AccretionAccordionPanel>
          </AccretionAccordionItem>
        ))}
      </AccretionAccordion>
    </div>
  );
};

const ControlledAccordionExample = (args: AccordionArgs) => {
  const [openValues, setOpenValues] = useState<string[]>(['what-is-accretion']);

  const isOpen = (value: string) => openValues.includes(value);

  return (
    <div style={{ display: 'grid', gap: '0.875rem', maxWidth: '48rem', padding: '1rem' }}>
      {renderSummary(
        'Controlled from outside state',
        'This story binds each item open state to React useState and syncs from accretionAccordionChange.',
        []
      )}

      <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button type="button" onClick={() => setOpenValues(['what-is-accretion'])}>
          Open first
        </button>
        <button type="button" onClick={() => setOpenValues(BASE_ITEMS.map(({ value }) => value))}>
          Open all
        </button>
        <button type="button" onClick={() => setOpenValues([])}>
          Collapse all
        </button>
        <p style={{ margin: 0 }}>
          <strong>Open values:</strong> {openValues.length > 0 ? openValues.join(', ') : 'none'}
        </p>
      </div>

      <AccretionAccordion
        {...args}
        onAccretionAccordionChange={(event) => setOpenValues([...event.detail.openValues])}
      >
        {BASE_ITEMS.map(({ value, title, content }) => (
          <AccretionAccordionItem key={value} value={value} open={isOpen(value)}>
            <AccretionAccordionHeader>
              <AccretionAccordionTrigger>
                {title}
                <PlusIcon />
              </AccretionAccordionTrigger>
            </AccretionAccordionHeader>
            <AccretionAccordionPanel keepMounted={args.keepMounted}>
              <p style={{ margin: 0 }}>{content}</p>
            </AccretionAccordionPanel>
          </AccretionAccordionItem>
        ))}
      </AccretionAccordion>
    </div>
  );
};

const meta = {
  title: 'Accretion/Accordion',
  component: AccretionAccordion,
  tags: ['autodocs'],
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
  render: (args: AccordionArgs) => renderAccordion(args)
} satisfies Meta<AccordionArgs>;

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
  render: () => null
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
  render: (args) => <ControlledAccordionExample {...args} />
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
        'session-notes': (
          <KeepMountedPanelContent
            title="Session notes"
            content={KEEP_MOUNTED_ITEMS[0].content}
          />
        ),
        'scope-checklist': (
          <KeepMountedPanelContent
            title="Scope checklist"
            content={KEEP_MOUNTED_ITEMS[1].content}
          />
        ),
        'handoff-comment': (
          <KeepMountedPanelContent
            title="Handoff comment"
            content={KEEP_MOUNTED_ITEMS[2].content}
          />
        )
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
        'project-use': (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <p style={{ margin: 0 }}>
              This panel is intentionally pre-opened while its trigger is disabled.
            </p>
            <p style={{ color: '#305176', margin: 0 }}>
              Visual cue: disabled scope is at trigger level, not item level.
            </p>
          </div>
        )
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
      containerStyle: { maxWidth: '58rem' }
    })
};

export const SpaciousDisabled: Story = {
  args: {
    disabled: true,
    sizeVariant: 'spacious'
  }
};
