import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
    });

    if (!department) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, slug, imageUrl, link } = await request.json();
    const department = await prisma.department.update({
      where: { id: params.id },
      data: { name, slug, imageUrl, link },
    });
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const department = await prisma.department.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
