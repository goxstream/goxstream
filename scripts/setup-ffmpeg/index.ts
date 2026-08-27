import fs from "node:fs";
import path from "node:path";

const CORE_VERSION = "0.12.10";
const BASE_PUBLIC_DIR = path.join(process.cwd(), "public", "ffmpeg");
const MT_DIR = path.join(BASE_PUBLIC_DIR, "core-mt");
const ST_DIR = path.join(BASE_PUBLIC_DIR, "core");

const MT_CDN_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;
const ST_CDN_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
const GITHUB_ASSETS_BASE = `https://github.com/goxstream/goxstream/releases/download/assets`;

interface FileRequirement {
  dir: string;
  name: string;
  urls: string[];
  expectedMinSize: number;
}

const FILES_TO_DOWNLOAD: FileRequirement[] = [
  {
    dir: MT_DIR,
    name: "ffmpeg-core.js",
    urls: [
      `${MT_CDN_BASE}/ffmpeg-core.js`,
      `${GITHUB_ASSETS_BASE}/ffmpeg-core-mt.js`,
    ],
    expectedMinSize: 100_000,
  },
  {
    dir: MT_DIR,
    name: "ffmpeg-core.wasm",
    urls: [
      `${MT_CDN_BASE}/ffmpeg-core.wasm`,
      `${GITHUB_ASSETS_BASE}/ffmpeg-core-mt.wasm`,
    ],
    expectedMinSize: 30_000_000,
  },
  {
    dir: MT_DIR,
    name: "ffmpeg-core.worker.js",
    urls: [
      `${MT_CDN_BASE}/ffmpeg-core.worker.js`,
      `${GITHUB_ASSETS_BASE}/ffmpeg-core-mt.worker.js`,
    ],
    expectedMinSize: 1_500,
  },
  {
    dir: ST_DIR,
    name: "ffmpeg-core.js",
    urls: [
      `${ST_CDN_BASE}/ffmpeg-core.js`,
      `${GITHUB_ASSETS_BASE}/ffmpeg-core-st.js`,
    ],
    expectedMinSize: 100_000,
  },
  {
    dir: ST_DIR,
    name: "ffmpeg-core.wasm",
    urls: [
      `${ST_CDN_BASE}/ffmpeg-core.wasm`,
      `${GITHUB_ASSETS_BASE}/ffmpeg-core-st.wasm`,
    ],
    expectedMinSize: 30_000_000,
  },
];

async function downloadFileWithFallback(urls: string[], destPath: string, fileName: string): Promise<void> {
  let lastError: Error | null = null;
  for (const url of urls) {
    try {
      console.log(`[FFmpeg Setup] Downloading ${fileName} from ${url}...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
      console.log(`[FFmpeg Setup] Saved ${fileName} (${sizeMB} MB) to ${path.relative(process.cwd(), destPath)}`);
      return;
    } catch (err: any) {
      console.warn(`[FFmpeg Setup Warning] Failed downloading ${fileName} from ${url}: ${err.message}. Trying next fallback...`);
      lastError = err;
    }
  }
  throw new Error(`[FFmpeg Setup Error] All download sources failed for ${fileName}. Last error: ${lastError?.message}`);
}

async function runSetup() {
  console.log("=== FFmpeg WASM Local Pre-Deploy Asset Setup ===");
  console.log(`Target Version: v${CORE_VERSION}`);

  // Ensure directories exist
  fs.mkdirSync(MT_DIR, { recursive: true });
  fs.mkdirSync(ST_DIR, { recursive: true });

  let downloadedCount = 0;
  let skippedCount = 0;

  for (const item of FILES_TO_DOWNLOAD) {
    const destPath = path.join(item.dir, item.name);
    let needsDownload = true;

    if (fs.existsSync(destPath)) {
      const stat = fs.statSync(destPath);
      if (stat.size >= item.expectedMinSize) {
        console.log(`[FFmpeg Setup] ${item.name} already exists in ${path.relative(process.cwd(), item.dir)} (${(stat.size / (1024 * 1024)).toFixed(2)} MB). Skipping.`);
        needsDownload = false;
        skippedCount++;
      }
    }

    if (needsDownload) {
      await downloadFileWithFallback(item.urls, destPath, `${path.basename(item.dir)}/${item.name}`);
      downloadedCount++;
    }
  }

  console.log("------------------------------------------------");
  console.log(`[FFmpeg Setup] Completed! (${downloadedCount} downloaded, ${skippedCount} existing verified)`);
  console.log("Local assets ready for offline local development.");
}

runSetup().catch((err) => {
  console.error("[FFmpeg Setup Error]", err);
  process.exit(1);
});
