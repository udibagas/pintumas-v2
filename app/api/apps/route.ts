import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apps = await prisma.apps.findMany({
      select: {
        id: true,
        name: true,
        iconUrl: true,
        link: true,
        description: true,
        DepartmentApps: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: apps,
    });
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch apps",
      },
      { status: 500 }
    );
  }
}
