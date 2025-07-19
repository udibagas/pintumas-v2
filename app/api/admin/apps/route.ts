import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apps = await prisma.apps.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: apps });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, iconUrl, link } = await request.json();
    const app = await prisma.apps.create({
      data: { name, iconUrl, link },
    });
    return NextResponse.json({ success: true, data: app }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Failed to create app" },
      { status: 500 }
    );
  }
}
