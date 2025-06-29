import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, color: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = PostSchema.parse({
      ...body,
      authorId: user.id,
    });

    const post = await prisma.post.create({
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
        authorId: validatedData.authorId,
        categoryId: validatedData.categoryId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
