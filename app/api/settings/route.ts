import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      { success: false, error: "Gagal mengambil pengaturan" },
      { status: 500 }
    );
  }
}
