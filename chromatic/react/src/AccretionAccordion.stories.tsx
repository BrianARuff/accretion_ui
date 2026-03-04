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
  orientation: 'vertical' | 'horizontal';
  sizeVariant: 'compact' | 'comfortable' | 'spacious';
  keepMounted: boolean;
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

const meta = {
  title: 'Accretion/AccretionAccordion',
  component: AccretionAccordion,
  tags: ['autodocs'],
  args: {
    type: 'single',
    collapsible: true,
    disabled: false,
    orientation: 'vertical',
    sizeVariant: 'comfortable',
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
  render: ({ keepMounted, ...args }: AccordionArgs) => (
    <div style={{ maxWidth: '44rem', padding: '1rem' }}>
      <AccretionAccordion {...args}>
        <AccretionAccordionItem value="what-is-accretion" open>
          <AccretionAccordionHeader>
            <AccretionAccordionTrigger>
              What is Accretion UI?
              <PlusIcon />
            </AccretionAccordionTrigger>
          </AccretionAccordionHeader>
          <AccretionAccordionPanel keepMounted={keepMounted}>
            Accretion UI is a shared component foundation that powers both React and Angular teams
            from a single web-component source.
          </AccretionAccordionPanel>
        </AccretionAccordionItem>

        <AccretionAccordionItem value="getting-started">
          <AccretionAccordionHeader>
            <AccretionAccordionTrigger>
              How do I get started?
              <PlusIcon />
            </AccretionAccordionTrigger>
          </AccretionAccordionHeader>
          <AccretionAccordionPanel keepMounted={keepMounted}>
            Start with the core package, then consume wrappers from `@accretion_ui/react` or the
            Angular package aligned to your framework version.
          </AccretionAccordionPanel>
        </AccretionAccordionItem>

        <AccretionAccordionItem value="project-use">
          <AccretionAccordionHeader>
            <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>
              Optional header preface content
            </div>
            <div>
              <AccretionAccordionTrigger>
                Can I use it for my project?
                <PlusIcon />
              </AccretionAccordionTrigger>
            </div>
          </AccretionAccordionHeader>
          <AccretionAccordionPanel keepMounted={keepMounted}>
            Yes. The accordion parts are composable so teams can add wrappers, helper text, icons,
            and nested layout without breaking keyboard or screen-reader behavior.
          </AccretionAccordionPanel>
        </AccretionAccordionItem>
      </AccretionAccordion>
    </div>
  )
} satisfies Meta<AccordionArgs>;

export default meta;

type Story = StoryObj<AccordionArgs>;

export const Playground: Story = {};

export const MultipleOpen: Story = {
  args: {
    type: 'multiple',
    collapsible: true,
    sizeVariant: 'compact'
  }
};

export const SpaciousDisabled: Story = {
  args: {
    disabled: true,
    sizeVariant: 'spacious'
  }
};
