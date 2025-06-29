import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get("detailed") === "true";

    if (detailed) {
      // Get detailed category information including recent articles
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          _count: {
            select: {
              posts: {
                where: {
                  status: "PUBLISHED",
                },
              },
            },
          },
          posts: {
            where: {
              status: "PUBLISHED",
            },
            select: {
              title: true,
              views: true,
              publishedAt: true,
            },
            orderBy: {
              publishedAt: "desc",
            },
            take: 3,
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      // Transform the data with trending logic and recent articles
      const categoriesWithDetails = categories.map((category) => {
        const totalViews = category.posts.reduce(
          (sum, post) => sum + post.views,
          0
        );
        const avgViews =
          category.posts.length > 0 ? totalViews / category.posts.length : 0;

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description:
            category.description ||
            `Latest news and updates about ${category.name.toLowerCase()}.`,
          color: category.color || "bg-gray-500",
          articles: category._count.posts,
          trending: avgViews > 100, // Consider trending if average views > 100
          recentArticles: category.posts.map((post) => post.title),
        };
      });

      return NextResponse.json({
        success: true,
        data: categoriesWithDetails,
      });
    } else {
      // Simple category list for dropdowns, navigation, etc.
      const categories = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          _count: {
            select: {
              posts: {
                where: {
                  status: "PUBLISHED",
                },
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      // Transform the data to include articles count
      const categoriesWithCount = categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        color: category.color,
        articles: category._count.posts,
      }));

      return NextResponse.json({
        success: true,
        data: categoriesWithCount,
      });
    }
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
