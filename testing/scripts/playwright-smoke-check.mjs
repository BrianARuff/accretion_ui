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

try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('accretion-button').first()).toBeVisible({ timeout: 45_000 });

  const before = await getCount(page);

  await page.getByText('Increment Count').first().click();
  await expect.poll(async () => getCount(page)).toBe(before + 1);

  await page.getByText('Decrement Count').first().click();
  await expect.poll(async () => getCount(page)).toBe(before);

  await page.getByText('Reset Count').first().click();
  await expect.poll(async () => getCount(page)).toBe(0);

  const accordion = page.locator('accretion-accordion').first();
  if (await accordion.count()) {
    await expect(accordion).toBeVisible({ timeout: 15_000 });
    await page.getByText('Accordion import smoke check').first().click();
    await expect(page.getByText(/render successfully/i).first()).toBeVisible({ timeout: 15_000 });
  }

  console.log(`[${target}] Playwright smoke validation passed at ${url}`);
} finally {
  await browser.close();
}
