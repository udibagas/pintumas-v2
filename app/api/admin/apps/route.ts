import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apps = await prisma.apps.findMany({
      include: {
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
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(apps);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, iconUrl, link, description, departmentIds } =
      await request.json();

    const app = await prisma.apps.create({
      data: {
        name,
        iconUrl: iconUrl || null,
        link: link || null,
        description: description || null,
      },
    });

    // Create department associations
    if (departmentIds && departmentIds.length > 0) {
      await prisma.departmentApps.createMany({
        data: departmentIds.map((departmentId: string) => ({
          appId: app.id,
          departmentId,
        })),
      });
    }

    // Fetch the created app with departments
    const appWithDepartments = await prisma.apps.findUnique({
      where: { id: app.id },
      include: {
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
    });

    return NextResponse.json(
      { success: true, data: appWithDepartments },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Failed to create app" },
      { status: 500 }
    );
  }
}
