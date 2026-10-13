import type { StorageAdapter, StorageUploadResult } from "./types";
import { r2StorageAdapter } from "./r2";
import { s3StorageAdapter } from "./s3";

/**
 * Storage Adapter Facade Resolver
 * Follows "Cloudflare-first, Not Cloudflare-locked" principles:
 * 1. Checks explicit STORAGE_CONNECTION=s3 or S3 credentials override.
 * 2. Defaults to Cloudflare R2 (env.MEDIA) for Cloudflare Workers / Miniflare.
 * 3. Falls back gracefully to S3 / Local Buffer Storage for Node.js / VPS.
 */
export function resolveStorageAdapter(): StorageAdapter {
  const connection = process.env.STORAGE_CONNECTION?.toLowerCase();
  const hasS3Config = Boolean(
    process.env.S3_BUCKET_NAME ||
    process.env.S3_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.S3_ENDPOINT
  );

  if (connection === "s3" || hasS3Config) {
    return s3StorageAdapter;
  }

  return r2StorageAdapter;
}

export async function uploadMediaFile(
  arg1: string | File | Blob | Uint8Array | ArrayBuffer,
  arg2: string | File | Blob | Uint8Array | ArrayBuffer,
  contentType?: string
): Promise<StorageUploadResult> {
  const adapter = resolveStorageAdapter();
  return adapter.uploadFile(arg1, arg2, contentType);
}

export const uploadToStorage = uploadMediaFile;

export async function deleteMediaFile(key: string): Promise<void> {
  const adapter = resolveStorageAdapter();
  return adapter.deleteFile(key);
}

export async function getMediaFileUrl(key: string): Promise<string> {
  const adapter = resolveStorageAdapter();
  return adapter.getFileUrl(key);
}
