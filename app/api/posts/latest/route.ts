import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get latest published posts with their categories and authors
    const latestPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.post.count({
      where: {
        status: "PUBLISHED",
      },
    });

    // Transform the data to match the expected format
    const transformedPosts = latestPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || "",
      image:
        post.imageUrl ||
        "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=600",
      readTime: post.readTime || "5 min read",
      views: post.views || 0,
      author: post.author.name,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      // Mock comments for now - you can add a comments table later
      comments: Math.floor(Math.random() * 100) + 10,
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching latest posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest posts" },
      { status: 500 }
    );
  }
}
