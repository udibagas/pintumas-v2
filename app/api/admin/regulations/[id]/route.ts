import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const regulation = await prisma.regulations.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!regulation) {
      return NextResponse.json(
        { error: "Regulation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: regulation });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch regulation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { number, title, description, effectiveDate, status, attachmentUrl } =
      body;

    const { id } = await params;
    const regulation = await prisma.regulations.update({
      where: { id },
      data: {
        number,
        title,
        description: description || null,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        departmentId: user.departmentId,
        status: status || "DRAFT",
        attachmentUrl: attachmentUrl || null,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Regulation updated successfully",
      data: regulation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update regulation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.regulations.delete({
      where: { id, departmentId: user.departmentId },
    });

    return NextResponse.json({
      success: true,
      message: "Regulation deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete regulation" },
      { status: 500 }
    );
  }
}
