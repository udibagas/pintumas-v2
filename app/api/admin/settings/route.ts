import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SettingsSchema } from "@/lib/validations";

// GET /api/admin/settings - Get all settings
export async function GET() {
  try {
    const settings = await prisma.settings.findMany();

    // Transform settings into a more usable format
    const settingsObject: any = {};
    settings.forEach((setting) => {
      settingsObject[setting.key] = setting.value;
    });

    // Set defaults if settings don't exist
    const result = {
      contactInfo: settingsObject.contact_info || {
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        fax: "",
      },
      socialMedia: settingsObject.social_media || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        tiktok: "",
      },
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate the data
    const validation = SettingsSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: validation.error },
        { status: 400 }
      );
    }

    const { contactInfo, socialMedia } = validation.data;

    // Update or create contact info
    await prisma.settings.upsert({
      where: { key: "contact_info" },
      update: {
        value: contactInfo,
        updatedAt: new Date(),
      },
      create: {
        key: "contact_info",
        value: contactInfo,
      },
    });

    // Update or create social media
    await prisma.settings.upsert({
      where: { key: "social_media" },
      update: {
        value: socialMedia,
        updatedAt: new Date(),
      },
      create: {
        key: "social_media",
        value: socialMedia,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
