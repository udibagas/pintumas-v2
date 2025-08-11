import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all apps with post count for footer display
    const apps = await prisma.apps.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        iconUrl: true,
        link: true,
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

    // Transform the data to match footer expectations
    const transformedApps = apps.map((app) => ({
      id: app.id,
      name: app.name,
      slug: app.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      description: app.description,
      iconUrl: app.iconUrl,
      link: app.link,
      posts: app._count.Post,
    }));

    return NextResponse.json(transformedApps);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch services",
      },
      { status: 500 }
    );
  }
}
