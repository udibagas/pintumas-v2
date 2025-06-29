import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get featured posts with their categories and authors
    const featuredPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            color: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 8, // Get up to 8 featured posts
    });

    // Transform the data to match the expected format
    const transformedPosts = featuredPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || "",
      image:
        post.imageUrl ||
        "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: post.category.name,
      categorySlug: post.category.slug,
      categoryColor: post.category.color,
      readTime: post.readTime || "5 min read",
      views: post.views || Math.floor(Math.random() * 50000) + 1000, // Use actual views or fallback to mock
      author: post.author.name,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts,
    });
  } catch (error: any) {
    console.error("Error fetching featured posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured posts" },
      { status: 500 }
    );
  }
}
