import { expect, type Page } from '@playwright/test';

export type FrameworkName = 'react' | 'angular18' | 'angular21';

export const FRAMEWORKS: FrameworkName[] = ['react', 'angular18', 'angular21'];

const FRAMEWORK_BASE_URL: Record<FrameworkName, string> = {
  react: 'http://127.0.0.1:6408',
  angular18: 'http://127.0.0.1:6406',
  angular21: 'http://127.0.0.1:6407'
};

export const STORY_IDS = {
  INTERACTIVE_OVERVIEW: 'accretion-accordion--interactive-overview',
  CONTROLLED_FROM_STATE: 'accretion-accordion--controlled-from-state',
  MULTIPLE_OPEN: 'accretion-accordion--multiple-open',
  SINGLE_NON_COLLAPSIBLE: 'accretion-accordion--single-non-collapsible',
  KEEP_MOUNTED_PANELS: 'accretion-accordion--keep-mounted-panels',
  ITEM_DISABLED: 'accretion-accordion--item-disabled',
  TRIGGER_DISABLED: 'accretion-accordion--trigger-disabled',
  HIDDEN_UNTIL_FOUND: 'accretion-accordion--hidden-until-found',
  HORIZONTAL_NO_LOOP: 'accretion-accordion--horizontal-no-loop',
  SPACIOUS_DISABLED: 'accretion-accordion--spacious-disabled'
} as const;

type StoryArgs = Record<string, string | number | boolean | undefined>;

const formatStoryArgs = (args?: StoryArgs): string | undefined => {
  if (!args) {
    return undefined;
  }

  const parts = Object.entries(args)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}:${String(value)}`);

  return parts.length > 0 ? parts.join(';') : undefined;
};

export const storyUrl = (framework: FrameworkName, storyId: string, args?: StoryArgs): string => {
  const params = new URLSearchParams({ id: storyId, viewMode: 'story' });
  const formattedArgs = formatStoryArgs(args);

  if (formattedArgs) {
    params.set('args', formattedArgs);
  }

  return `${FRAMEWORK_BASE_URL[framework]}/iframe.html?${params.toString()}`;
};

export const gotoStory = async (
  page: Page,
  framework: FrameworkName,
  storyId: string,
  args?: StoryArgs
): Promise<void> => {
  const url = storyUrl(framework, storyId, args);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    try {
      await expect(page.locator('accretion-accordion').first()).toBeVisible({ timeout: 7_000 });
      await expect(page.locator('button[data-accordion-trigger]').first()).toBeVisible({ timeout: 7_000 });
      return;
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }

      await page.waitForTimeout(300);
    }
  }
};

export const activeTriggerValue = async (page: Page): Promise<string | null> =>
  page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    return active?.getAttribute('data-value') ?? null;
  });
