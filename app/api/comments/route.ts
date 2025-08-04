import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const postId = searchParams.get("postId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          postId: postId,
          status: "APPROVED",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.comment.count({
        where: {
          postId: postId,
          status: "APPROVED",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        comments,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, postId, authorName } = body;

    // Validate required fields
    if (!content || !postId) {
      return NextResponse.json(
        { success: false, error: "Content and post ID are required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Create or find guest user for anonymous comments
    const guestUser = await prisma.user.upsert({
      where: { email: "guest@guest.com" },
      update: {},
      create: {
        email: "guest@guest.com",
        name: authorName || "Anonymous",
        password: "guest-password", // Not used for actual login
        role: "USER",
        bio: "Guest user for anonymous comments",
      },
    });

    // Create comment (approved by default for immediate visibility)
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        authorId: guestUser.id,
        status: "APPROVED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: comment,
        message: "Comment posted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
