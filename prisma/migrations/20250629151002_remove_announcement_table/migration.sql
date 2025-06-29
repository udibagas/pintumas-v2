/*
  Warnings:

  - You are about to drop the `announcements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_authorId_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "announcementType" "AnnouncementType",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isAnnouncement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkText" TEXT,
ADD COLUMN     "linkUrl" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "announcements";
