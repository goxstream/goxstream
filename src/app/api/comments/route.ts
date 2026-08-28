import { NextResponse } from "next/server";
import { getCommentsByEpisodeId, createComment } from "@/lib/db/queries/comments";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const episodeId = searchParams.get("episodeId");

  if (!episodeId) {
    return NextResponse.json({ error: "episodeId is required" }, { status: 400 });
  }

  const commentsList = await getCommentsByEpisodeId(episodeId);
  return NextResponse.json({ comments: commentsList });
}

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const { animeId, episodeId, parentId, content, isSpoiler, guestName, userId } = body;

    if (!animeId || !episodeId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await createComment({
      animeId,
      episodeId,
      parentId,
      content,
      isSpoiler,
      guestName,
      userId,
    });

    if (!created) {
      return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }

    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (error) {
    console.error("API error posting comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
