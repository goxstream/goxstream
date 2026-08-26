import { type Page, type Locator } from '@playwright/test';

export class HlsConverterPOM {
  readonly page: Page;
  readonly cardTitle: Locator;
  readonly browseButton: Locator;
  readonly convertButton: Locator;
  readonly fileInput: Locator;
  readonly pipelineSection: Locator;
  readonly initVerifyStage: Locator;
  readonly stream1080pStage: Locator;
  readonly scale720pStage: Locator;
  readonly scale480pStage: Locator;
  readonly uploadCdnStage: Locator;
  readonly logHistoryHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cardTitle = page.getByText(/Client-Side Multi-Resolution HLS Converter/i);
    this.browseButton = page.getByRole('button', { name: /Browse File/i });
    this.convertButton = page.getByRole('button', { name: /Convert/i });
    this.fileInput = page.locator('input[type="file"]');
    this.pipelineSection = page.getByText(/Build Pipeline Stages/i);
    this.initVerifyStage = page.getByText(/Init & Verify/i);
    this.stream1080pStage = page.getByText(/1080p Stream/i);
    this.scale720pStage = page.getByText(/720p HD Scale/i);
    this.scale480pStage = page.getByText(/480p SD Scale/i);
    this.uploadCdnStage = page.getByText(/Upload CDN/i);
    this.logHistoryHeader = page.getByText(/Conversion Log History/i);
  }

  async goto() {
    await this.page.goto('/dashboard/episodes/new/sources');
  }
}
