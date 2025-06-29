import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/announcements - Get all announcement posts for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isAnnouncement: true, // Only get announcement posts
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) {
      where.announcementType = type;
    }

    if (status !== null && status !== "") {
      where.status = status;
    }

    const [announcements, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching announcement posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcement posts" },
      { status: 500 }
    );
  }
}

// POST /api/admin/announcements - Create new announcement post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // For now, we'll use a hardcoded admin user ID
    // In a real app, you'd get this from the authenticated user session
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const announcement = await prisma.post.create({
      data: {
        ...data,
        slug,
        isAnnouncement: true,
        authorId: adminUser.id,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    console.error("Error creating announcement post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create announcement post" },
      { status: 500 }
    );
  }
}
