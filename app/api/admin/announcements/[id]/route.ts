import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/announcements/[id] - Get specific announcement post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const announcement = await prisma.post.findUnique({
      where: {
        id: params.id,
        isAnnouncement: true,
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
        { success: false, error: "Announcement post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcement post" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/announcements/[id] - Update announcement post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const data = await request.json();

    // Generate new slug if title changed
    let updateData = { ...data };
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const announcement = await prisma.post.update({
      where: {
        id: params.id,
        isAnnouncement: true,
      },
      data: {
        ...updateData,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
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
    console.error("Error updating announcement post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update announcement post" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/announcements/[id] - Delete announcement post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.post.delete({
      where: {
        id: params.id,
        isAnnouncement: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Announcement post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete announcement post" },
      { status: 500 }
    );
  }
}
