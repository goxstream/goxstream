import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const animeSlug = (formData.get("animeSlug") as string) || "general";
    const episodeNum = (formData.get("episodeNum") as string) || "1";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const relativePath = `episodes/${animeSlug}/ep${episodeNum}/${file.name}`;
    const contentType = file.name.endsWith(".m3u8")
      ? "application/x-mpegURL"
      : file.name.endsWith(".ts")
      ? "video/MP2T"
      : file.type || "application/octet-stream";

    const result = await uploadToStorage(relativePath, bytes, contentType);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      sizeBytes: result.sizeBytes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "HLS upload failed" },
      { status: 500 }
    );
  }
}
