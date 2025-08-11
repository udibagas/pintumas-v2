import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all departments with their latest 3 posts
    const departments = await prisma.department.findMany({
      include: {
        posts: {
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
            app: {
              select: {
                id: true,
                name: true,
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
            posts: {
              where: {
                status: "PUBLISHED",
              },
            },
            users: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to match the expected format
    const transformedDepartments = departments.map((department) => ({
      id: department.id,
      name: department.name,
      slug: department.slug,
      imageUrl: department.imageUrl,
      link: department.link,
      phone: department.phone,
      email: department.email,
      address: department.address,
      postsCount: department._count.posts,
      usersCount: department._count.users,
      latestPosts: department.posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        imageUrl: post.imageUrl,
        publishedAt: post.publishedAt,
        readTime: post.readTime,
        views: post.views,
        author: post.author,
        app: post.app,
        commentsCount: post._count.comments,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: transformedDepartments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch departments",
      },
      { status: 500 }
    );
  }
}
