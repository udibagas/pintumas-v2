import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const regulations = await prisma.regulations.findMany({
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
    });

    return NextResponse.json({ success: true, data: regulations });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch regulations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, departmentId, attachmentUrl } = body;

    const regulation = await prisma.regulations.create({
      data: {
        title,
        content,
        departmentId: departmentId || null,
        attachmentUrl: attachmentUrl || null,
      },
      include: {
        department: {
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
      message: "Regulation created successfully",
      data: regulation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create regulation" },
      { status: 500 }
    );
  }
}
