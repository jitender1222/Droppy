// SDK initialization

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGE_KIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGE_KIT_URL_ENDPOINT || "",
});

export async function GET() {
  const { userId } = await auth();

  try {
    if (!userId) {
      return NextResponse.json({ status: 401 });
    }

    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate auth paramaters for imagekit" },
      { status: 500 }
    );
  }
}
