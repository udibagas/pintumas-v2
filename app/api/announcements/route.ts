import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get active announcements ordered by priority and creation date
    const announcements = await prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { startDate: null }, // No start date restriction
          { startDate: { lte: new Date() } }, // Start date has passed
        ],
        AND: [
          {
            OR: [
              { endDate: null }, // No end date restriction
              { endDate: { gte: new Date() } }, // End date hasn't passed yet
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        summary: true,
        announcementType: true,
        priority: true,
        linkUrl: true,
        linkText: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" }, // Higher priority first
        { createdAt: "desc" }, // Latest first
      ],
      take: 5, // Limit to 5 announcements for the ticker
    });

    // Format for ticker display
    const tickerItems = announcements.map((announcement) => ({
      id: announcement.id,
      text: announcement.title,
      content: announcement.summary,
      type: announcement.announcementType?.toLowerCase() || "info",
      priority: announcement.priority,
      linkUrl: announcement.linkUrl || null, // Use provided linkUrl or null
      linkText: announcement.linkText || "Read More",
      createdAt: announcement.createdAt,
      author: announcement.author.name,
    }));

    return NextResponse.json({
      success: true,
      data: tickerItems,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
