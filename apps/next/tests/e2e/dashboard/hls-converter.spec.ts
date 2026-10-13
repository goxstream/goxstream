import { test, expect } from '../fixtures/test.fixture';

test.describe('Dashboard - HLS Studio Converter E2E Test', () => {
  test('should render HLS Converter component and pipeline stages', async ({ hlsConverterPOM }) => {
    await hlsConverterPOM.goto();
    await expect(hlsConverterPOM.cardTitle).toBeVisible();
    await expect(hlsConverterPOM.pipelineSection).toBeVisible();
    await expect(hlsConverterPOM.initVerifyStage).toBeVisible();
    await expect(hlsConverterPOM.stream1080pStage).toBeVisible();
    await expect(hlsConverterPOM.scale720pStage).toBeVisible();
    await expect(hlsConverterPOM.scale480pStage).toBeVisible();
    await expect(hlsConverterPOM.uploadCdnStage).toBeVisible();
  });

  test('should render browse file button and log history window', async ({ hlsConverterPOM }) => {
    await hlsConverterPOM.goto();
    await expect(hlsConverterPOM.browseButton).toBeVisible();
    await expect(hlsConverterPOM.logHistoryHeader).toBeVisible();
  });

  test('should render engine mode toggle buttons and support switching', async ({ hlsConverterPOM }) => {
    await hlsConverterPOM.goto();
    await expect(hlsConverterPOM.singleThreadedButton).toBeVisible();
    await expect(hlsConverterPOM.multiThreadedButton).toBeVisible();

    await hlsConverterPOM.multiThreadedButton.click();
    await expect(hlsConverterPOM.multiThreadedButton).toHaveClass(/bg-primary/);

    await hlsConverterPOM.singleThreadedButton.click();
    await expect(hlsConverterPOM.singleThreadedButton).toHaveClass(/bg-primary/);
  });

  test('should accept sample video file upload and initiate pipeline', async ({ hlsConverterPOM, page }) => {
    await hlsConverterPOM.goto();

    // Create a dummy video file payload for input testing
    const sampleBuffer = Buffer.from('dummy video content');
    await hlsConverterPOM.fileInput.setInputFiles({
      name: 'sample-master-1080p.mp4',
      mimeType: 'video/mp4',
      buffer: sampleBuffer,
    });

    // Check that selected file name or validation log entry is generated
    await expect(page.getByText(/File selected: sample-master-1080p.mp4/i)).toBeVisible();
  });
});

