import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // parse the form data

    const formData = await request.formData();
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;
    const file = formData.get("file") as File;

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 401 });
    }

    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, userId),
            eq(files.isFolder, true)
          )
        );
    }

    if (!parentId) {
      return NextResponse.json({ error: "File not found" }, { status: 401 });
    }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only images and pdf are allowed" },
        { status: 401 }
      );
    }
    const buffer = await file.arrayBuffer();
    const bufferFile = Buffer.from(buffer);

    const originalFileName = file.name;
    const fileExtension = originalFileName.split(".").pop() || "";

    if (!fileExtension) {
      return NextResponse.json(
        { error: "File has no extension" },
        { status: 401 }
      );
    }

    if (fileExtension === ".exe" || fileExtension === ".php") {
      return NextResponse.json(
        { error: "These extensions are not supported" },
        { status: 401 }
      );
    }
    const uniqueFileName = `${uuid()}.${fileExtension}`;

    const folderPath = parentId
      ? `/droply/${userId}/folder/${parentId}`
      : `/droply/${userId}`;

    const uploadResponse = await imagekit.upload({
      file: bufferFile,
      fileName: uniqueFileName,
      folder: folderPath,
      useUniqueFileName: false,
    });

    const fileData = {
      name: originalFileName,
      path: uploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId: userId,
      parentId: parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(
      { error: "Failed to upload a file" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to upload a file",
      },
      { status: 401 }
    );
  }
}
