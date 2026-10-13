"use client";

export interface VideoValidationResult {
  isValid: boolean;
  resolution: string;
  width: number;
  height: number;
  format: string;
  errorMessage?: string;
}

/**
 * Validate that input file is an MP4 video and resolution is at least 1080p (height >= 1080 or width >= 1920).
 */
export async function validateVideoFile(
  file: File
): Promise<VideoValidationResult> {
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  // 1. Container & Extension Validation (.mp4)
  const isMp4Extension = fileName.endsWith(".mp4");
  const isMp4Mime = mimeType === "video/mp4" || mimeType.includes("mp4");

  if (!isMp4Extension && !isMp4Mime) {
    return {
      isValid: false,
      resolution: "Unknown",
      width: 0,
      height: 0,
      format: file.type || "Non-MP4",
      errorMessage: `Invalid format (${file.name}). Mandatory file format is MP4 (.mp4).`,
    };
  }

  // 2. Video Resolution Metadata Inspection via HTML5 Video element
  return new Promise((resolve) => {
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";

    const objectUrl = URL.createObjectURL(file);

    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const width = videoEl.videoWidth;
      const height = videoEl.videoHeight;
      const resolution = `${width}x${height}`;

      // Check if resolution is at least 1080p (height >= 1080 or width >= 1920)
      const is1080pOrHigher = height >= 1080 || width >= 1920;

      if (!is1080pOrHigher) {
        resolve({
          isValid: false,
          resolution,
          width,
          height,
          format: "MP4",
          errorMessage: `Video resolution is ${resolution} (${height}p). Master video must be at least 1080p Full HD (1920x1080).`,
        });
      } else {
        resolve({
          isValid: true,
          resolution: `${resolution} (${height}p)`,
          width,
          height,
          format: "MP4",
        });
      }
    };

    videoEl.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        isValid: false,
        resolution: "Unknown",
        width: 0,
        height: 0,
        format: "MP4",
        errorMessage: "Failed to parse video metadata. Please ensure the MP4 file is not corrupted.",
      });
    };

    videoEl.src = objectUrl;
  });
}
