import { NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function isCloudinaryConfigured() {
  const values = [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ];

  return values.every((value) => value && !value.startsWith("your_"));
}

function uploadImage(buffer: Buffer) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "iwueseter-products", resource_type: "image" },
      (error, result) => {
        if (error || !result) reject(error || new Error("Upload failed"));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Image uploads need Cloudinary credentials in .env before they can be stored." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const images = formData.getAll("images").filter((value): value is File => value instanceof File);

    if (!images.length) {
      return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
    }
    if (images.some((image) => !image.type.startsWith("image/") || image.size > MAX_FILE_SIZE)) {
      return NextResponse.json({ error: "Images must be valid image files and no larger than 10 MB each." }, { status: 400 });
    }

    const uploaded = await Promise.all(images.map(async (image) => {
      const result = await uploadImage(Buffer.from(await image.arrayBuffer()));
      return result.secure_url;
    }));

    return NextResponse.json({ urls: uploaded }, { status: 201 });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "We could not upload those images. Please try again." }, { status: 500 });
  }
}
