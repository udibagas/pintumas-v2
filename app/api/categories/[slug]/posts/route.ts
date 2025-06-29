import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "latest";

    // First, get the category by slug
    const category = await prisma.category.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Build orderBy clause
    let orderBy: any = [];

    switch (sortBy) {
      case "popular":
        orderBy = [{ views: "desc" }, { publishedAt: "desc" }];
        break;
      case "trending":
        orderBy = [{ views: "desc" }, { createdAt: "desc" }];
        break;
      case "latest":
      default:
        orderBy = [{ publishedAt: "desc" }];
        break;
    }

    // Get total count for pagination
    const total = await prisma.post.count({
      where: {
        status: "PUBLISHED",
        categoryId: category.id,
      },
    });

    // Get posts for this category
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: category.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy,
      skip: offset,
      take: limit,
    });

    // Transform the data to match the expected format
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary || "",
      image:
        post.imageUrl ||
        "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=600",
      author: post.author.name,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      readTime: post.readTime || "5 min read",
      views: post.views || 0,
      comments: 0, // TODO: Implement comments count when comments system is ready
      featured: post.featured,
    }));

    // Calculate pagination info
    const hasMore = offset + limit < total;

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color,
          articleCount: total,
        },
        posts: transformedPosts,
        pagination: {
          total,
          limit,
          offset,
          hasMore,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching category posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch category posts" },
      { status: 500 }
    );
  }
}
