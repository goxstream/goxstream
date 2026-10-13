"use client";

export interface GPUTranscodeOptions {
  targetWidth: number;
  targetHeight: number;
  bitrate?: number;
  framerate?: number;
  onProgress?: (progressPercent: number) => void;
}

export interface GPUTranscodeResult {
  encodedChunks: ArrayBuffer[];
  width: number;
  height: number;
  fps: number;
  durationSeconds: number;
}

/**
 * Check if the current browser environment supports WebCodecs GPU Hardware Acceleration.
 */
export function isWebCodecsSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "VideoEncoder" in window &&
    "VideoDecoder" in window &&
    "OffscreenCanvas" in window
  );
}

/**
 * Transcode and scale video using WebCodecs API (GPU Hardware Encoder / VideoEncoder).
 */
export async function transcodeVideoGPU(
  file: File,
  options: GPUTranscodeOptions
): Promise<GPUTranscodeResult> {
  if (!isWebCodecsSupported()) {
    throw new Error("WebCodecs GPU Hardware Acceleration is not supported in this browser.");
  }

  const {
    targetWidth,
    targetHeight,
    bitrate = 2_500_000,
    framerate = 24,
    onProgress,
  } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    const encodedChunks: ArrayBuffer[] = [];

    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration || 1;
        const canvas = new OffscreenCanvas(targetWidth, targetHeight);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(fileUrl);
          reject(new Error("Failed to initialize OffscreenCanvas 2D GPU context."));
          return;
        }

        // Configure WebCodecs VideoEncoder with prefer-hardware GPU acceleration
        const encoder = new VideoEncoder({
          output: (chunk) => {
            const buffer = new ArrayBuffer(chunk.byteLength);
            chunk.copyTo(buffer);
            encodedChunks.push(buffer);
          },
          error: (err) => {
            console.error("[WebCodecs GPU Error]", err);
          },
        });

        const codecString = targetHeight <= 480 ? "avc1.42E01E" : "avc1.42E01F"; // H.264 Baseline

        const encoderConfig: VideoEncoderConfig = {
          codec: codecString,
          width: targetWidth,
          height: targetHeight,
          bitrate,
          framerate,
          hardwareAcceleration: "prefer-hardware",
        };

        const support = await VideoEncoder.isConfigSupported(encoderConfig);
        if (!support.supported) {
          console.warn("[WebCodecs GPU] GPU Config fallback to default AVC", support);
        }

        encoder.configure(encoderConfig);

        const totalFrames = Math.ceil(duration * framerate);
        const frameInterval = 1 / framerate;
        let currentTime = 0;
        let frameCount = 0;

        const processNextFrame = async () => {
          if (currentTime >= duration || frameCount >= totalFrames) {
            await encoder.flush();
            encoder.close();
            URL.revokeObjectURL(fileUrl);

            if (onProgress) onProgress(100);

            resolve({
              encodedChunks,
              width: targetWidth,
              height: targetHeight,
              fps: framerate,
              durationSeconds: duration,
            });
            return;
          }

          video.currentTime = currentTime;
        };

        video.onseeked = async () => {
          try {
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
            const timestampUs = Math.round(currentTime * 1_000_000);
            const frame = new VideoFrame(canvas, {
              timestamp: timestampUs,
            });

            const keyFrame = frameCount % (framerate * 2) === 0;
            encoder.encode(frame, { keyFrame });
            frame.close();

            frameCount++;
            currentTime += frameInterval;

            if (onProgress) {
              const pct = Math.min(Math.round((frameCount / totalFrames) * 100), 99);
              onProgress(pct);
            }

            // Yield event loop to allow GPU pipeline flushing
            setTimeout(processNextFrame, 0);
          } catch (seekErr) {
            URL.revokeObjectURL(fileUrl);
            reject(seekErr);
          }
        };

        // Start processing first frame
        processNextFrame();
      } catch (initErr) {
        URL.revokeObjectURL(fileUrl);
        reject(initErr);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(fileUrl);
      reject(new Error("Failed to load source video file into HTMLVideoElement."));
    };
  });
}
