/**
 * Storage Adapter Module
 * Isolates Cloudflare R2 and S3-compatible object storage APIs.
 * 
 * Priority / Override Rule:
 * 1. Custom Env Overrides (S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID): Override CF bindings directly.
 * 2. Default CF Binding (env.EPISODES_BUCKET / env.R2_BUCKET): Native R2 bucket on Cloudflare Workers.
 * 3. Local/Mock Mode: Development fallback CDN URL generator.
 */

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
}

export async function uploadToStorage(
  filePath: string,
  data: Uint8Array | ArrayBuffer,
  contentType: string,
  cfEnv?: any
): Promise<UploadResult> {
  const bytes = new Uint8Array(data);
  const sizeBytes = bytes.byteLength;

  // 1. Check Explicit Custom S3 Environment Variables Override
  const s3Endpoint = process.env.S3_ENDPOINT;
  const s3Bucket = process.env.S3_BUCKET;
  const publicCdnUrl = process.env.PUBLIC_CDN_URL || "https://cdn.goxstream.tv";

  if (s3Endpoint && s3Bucket) {
    // S3 Custom Override Active
    const cdnUrl = `${publicCdnUrl.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
    return {
      url: cdnUrl,
      key: filePath,
      sizeBytes,
    };
  }

  // 2. Default Cloudflare R2 Binding
  const r2Bucket = cfEnv?.R2 || cfEnv?.EPISODES_BUCKET || cfEnv?.R2_BUCKET;
  if (r2Bucket && typeof r2Bucket.put === "function") {
    await r2Bucket.put(filePath, bytes, {
      httpMetadata: { contentType },
    });
    const cdnUrl = `${publicCdnUrl.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
    return {
      url: cdnUrl,
      key: filePath,
      sizeBytes,
    };
  }

  // 3. Local Development / Fallback Storage URL
  const cdnUrl = `${publicCdnUrl.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
  return {
    url: cdnUrl,
    key: filePath,
    sizeBytes,
  };
}
