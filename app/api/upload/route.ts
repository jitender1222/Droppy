import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorozed" }, { status: 401 });
    }

    const body = await request.json();
    const { imagekit, userId: bodyUserId } = body;

    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "Unauthorozed" }, { status: 401 });
    }

    if (!imagekit || !imagekit.url) {
      return NextResponse.json(
        { error: "Invalid file upload data" },
        { status: 401 }
      );
    }

    const fileData = {
      name: imagekit.name || "Unititled",
      path: imagekit.filePath || `/droppy/${userId}/`,
      size: imagekit || 0,
      userId: userId,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      parentId: null,
      isFolder: false,
      isStarted: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newFile);
  } catch (error) {
    return NextResponse.json({
      error: "Failed to save the info in the db",
    });
  }
}
