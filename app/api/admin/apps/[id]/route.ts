import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, iconUrl, link, description, departmentIds } =
      await request.json();

    // Update the app
    const app = await prisma.apps.update({
      where: { id },
      data: {
        name,
        iconUrl: iconUrl || null,
        link: link || null,
        description: description || null,
      },
    });

    // Update department associations
    if (departmentIds !== undefined) {
      // Delete existing associations
      await prisma.departmentApps.deleteMany({
        where: { appId: id },
      });

      // Create new associations
      if (departmentIds.length > 0) {
        await prisma.departmentApps.createMany({
          data: departmentIds.map((departmentId: string) => ({
            appId: id,
            departmentId,
          })),
        });
      }
    }

    // Fetch the updated app with departments
    const appWithDepartments = await prisma.apps.findUnique({
      where: { id },
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

    return NextResponse.json({ success: true, data: appWithDepartments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update app" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.apps.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete app" },
      { status: 500 }
    );
  }
}
