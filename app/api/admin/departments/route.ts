import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, imageUrl, link } = await request.json();
    const department = await prisma.department.create({
      data: { name, slug, imageUrl, link },
    });
    return NextResponse.json(
      { success: true, data: department },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create department" },
      { status: 500 }
    );
  }
}
