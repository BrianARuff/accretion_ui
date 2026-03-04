import type { CSSProperties } from 'react';
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
  loop: boolean;
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
      'Start with the core package, then consume wrappers from `@accretion_ui/react` or the Angular package aligned to your framework version.'
  },
  {
    value: 'project-use',
    title: 'Can I use it for my project?',
    content:
      'Yes. The accordion parts are composable so teams can add wrappers, helper text, icons, and nested layout without breaking keyboard or screen-reader behavior.'
  }
];

const renderAccordion = ({ keepMounted, ...args }: AccordionArgs, options: StoryRenderOptions = {}) => {
  const initialOpenValues = options.initialOpenValues ?? ['what-is-accretion'];
  const disabledItemValues = new Set(options.disabledItemValues ?? []);
  const disabledTriggerValues = new Set(options.disabledTriggerValues ?? []);
  const hiddenUntilFoundValues = new Set(options.hiddenUntilFoundValues ?? []);

  return (
    <div style={{ maxWidth: '44rem', padding: '1rem', ...options.containerStyle }}>
      <AccretionAccordion {...args}>
        {BASE_ITEMS.map(({ value, title, content }) => (
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
              {content}
            </AccretionAccordionPanel>
          </AccretionAccordionItem>
        ))}
      </AccretionAccordion>
    </div>
  );
};

const meta = {
  title: 'Accretion/AccretionAccordion',
  component: AccretionAccordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
    collapsible: true,
    disabled: false,
    loop: true,
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
    loop: {
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

export const Playground: Story = {};

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
    keepMounted: true
  }
};

export const ItemDisabled: Story = {
  render: (args) =>
    renderAccordion(args, {
      disabledItemValues: ['getting-started']
    })
};

export const TriggerDisabled: Story = {
  render: (args) =>
    renderAccordion(args, {
      disabledTriggerValues: ['project-use']
    })
};

export const HiddenUntilFound: Story = {
  args: {
    keepMounted: false
  },
  render: (args) =>
    renderAccordion(args, {
      hiddenUntilFoundValues: ['getting-started', 'project-use']
    })
};

export const HorizontalNoLoop: Story = {
  args: {
    type: 'multiple',
    orientation: 'horizontal',
    loop: false
  },
  render: (args) =>
    renderAccordion(args, {
      initialOpenValues: ['what-is-accretion', 'getting-started'],
      containerStyle: { maxWidth: '52rem' }
    })
};

export const SpaciousDisabled: Story = {
  args: {
    disabled: true,
    sizeVariant: 'spacious'
  }
};
