import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { StorageAdapter, StorageUploadResult } from "../types";

export class CloudflareR2StorageAdapter implements StorageAdapter {
  async uploadFile(
    arg1: string | File | Blob | Uint8Array | ArrayBuffer,
    arg2: string | File | Blob | Uint8Array | ArrayBuffer,
    contentType?: string
  ): Promise<StorageUploadResult> {
    let key: string;
    let dataBuffer: ArrayBuffer;
    let mimeType: string = contentType || "application/octet-stream";
    let sizeBytes: number = 0;

    if (typeof arg1 === "string") {
      key = arg1;
      if (arg2 instanceof File) {
        dataBuffer = await arg2.arrayBuffer();
        mimeType = contentType || arg2.type || "application/octet-stream";
        sizeBytes = arg2.size;
      } else if (arg2 instanceof Blob) {
        dataBuffer = await arg2.arrayBuffer();
        mimeType = contentType || arg2.type || "application/octet-stream";
        sizeBytes = arg2.size;
      } else if (arg2 instanceof Uint8Array) {
        dataBuffer = arg2.buffer as ArrayBuffer;
        sizeBytes = arg2.byteLength;
      } else {
        dataBuffer = arg2 as ArrayBuffer;
        sizeBytes = dataBuffer.byteLength;
      }
    } else {
      key = arg2 as string;
      if (arg1 instanceof File) {
        dataBuffer = await arg1.arrayBuffer();
        mimeType = contentType || arg1.type || "application/octet-stream";
        sizeBytes = arg1.size;
      } else if (arg1 instanceof Blob) {
        dataBuffer = await arg1.arrayBuffer();
        mimeType = contentType || arg1.type || "application/octet-stream";
        sizeBytes = arg1.size;
      } else if (arg1 instanceof Uint8Array) {
        dataBuffer = arg1.buffer as ArrayBuffer;
        sizeBytes = arg1.byteLength;
      } else {
        dataBuffer = arg1 as ArrayBuffer;
        sizeBytes = dataBuffer.byteLength;
      }
    }

    try {
      const { env } = await getCloudflareContext();
      const mediaEnv = (env as Record<string, any>)?.MEDIA;
      if (mediaEnv) {
        await mediaEnv.put(key, dataBuffer, {
          httpMetadata: {
            contentType: mimeType,
          },
        });
        return {
          url: `/api/media/${key}`,
          key,
          sizeBytes,
        };
      }
    } catch {
      // Fallback
    }

    return {
      url: `/uploads/${key}`,
      key,
      sizeBytes,
    };
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const { env } = await getCloudflareContext();
      const mediaEnv = (env as Record<string, any>)?.MEDIA;
      if (mediaEnv) {
        await mediaEnv.delete(key);
      }
    } catch {
      // Fallback
    }
  }

  async getFileUrl(key: string): Promise<string> {
    return `/api/media/${key}`;
  }
}

export const r2StorageAdapter = new CloudflareR2StorageAdapter();
