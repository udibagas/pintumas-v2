import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import moment from "moment";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        take: pageSize,
        skip,
      }),
      prisma.media.count(),
    ]);

    return NextResponse.json(
      {
        rows,
        total,
        from: skip + 1,
        to: skip + rows.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching medias:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  // Save file locally
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const dir = moment().format("/YYYY/MM/DD");
  await fs.mkdir(uploadsDir + dir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir + dir, fileName);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads${dir}/${fileName}`;

  // Optionally, get image dimensions if needed (requires extra library)
  let width = null;
  let height = null;
  if (file.type.startsWith("image")) {
    try {
      const sharp = (await import("sharp")).default;
      const metadata = await sharp(buffer).metadata();
      width = metadata.width ?? null;
      height = metadata.height ?? null;
    } catch {
      // sharp not installed or not an image
    }
  }

  const media = await prisma.media.create({
    data: {
      url,
      type: file.type.startsWith("image")
        ? "IMAGE"
        : file.type.startsWith("video")
        ? "VIDEO"
        : "DOCUMENT",
      width,
      height,
      size: file.size,
      filename: file.name,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
