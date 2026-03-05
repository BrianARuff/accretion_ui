import { expect, test } from '@playwright/test';
import { FRAMEWORKS, STORY_IDS, gotoStory, type FrameworkName } from './helpers';

const runForEachFramework = (name: string, run: (framework: FrameworkName) => void): void => {
  for (const framework of FRAMEWORKS) {
    test.describe(`${framework} ${name}`, () => {
      run(framework);
    });
  }
};

runForEachFramework('accordion USWDS-aligned accessibility', (framework) => {
  test('interactive elements in an open panel remain keyboard reachable after tabbing', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.KEEP_MOUNTED_PANELS);

    const firstTrigger = page.getByRole('button', { name: 'Session notes' });
    const input = page.getByRole('textbox', { name: 'Draft for Session notes' });

    await page.keyboard.press('Tab');
    await expect(firstTrigger).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
  });

  test('closed panel opens with Enter and Space keyboard interaction', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const closedTrigger = page.getByRole('button', { name: 'How do I get started?' });

    await closedTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(closedTrigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(closedTrigger).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Space');
    await expect(closedTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('open panel closes with Enter and Space keyboard interaction when collapsible', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const openTrigger = page.getByRole('button', { name: 'What is Accretion UI?' });

    await openTrigger.focus();
    await page.keyboard.press('Enter');
    await expect(openTrigger).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Space');
    await expect(openTrigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(openTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('focus stays on panel header while toggling with keyboard', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const trigger = page.getByRole('button', { name: 'How do I get started?' });

    await trigger.focus();
    await page.keyboard.press('Enter');

    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('hover alone does not toggle panels', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const first = page.getByRole('button', { name: 'What is Accretion UI?' });
    const second = page.getByRole('button', { name: 'How do I get started?' });

    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-expanded', 'false');

    await second.hover();
    await first.hover();

    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  test('focus can move out of accordion with Tab without collapsing an open panel', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    await page.evaluate(() => {
      const existing = document.getElementById('outside-focus-target');
      if (existing) {
        return;
      }

      const outsideButton = document.createElement('button');
      outsideButton.id = 'outside-focus-target';
      outsideButton.type = 'button';
      outsideButton.textContent = 'Outside focus target';
      document.body.appendChild(outsideButton);
    });

    const first = page.getByRole('button', { name: 'What is Accretion UI?' });

    await first.focus();
    for (let pressCount = 0; pressCount < 8; pressCount += 1) {
      const isOutsideFocused = await page.evaluate(
        () => document.activeElement?.id === 'outside-focus-target'
      );

      if (isOutsideFocused) {
        break;
      }

      await page.keyboard.press('Tab');
    }

    await expect(page.locator('#outside-focus-target')).toBeFocused();
    await expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  test('focus moves forward and backward with Tab and Shift+Tab', async ({ page }) => {
    await gotoStory(page, framework, STORY_IDS.KEEP_MOUNTED_PANELS);

    const firstTrigger = page.getByRole('button', { name: 'Session notes' });
    const input = page.getByRole('textbox', { name: 'Draft for Session notes' });

    await page.keyboard.press('Tab');
    await expect(firstTrigger).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(firstTrigger).toBeFocused();
  });

  test('200% zoom does not create horizontal scrolling for the accordion story layout', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const hasHorizontalOverflow = await page.evaluate(() => {
      document.body.style.zoom = '2';
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth > 1;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('200% zoom keeps trigger and panel bounds visible within viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await gotoStory(page, framework, STORY_IDS.INTERACTIVE_OVERVIEW);

    const layoutHasClippedElements = await page.evaluate(() => {
      document.body.style.zoom = '2';

      const viewportWidth = window.innerWidth;
      const candidates = Array.from(
        document.querySelectorAll('button[data-accordion-trigger], [data-accordion-panel]')
      );

      return candidates.some((element) => {
        const rect = (element as HTMLElement).getBoundingClientRect();
        return rect.width > 0 && (rect.left < 0 || rect.right > viewportWidth);
      });
    });

    expect(layoutHasClippedElements).toBe(false);
  });
});
