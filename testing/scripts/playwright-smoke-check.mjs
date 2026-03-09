#!/usr/bin/env node
import process from 'node:process';
import { chromium, expect } from '@playwright/test';

const parseArgs = () => {
  const args = process.argv.slice(2);
  const values = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) {
      continue;
    }
    const key = arg.slice(2);
    const value = args[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for argument: ${arg}`);
    }
    values[key] = value;
    i += 1;
  }

  return values;
};

const { target, url } = parseArgs();

if (!target || !url) {
  throw new Error('Usage: playwright-smoke-check.mjs --target <name> --url <http://...>');
}

const getCount = async (page) => {
  const text = await page.locator('body').innerText();
  const match = text.match(/count:\s*(-?\d+)/i);

  if (!match) {
    throw new Error(`Could not find count text in ${target}`);
  }

  return Number(match[1]);
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const getShadowButtonClasses = async (currentPage) =>
  currentPage.locator('accretion-button').evaluateAll((nodes) =>
    nodes.map((node) => {
      const button = node.shadowRoot?.querySelector('button');
      return button?.className ?? null;
    })
  );

const assertButtonVariants = async (currentPage) => {
  await expect(currentPage.locator('accretion-button')).toHaveCount(3);

  const buttonClasses = await getShadowButtonClasses(currentPage);
  expect(buttonClasses).toEqual(['button button--primary', 'button button--secondary', 'button button--tertiary']);
};

const assertSingleAccordionInitialOpenState = async (currentPage) => {
  const accordion = currentPage.locator('accretion-accordion').first();
  await expect(accordion).toBeVisible({ timeout: 15_000 });

  await expect(currentPage.locator('accretion-accordion-item').first()).toHaveAttribute('open', '');
  await expect(currentPage.getByRole('button', { name: 'Accordion import smoke check' })).toHaveAttribute(
    'aria-expanded',
    'true'
  );
};

const assertAngular21AccordionBindings = async (currentPage) => {
  const accordion = currentPage.locator('accretion-accordion').first();
  await expect(accordion).toBeVisible({ timeout: 15_000 });
  await expect(accordion).toHaveAttribute('type', 'multiple');
  await expect(accordion).toHaveAttribute('size-variant', 'compact');

  const items = currentPage.locator('accretion-accordion-item');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).not.toHaveAttribute('open', '');
  await expect(items.nth(1)).toHaveAttribute('open', '');
  await expect(items.nth(2)).not.toHaveAttribute('open', '');

  const first = currentPage.getByRole('button', { name: 'First section' });
  const second = currentPage.getByRole('button', { name: 'Second section' });
  const third = currentPage.getByRole('button', { name: 'Third section' });

  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(third).toHaveAttribute('aria-expanded', 'false');

  await third.click();
  await expect(second).toHaveAttribute('aria-expanded', 'true');
  await expect(third).toHaveAttribute('aria-expanded', 'true');
  await expect(items.nth(2)).toHaveAttribute('open', '');
};

const assertServerRenderedPredefineStyles = async () => {
  if (!target.includes('react-next')) {
    return;
  }

  const ssrPage = await browser.newPage({ javaScriptEnabled: false });

  try {
    await ssrPage.goto(url, { waitUntil: 'domcontentloaded' });

    const hasPredefineRule = await ssrPage.evaluate(() => {
      return [...document.styleSheets].some((sheet) => {
        try {
          return [...sheet.cssRules].some((rule) => {
            return (
              rule.cssText.includes('accretion-button:not(:defined)') &&
              rule.cssText.includes('accretion-accordion:not(:defined)') &&
              rule.cssText.includes('visibility: hidden')
            );
          });
        } catch {
          return false;
        }
      });
    });

    expect(hasPredefineRule).toBe(true);
  } finally {
    await ssrPage.close();
  }
};

try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('accretion-button').first()).toBeVisible({ timeout: 45_000 });
  await assertButtonVariants(page);

  const before = await getCount(page);

  await page.getByText('Increment Count').first().click();
  await expect.poll(async () => getCount(page)).toBe(before + 1);

  await page.getByText('Decrement Count').first().click();
  await expect.poll(async () => getCount(page)).toBe(before);

  await page.getByText('Reset Count').first().click();
  await expect.poll(async () => getCount(page)).toBe(0);

  const accordion = page.locator('accretion-accordion').first();
  if (await accordion.count()) {
    if (target.includes('angular-21')) {
      await assertAngular21AccordionBindings(page);
      await expect(page.getByText('Second item panel content.')).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText('Third item panel content.')).toBeVisible({ timeout: 15_000 });
    } else {
      await assertSingleAccordionInitialOpenState(page);
      await expect(page.getByText(/render successfully/i).first()).toBeVisible({ timeout: 15_000 });
    }
  }

  await assertServerRenderedPredefineStyles();

  console.log(`[${target}] Playwright smoke validation passed at ${url}`);
} finally {
  await browser.close();
}
