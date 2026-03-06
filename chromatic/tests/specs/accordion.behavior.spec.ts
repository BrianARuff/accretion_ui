import { expect, test } from '@playwright/test';
import { FRAMEWORKS, STORY_IDS, activeTriggerValue, gotoStory, type FrameworkName } from './helpers';

const runForEachFramework = (name: string, run: (framework: FrameworkName) => void): void => {
  for (const framework of FRAMEWORKS) {
    test.describe(`${framework} ${name}`, () => {
      run(framework);
    });
  }
};

runForEachFramework('accordion behavior', (framework) => {
  test('wires trigger and panel aria attributes correctly', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const triggers = page.locator('button[data-accordion-trigger]');
    await expect(triggers).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      const trigger = triggers.nth(index);
      const triggerId = await trigger.getAttribute('id');
      const controlsId = await trigger.getAttribute('aria-controls');

      expect(triggerId, `missing trigger id at index ${index}`).toBeTruthy();
      expect(controlsId, `missing aria-controls at index ${index}`).toBeTruthy();

      const controlledPanel = page.locator(`#${controlsId}`);
      await expect(controlledPanel).toHaveAttribute('aria-labelledby', triggerId ?? '');
    }
  });

  test('emits openValues and openValueLookup based on item value attributes', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const eventDetail = await page.evaluate(async () => {
      const accordion = document.querySelector('accretion-accordion');
      const targetTrigger = document.querySelector('button[data-value="getting-started"]') as HTMLButtonElement | null;

      if (!accordion || !targetTrigger) {
        throw new Error('Accordion or trigger not found');
      }

      return await new Promise<{ openValues: string[]; openValueLookup: Record<string, true> }>((resolve) => {
        accordion.addEventListener(
          'accretionOpenChange',
          (event) => {
            const detail = (event as CustomEvent<{ openValues: string[]; openValueLookup: Record<string, true> }>)
              .detail;
            resolve({
              openValues: [...detail.openValues],
              openValueLookup: { ...detail.openValueLookup }
            });
          },
          { once: true }
        );

        targetTrigger.click();
      });
    });

    expect(eventDetail.openValues).toContain('getting-started');
    expect(eventDetail.openValueLookup['getting-started']).toBe(true);
  });

  test('supports single + collapsible behavior', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const first = page.getByRole('button', { name: 'What is Accretion UI?' });
    const second = page.getByRole('button', { name: 'How do I get started?' });

    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-expanded', 'false');

    await second.click();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(second).toHaveAttribute('aria-expanded', 'true');

    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  test('supports multiple open items when type is multiple', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.MULTIPLE_OPEN);

    const expandedTriggers = page.locator('button[data-accordion-trigger][aria-expanded="true"]');
    await expect(expandedTriggers).toHaveCount(2);

    await page.getByRole('button', { name: 'Can I use it for my project?' }).click();
    await expect(expandedTriggers).toHaveCount(3);
  });

  test('enforces non-collapsible single mode', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.SINGLE_NON_COLLAPSIBLE);

    const first = page.getByRole('button', { name: 'What is Accretion UI?' });
    const second = page.getByRole('button', { name: 'How do I get started?' });

    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');

    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  test('respects disabled scope differences between item and trigger stories', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.ITEM_DISABLED);

    const disabledItemState = page.locator('accretion-accordion-item').nth(1).locator('[data-accordion-item]');
    await expect(disabledItemState).toHaveAttribute('data-disabled', '');
    await expect(page.locator('button[data-accordion-trigger]').nth(1)).toBeDisabled();

    await gotoStory(page, framework, STORY_IDS.TRIGGER_DISABLED);

    const triggerOnlyDisabledButton = page.locator('button[data-accordion-trigger]').nth(2);
    const triggerOnlyItemState = page.locator('accretion-accordion-item').nth(2).locator('[data-accordion-item]');

    await expect(triggerOnlyDisabledButton).toBeDisabled();
    await expect(triggerOnlyItemState).not.toHaveAttribute('data-disabled', '');
    await expect(page.getByText('Visual cue: disabled scope is at trigger level, not item level.')).toBeVisible();
  });

  test('supports keepMounted behavior for persistent panel state', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.KEEP_MOUNTED_PANELS);

    const sessionTrigger = page.getByRole('button', { name: 'Session notes' });
    const sessionTextbox = page.getByRole('textbox', { name: 'Draft for Session notes' });

    await sessionTextbox.fill('Persist me');
    await sessionTrigger.click();

    const firstPanelHost = page.locator('accretion-accordion-panel').first();
    await expect(firstPanelHost).toHaveAttribute('inert', '');

    await sessionTrigger.click();
    await expect(sessionTextbox).toHaveValue('Persist me');
  });

  test('supports hiddenUntilFound behavior on collapsed panels', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HIDDEN_UNTIL_FOUND);

    const panels = page.locator('accretion-accordion-panel');
    await expect(panels.nth(1)).toHaveAttribute('hidden', 'until-found');
    await expect(panels.nth(2)).toHaveAttribute('hidden', 'until-found');

    await page.getByRole('button', { name: 'Search target alpha' }).click();
    await expect(panels.nth(1)).not.toHaveAttribute('hidden', 'until-found');
  });

  test('honors horizontal + no-loop keyboard boundaries', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HORIZONTAL_NO_LOOP);

    const first = page.getByRole('button', { name: 'First trigger' });
    const last = page.getByRole('button', { name: 'Last trigger' });

    await last.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('last');

    await first.click();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(async () => activeTriggerValue(page)).toBe('first');
  });

  test('gives deprecated loop prop precedence over focusLoop', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HORIZONTAL_NO_LOOP, { focusLoop: true });

    const first = page.getByRole('button', { name: 'First trigger' });
    const last = page.getByRole('button', { name: 'Last trigger' });

    await last.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('first');

    await page.locator('accretion-accordion').evaluate((node) => {
      node.setAttribute('loop', 'false');
    });

    await last.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('last');
  });

  test('applies sizeVariant density tokens (compact < comfortable < spacious)', async ({ page }) => {
    const variants: Array<'compact' | 'comfortable' | 'spacious'> = ['compact', 'comfortable', 'spacious'];
    const heights: Record<string, number> = {};

    for (const variant of variants) {
      await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW, { sizeVariant: variant });
      heights[variant] = await page
        .locator('button[data-accordion-trigger]')
        .first()
        .evaluate((trigger) => Number.parseFloat(getComputedStyle(trigger).minHeight));
    }

    expect(heights.compact).toBeLessThan(heights.comfortable);
    expect(heights.comfortable).toBeLessThan(heights.spacious);
  });

  test('supports fully controlled state from framework state container', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.CONTROLLED_FROM_STATE);

    const expandedCount = page.locator('button[data-accordion-trigger][aria-expanded="true"]');

    await expect(page.getByText('Open values: what-is-accretion')).toBeVisible();

    await page.getByRole('button', { name: 'Open all' }).click();
    await expect(expandedCount).toHaveCount(3);
    await expect(page.getByText('Open values: what-is-accretion, getting-started, project-use')).toBeVisible();

    await page.getByRole('button', { name: 'Collapse all' }).click();
    await expect(expandedCount).toHaveCount(0);
    await expect(page.getByText('Open values: none')).toBeVisible();
  });

  test('supports root disabled prop', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.SPACIOUS_DISABLED);

    const triggers = page.locator('button[data-accordion-trigger]');
    await expect(triggers).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      await expect(triggers.nth(index)).toBeDisabled();
    }
  });

  test('supports accordion-header level prop', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const firstHeader = page.locator('accretion-accordion-header').first();

    await firstHeader.evaluate((header) => {
      header.setAttribute('level', '2');
    });
    await expect(page.locator('h2[data-accordion-header]').first()).toBeVisible();

    await firstHeader.evaluate((header) => {
      header.setAttribute('level', '6');
    });
    await expect(page.locator('h6[data-accordion-header]').first()).toBeVisible();
  });
});
