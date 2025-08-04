import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get trending posts (recent posts with high views - we'll use recent posts for now)
    const trendingPosts = await prisma.post.findMany({
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
      orderBy: [{ publishedAt: "desc" }, { views: "desc" }],
      take: 6, // Get up to 6 trending posts
    });

    // Transform the data to match the expected format
    const transformedPosts = trendingPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || "",
      image:
        post.imageUrl ||
        "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400",
      readTime: post.readTime || "5 min read",
      views: post.views,
      author: post.author.name,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts,
    });
  } catch (error: any) {
    console.error("Error fetching trending posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending posts" },
      { status: 500 }
    );
  }
}
