import { test as baseTest, expect, type Page } from '@playwright/test';
import { HeaderPOM } from '../home/components/header.pom';
import { HeroPOM } from '../home/components/hero.pom';
import { NavMainPOM } from '../dashboard/components/nav-main.pom';
import { HlsConverterPOM } from '../dashboard/components/hls-converter.pom';

type CustomFixtures = {
  headerPOM: HeaderPOM;
  heroPOM: HeroPOM;
  navMainPOM: NavMainPOM;
  hlsConverterPOM: HlsConverterPOM;
};

export const test = baseTest.extend<CustomFixtures>({
  headerPOM: async ({ page }: { page: Page }, use: (r: HeaderPOM) => Promise<void>) => {
    await use(new HeaderPOM(page));
  },
  heroPOM: async ({ page }: { page: Page }, use: (r: HeroPOM) => Promise<void>) => {
    await use(new HeroPOM(page));
  },
  navMainPOM: async ({ page }: { page: Page }, use: (r: NavMainPOM) => Promise<void>) => {
    await use(new NavMainPOM(page));
  },
  hlsConverterPOM: async ({ page }: { page: Page }, use: (r: HlsConverterPOM) => Promise<void>) => {
    await use(new HlsConverterPOM(page));
  },
});

export { expect };


