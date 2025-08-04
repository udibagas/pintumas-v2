import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50); // Max 50 items per request
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "latest"; // latest, popular, trending
    const featured = searchParams.get("featured");
    const search = searchParams.get("q"); // Search query
    const timeframe = searchParams.get("timeframe"); // Time filter

    // Build where clause
    const where: any = {
      status: "PUBLISHED",
    };

    if (featured !== null) {
      where.featured = featured === "true";
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (timeframe && timeframe !== "all") {
      const now = new Date();
      let timeFilter;

      switch (timeframe) {
        case "today":
          timeFilter = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "week":
          timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          timeFilter = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          timeFilter = new Date(now.getFullYear(), 0, 1);
          break;
      }

      if (timeFilter) {
        where.publishedAt = {
          gte: timeFilter,
        };
      }
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
    const total = await prisma.post.count({ where });

    // Get posts with their categories and authors
    const posts = await prisma.post.findMany({
      where,
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
      readTime: post.readTime || "5 min read",
      views: post.views || 0,
      author: post.author.name,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      featured: post.featured,
      comments: 0, // TODO: Implement comments count when comments system is ready
    }));

    // Calculate pagination info
    const hasMore = offset + limit < total;

    return NextResponse.json({
      success: true,
      data: transformedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
