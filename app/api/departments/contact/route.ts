import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        link: true,
        phone: true,
        email: true,
        address: true,
        facebook: true,
        twitter: true,
        instagram: true,
        youtube: true,
        linkedin: true,
        _count: {
          select: {
            posts: true,
            users: true,
            Regulations: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error: any) {
    console.error("Error fetching departments for contact:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
