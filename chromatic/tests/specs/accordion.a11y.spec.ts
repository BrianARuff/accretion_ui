import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { FRAMEWORKS, STORY_IDS, gotoStory, type FrameworkName } from './helpers';

const A11Y_STORIES = [
  STORY_IDS.INTERACTIVE_OVERVIEW,
  STORY_IDS.CONTROLLED_FROM_STATE,
  STORY_IDS.KEEP_MOUNTED_PANELS,
  STORY_IDS.HIDDEN_UNTIL_FOUND,
  STORY_IDS.HORIZONTAL_NO_LOOP
] as const;

const COMPONENT_LEVEL_RULE_EXCEPTIONS = [
  'landmark-one-main',
  'page-has-heading-one',
  'region'
];

const AXE_BUSY_MESSAGE = 'Axe is already running';

const analyzeWithRetry = async (page: Page) => {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await new AxeBuilder({ page })
        .include('accretion-accordion')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(COMPONENT_LEVEL_RULE_EXCEPTIONS)
        .analyze();
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes(AXE_BUSY_MESSAGE) || attempt === 5) {
        throw error;
      }
      await page.waitForTimeout(200);
    }
  }

  throw new Error('Axe analysis failed after retries');
};

const runForEachFramework = (name: string, run: (framework: FrameworkName) => void): void => {
  for (const framework of FRAMEWORKS) {
    test.describe(`${framework} ${name}`, () => {
      run(framework);
    });
  }
};

runForEachFramework('accordion accessibility', (framework) => {
  for (const storyId of A11Y_STORIES) {
    test(`${storyId} has no critical or serious axe violations`, async ({ page }) => {
      await gotoStory(page, framework, storyId);
      const results = await analyzeWithRetry(page);

      const blockingViolations = results.violations.filter((violation) =>
        ['critical', 'serious'].includes(violation.impact ?? '')
      );

      expect(
        blockingViolations,
        `Axe blocking violations for ${framework} ${storyId}:\n${JSON.stringify(blockingViolations, null, 2)}`
      ).toEqual([]);
    });
  }
});
