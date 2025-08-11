import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all apps with their latest 3 posts
    const apps = await prisma.apps.findMany({
      include: {
        Post: {
          where: {
            status: "PUBLISHED",
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: 3,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
        },
        _count: {
          select: {
            Post: {
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

    // Transform the data to match the expected format
    const transformedApps = apps.map((app) => ({
      id: app.id,
      name: app.name,
      description: app.description,
      iconUrl: app.iconUrl,
      link: app.link,
      postsCount: app._count.Post,
      latestPosts: app.Post.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        views: post.views,
        author: post.author,
        department: post.department,
        commentsCount: post._count.comments,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: transformedApps,
    });
  } catch (error) {
    console.error("Error fetching apps for services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch apps for services",
      },
      { status: 500 }
    );
  }
}
