import { signal } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AccretionButton } from '@accretion_ui/angular_21';

type ButtonArgs = {
  variant: 'primary' | 'secondary' | 'tertiary';
  disabled: boolean;
  label: string;
};

type SummaryRow = readonly [prop: string, description: string];

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const BUTTON_PROP_ROWS: SummaryRow[] = [
  ['variant', 'Chooses the visual treatment for the button surface.'],
  ['disabled', 'Prevents pointer and keyboard activation when the action is unavailable.'],
  ['label', 'Supplies the visible button label through the default slot.']
];

const BUTTON_GUIDELINES = [
  'Use the primary variant for the main action in a view and reserve the other variants for lower emphasis.',
  'Keep labels short and action-oriented so the button remains scannable.',
  'Set disabled only when the action cannot run yet; prefer helper text nearby when users need to know why.'
];

const renderSummaryTable = (rows: SummaryRow[]): string => `
  <table style="border-collapse:collapse;width:100%;">
    <thead>
      <tr>
        <th style="border:1px solid #d3dfed;padding:10px;text-align:left;vertical-align:top;">Prop</th>
        <th style="border:1px solid #d3dfed;padding:10px;text-align:left;vertical-align:top;">Description</th>
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          ([prop, description]) => `
            <tr>
              <td style="border:1px solid #d3dfed;padding:10px;text-align:left;vertical-align:top;"><code>${escapeHtml(prop)}</code></td>
              <td style="border:1px solid #d3dfed;padding:10px;text-align:left;vertical-align:top;">${escapeHtml(description)}</td>
            </tr>
          `
        )
        .join('')}
    </tbody>
  </table>
`;

const renderGuidelinesList = (guidelines: string[]): string => `
  <ul style="margin:0;padding-left:20px;">
    ${guidelines.map((guideline) => `<li>${escapeHtml(guideline)}</li>`).join('')}
  </ul>
`;

const renderButtonSummaryPage = () => ({
  template: `
    <div style="display:grid;gap:16px;max-width:64rem;padding:16px;">
      <div style="background:#f4f8fc;border:1px solid #c9d8ea;border-radius:12px;color:#1f2d40;display:grid;gap:8px;padding:12px 14px;">
        <p style="margin:0;"><strong>Button summary</strong></p>
        <p style="margin:0;">Use the button for discrete actions. Choose the variant based on emphasis, then pass the label through the default slot.</p>
      </div>
      <div style="background:#f4f8fc;border:1px solid #c9d8ea;border-radius:12px;color:#1f2d40;display:grid;gap:8px;padding:12px 14px;">
        <p style="margin:0;"><strong>Props</strong></p>
        ${renderSummaryTable(BUTTON_PROP_ROWS)}
      </div>
      <div style="background:#f4f8fc;border:1px solid #c9d8ea;border-radius:12px;color:#1f2d40;display:grid;gap:8px;padding:12px 14px;">
        <p style="margin:0;"><strong>Usage guidelines</strong></p>
        ${renderGuidelinesList(BUTTON_GUIDELINES)}
      </div>
    </div>
  `
});

const meta: Meta<ButtonArgs> = {
  title: 'Accretion/AccretionButton',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [AccretionButton]
    })
  ],
  args: {
    variant: 'primary',
    disabled: false,
    label: 'Click Me'
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'tertiary']
    },
    disabled: {
      control: { type: 'boolean' }
    },
    label: {
      control: { type: 'text' }
    }
  }
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Summary: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
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
  render: () => renderButtonSummaryPage()
};

export const InteractivePrimary: Story = {
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    previewTabs: {
      'storybook/controls/panel': { hidden: true },
      'storybook/actions/panel': { hidden: true },
      'storybook/interactions/panel': { hidden: true }
    }
  },
  render: () => {
    const count = signal(0);

    return {
      props: {
        count,
        increment: () => {
          count.update((value) => value + 1);
        },
        decrement: () => {
          count.update((value) => value - 1);
        },
        reset: () => {
          count.set(0);
        }
      },
      template: `
        <div style="display:grid;gap:12px;max-width:352px;">
          <p><strong>Framework:</strong> angular_21 (Angular 21 + signals)</p>
          <p><strong>Count:</strong> {{ count() }}</p>
          <accretion-button variant="primary" (click)="increment()">Increment Count</accretion-button>
          <accretion-button variant="secondary" (click)="decrement()">Decrement Count</accretion-button>
          <accretion-button variant="tertiary" (click)="reset()">Reset Count</accretion-button>
        </div>
      `
    };
  }
};

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `<accretion-button [variant]="variant" [disabled]="disabled">{{ label }}</accretion-button>`
  })
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary Button'
  },
  render: Primary.render
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    label: 'Tertiary Button'
  },
  render: Primary.render
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Button'
  },
  render: Primary.render
};
