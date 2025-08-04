import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Build where clause based on user role
    const whereClause =
      user.role === "MODERATOR"
        ? { id, authorId: user.id } // Moderators can only access their own posts
        : { id }; // Admins can access any post

    const post = await prisma.post.findUnique({
      where: whereClause,
      include: {
        author: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
        app: { select: { id: true, name: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch post" },
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
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if post exists and user has permission to update it
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Moderators can only update their own posts
    if (user.role === "MODERATOR" && existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own posts" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = PostSchema.parse({
      ...body,
      authorId: existingPost.authorId, // Keep original author
    });

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        summary: validatedData.summary,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        status: validatedData.status,
        featured: validatedData.featured,
        readTime: validatedData.readTime,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
        departmentId: validatedData.departmentId,
        appId: validatedData.appId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
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
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if post exists and user has permission to delete it
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Moderators can only delete their own posts
    if (user.role === "MODERATOR" && existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own posts" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
