import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/admin/announcements/[id] - Get specific announcement
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const announcement = await prisma.announcement.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcement" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/announcements/[id] - Update announcement
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    const announcement = await prisma.announcement.update({
      where: {
        id,
      },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
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
      data: announcement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/announcements/[id] - Delete announcement
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.announcement.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
