import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, iconUrl, link } = await request.json();
    const app = await prisma.apps.update({
      where: { id },
      data: { name, iconUrl, link },
    });
    return NextResponse.json({ success: true, data: app });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update app" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.apps.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete app" },
      { status: 500 }
    );
  }
}
