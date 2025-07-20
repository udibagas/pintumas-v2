import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tag = await prisma.tag.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tag" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    const slug = createSlug(name);

    // Check if another tag with this name/slug exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
          },
        ],
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { success: false, error: "Tag with this name already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.update({
      where: { id: id },
      data: {
        name,
        slug,
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tag" },
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
    await prisma.tag.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
