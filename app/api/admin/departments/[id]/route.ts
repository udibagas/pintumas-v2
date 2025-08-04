import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const department = await prisma.department.findUnique({
      where: { id: id },
    });

    if (!department) {
      return NextResponse.json(
        { success: false, error: "Department not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch department" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      name,
      slug,
      imageUrl,
      link,
      phone,
      email,
      address,
      facebook,
      twitter,
      instagram,
      youtube,
      linkedin,
    } = await request.json();

    const department = await prisma.department.update({
      where: { id: id },
      data: {
        name,
        slug,
        imageUrl,
        link,
        phone,
        email,
        address,
        facebook,
        twitter,
        instagram,
        youtube,
        linkedin,
      },
    });
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update department" },
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
    const department = await prisma.department.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true, data: department });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete department" },
      { status: 500 }
    );
  }
}
