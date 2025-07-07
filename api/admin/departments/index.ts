import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const departments = await prisma.department.findMany();
        res.status(200).json({ success: true, data: departments });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: "Failed to fetch departments" });
      }
      break;

    case "POST":
      try {
        const { name, slug, imageUrl, link } = req.body;
        const department = await prisma.department.create({
          data: { name, slug, imageUrl, link },
        });
        res.status(201).json({ success: true, data: department });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: "Failed to create department" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
