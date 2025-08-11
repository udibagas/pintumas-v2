import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
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
      orderBy: { name: "asc" },
    });

    // Transform the data to match footer expectations
    const transformedDepartments = departments.map((department) => ({
      id: department.id,
      name: department.name,
      slug: department.slug,
      posts: department._count.posts,
    }));

    return NextResponse.json(transformedDepartments);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
