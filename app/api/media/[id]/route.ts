import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const media = await prisma.media.delete({
      where: { id: parseInt(id, 10) },
    });

    fs.unlink(`public${media.url}`, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully:", media.url);
      }
    });

    return NextResponse.json(media, { status: 200 });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
