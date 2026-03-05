import { expect, test } from '@playwright/test';
import { FRAMEWORKS, STORY_IDS, activeTriggerValue, gotoStory, type FrameworkName } from './helpers';

const runForEachFramework = (name: string, run: (framework: FrameworkName) => void): void => {
  for (const framework of FRAMEWORKS) {
    test.describe(`${framework} ${name}`, () => {
      run(framework);
    });
  }
};

runForEachFramework('accordion prop coverage', (framework) => {
  test('root type prop toggles single vs multiple behavior', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);
    await expect(page.locator('accretion-accordion')).toHaveAttribute('type', 'single');

    const firstSingle = page.getByRole('button', { name: 'What is Accretion UI?' });
    const secondSingle = page.getByRole('button', { name: 'How do I get started?' });

    await secondSingle.click();
    await expect(firstSingle).toHaveAttribute('aria-expanded', 'false');
    await expect(secondSingle).toHaveAttribute('aria-expanded', 'true');

    await gotoStory(page, framework, STORY_IDS.MULTIPLE_OPEN);
    await expect(page.locator('accretion-accordion')).toHaveAttribute('type', 'multiple');

    const firstMultiple = page.getByRole('button', { name: 'What is Accretion UI?' });
    const secondMultiple = page.getByRole('button', { name: 'How do I get started?' });

    await expect(firstMultiple).toHaveAttribute('aria-expanded', 'true');
    await expect(secondMultiple).toHaveAttribute('aria-expanded', 'true');
  });

  test('root collapsible prop controls whether single item can close itself', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const second = page.getByRole('button', { name: 'How do I get started?' });
    await second.click();
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'false');

    await gotoStory(page, framework, STORY_IDS.SINGLE_NON_COLLAPSIBLE);

    const nonCollapsibleSecond = page.getByRole('button', { name: 'How do I get started?' });
    await nonCollapsibleSecond.click();
    await nonCollapsibleSecond.click();
    await expect(nonCollapsibleSecond).toHaveAttribute('aria-expanded', 'true');
  });

  test('root disabled prop disables all triggers and blocks interaction', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.SPACIOUS_DISABLED);

    const root = page.locator('accretion-accordion');
    await expect(root).toHaveAttribute('disabled', '');

    const triggers = page.locator('button[data-accordion-trigger]');
    await expect(triggers).toHaveCount(3);
    const beforeStates = await triggers.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLButtonElement).getAttribute('aria-expanded'))
    );

    for (let index = 0; index < 3; index += 1) {
      await expect(triggers.nth(index)).toBeDisabled();
      await triggers.nth(index).click({ force: true });
    }

    const afterStates = await triggers.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLButtonElement).getAttribute('aria-expanded'))
    );

    expect(afterStates).toEqual(beforeStates);
  });

  test('focusLoop prop controls arrow key wrapping behavior', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HORIZONTAL_NO_LOOP);

    const first = page.getByRole('button', { name: 'First trigger' });
    const last = page.getByRole('button', { name: 'Last trigger' });

    await last.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('last');

    await gotoStory(page, framework, STORY_IDS.HORIZONTAL_NO_LOOP, { focusLoop: true });

    const firstWithLoop = page.getByRole('button', { name: 'First trigger' });
    const lastWithLoop = page.getByRole('button', { name: 'Last trigger' });

    await lastWithLoop.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('first');

    await firstWithLoop.click();
    await page.keyboard.press('ArrowLeft');
    await expect.poll(async () => activeTriggerValue(page)).toBe('last');
  });

  test('deprecated loop prop overrides focusLoop when provided', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HORIZONTAL_NO_LOOP, { focusLoop: true });

    const accordion = page.locator('accretion-accordion');
    const last = page.getByRole('button', { name: 'Last trigger' });

    await last.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('first');

    await accordion.evaluate((node) => {
      node.setAttribute('loop', 'false');
    });

    await last.click();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('last');
  });

  test('orientation prop changes keyboard model and reflected attributes', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HORIZONTAL_NO_LOOP);

    const root = page.locator('accretion-accordion');
    await expect(root).toHaveAttribute('orientation', 'horizontal');

    const triggers = page.locator('button[data-accordion-trigger]');
    await expect(triggers.first()).toHaveAttribute('data-orientation', 'horizontal');

    const first = page.getByRole('button', { name: 'First trigger' });
    await first.click();

    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => activeTriggerValue(page)).toBe('first');

    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => activeTriggerValue(page)).toBe('middle');
  });

  test('sizeVariant prop reflects and changes trigger spacing density', async ({ page }) => {
    const heights: Record<string, number> = {};

    for (const sizeVariant of ['compact', 'comfortable', 'spacious'] as const) {
      await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW, { sizeVariant });
      await expect(page.locator('accretion-accordion')).toHaveAttribute('size-variant', sizeVariant);
      heights[sizeVariant] = await page
        .locator('button[data-accordion-trigger]')
        .first()
        .evaluate((node) => Number.parseFloat(getComputedStyle(node).minHeight));
    }

    expect(heights.compact).toBeLessThan(heights.comfortable);
    expect(heights.comfortable).toBeLessThan(heights.spacious);
  });

  test('item value and open props drive trigger data-value and open state', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const items = page.locator('accretion-accordion-item');
    await expect(items).toHaveCount(3);

    await expect(items.nth(0)).toHaveAttribute('value', 'what-is-accretion');
    await expect(items.nth(0)).toHaveAttribute('open', '');

    await expect(items.nth(1)).toHaveAttribute('value', 'getting-started');
    await expect(items.nth(1)).not.toHaveAttribute('open', '');

    await expect(page.locator('button[data-accordion-trigger]').nth(1)).toHaveAttribute('data-value', 'getting-started');
  });

  test('item disabled prop disables full item scope', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.ITEM_DISABLED);

    const firstItem = page.locator('accretion-accordion-item').nth(0);
    const secondItem = page.locator('accretion-accordion-item').nth(1);

    await expect(firstItem).not.toHaveAttribute('disabled', '');
    await expect(secondItem).toHaveAttribute('disabled', '');

    await expect(page.locator('button[data-accordion-trigger]').nth(1)).toBeDisabled();
    await expect(secondItem.locator('[data-accordion-item]')).toHaveAttribute('data-disabled', '');
  });

  test('header level prop maps to correct heading element and clamps out-of-range values', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const header = page.locator('accretion-accordion-header').first();

    await header.evaluate((node) => {
      node.setAttribute('level', '2');
    });
    await expect(page.locator('h2[data-accordion-header]').first()).toBeVisible();

    await header.evaluate((node) => {
      node.setAttribute('level', '6');
    });
    await expect(page.locator('h6[data-accordion-header]').first()).toBeVisible();

    await header.evaluate((node) => {
      node.setAttribute('level', '0');
    });
    await expect(page.locator('h1[data-accordion-header]').first()).toBeVisible();
  });

  test('trigger disabled prop can disable only trigger scope', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.TRIGGER_DISABLED);

    const thirdTrigger = page.locator('button[data-accordion-trigger]').nth(2);
    const thirdItem = page.locator('accretion-accordion-item').nth(2).locator('[data-accordion-item]');

    await expect(thirdTrigger).toBeDisabled();
    await expect(thirdItem).not.toHaveAttribute('data-disabled', '');
  });

  test('panel keepMounted prop keeps collapsed content mounted and inert', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.KEEP_MOUNTED_PANELS);

    const sessionTrigger = page.getByRole('button', { name: 'Session notes' });
    const sessionTextbox = page.getByRole('textbox', { name: 'Draft for Session notes' });

    await sessionTextbox.fill('Persistent draft');
    await sessionTrigger.click();

    const firstPanelHost = page.locator('accretion-accordion-panel').first();
    await expect(firstPanelHost).toHaveAttribute('keep-mounted', '');
    await expect(firstPanelHost).toHaveAttribute('inert', '');
    await expect(firstPanelHost).not.toHaveAttribute('hidden', 'until-found');

    await sessionTrigger.click();
    await expect(sessionTextbox).toHaveValue('Persistent draft');
  });

  test('panel hiddenUntilFound prop applies hidden="until-found" while collapsed', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.HIDDEN_UNTIL_FOUND);

    const secondPanel = page.locator('accretion-accordion-panel').nth(1);
    await expect(secondPanel).toHaveAttribute('hidden-until-found', '');
    await expect(secondPanel).toHaveAttribute('hidden', 'until-found');

    await page.getByRole('button', { name: 'Search target alpha' }).click();
    await expect(secondPanel).not.toHaveAttribute('hidden', 'until-found');
  });
});
