import { chromium, Browser, Page } from 'playwright';

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected page: Page | null = null;

  async init() {
    // Tarayıcıyı görünür modda (headless: false) açıyoruz ki izleyebilelim
    this.browser = await chromium.launch({ headless: false }); 
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) await this.browser.close();
  }

  abstract scrape(): Promise<any>;
}