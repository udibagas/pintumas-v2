import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const options: {
      where: { departmentId?: string };
      include: {
        department: {
          select: {
            id: boolean;
            name: boolean;
            slug: boolean;
          };
        };
      };
      orderBy: { createdAt: "desc" };
    } = {
      where: {},
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
    };

    if (user.role === "MODERATOR") {
      options.where.departmentId = user.departmentId;
    }

    const regulations = await prisma.regulations.findMany(options);

    return NextResponse.json(regulations);
  } catch (error: any) {
    console.error("Error fetching regulations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch regulations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { number, title, description, effectiveDate, status, attachmentUrl } =
      body;

    const regulation = await prisma.regulations.create({
      data: {
        number,
        title,
        description: description || null,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        departmentId: user.departmentId,
        status: status || "DRAFT",
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
