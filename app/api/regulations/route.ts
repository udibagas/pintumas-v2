import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const departmentId = searchParams.get("departmentId") || "";

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {
      status: "PUBLISHED", // Only fetch published regulations
    };

    // Add search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { number: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add department filter
    if (departmentId && departmentId !== "all") {
      if (departmentId === "null") {
        where.departmentId = null;
      } else {
        where.departmentId = departmentId;
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.regulations.count({ where });

    // Get regulations with pagination
    const regulations = await prisma.regulations.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: regulations,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch regulations" },
      { status: 500 }
    );
  }
}
