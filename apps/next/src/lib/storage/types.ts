/**
 * Standard Storage Adapter Interface
 * Flexible signature supporting both uploadMediaFile(file, key, contentType) and uploadToStorage(key, data, contentType).
 */
export interface StorageUploadResult {
  url: string;
  key: string;
  sizeBytes: number;
}

export interface StorageAdapter {
  uploadFile(
    arg1: string | File | Blob | Uint8Array | ArrayBuffer,
    arg2: string | File | Blob | Uint8Array | ArrayBuffer,
    contentType?: string
  ): Promise<StorageUploadResult>;
  deleteFile(key: string): Promise<void>;
  getFileUrl(key: string): Promise<string>;
}
