import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Invalid department ID" });
  }

  switch (method) {
    case "GET":
      try {
        const department = await prisma.department.findUnique({
          where: { id },
        });

        if (!department) {
          return res
            .status(404)
            .json({ success: false, error: "Department not found" });
        }

        res.status(200).json({ success: true, data: department });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: "Failed to fetch department" });
      }
      break;

    case "PUT":
      try {
        const { name, slug, imageUrl, link } = req.body;
        const department = await prisma.department.update({
          where: { id },
          data: { name, slug, imageUrl, link },
        });
        res.status(200).json({ success: true, data: department });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: "Failed to update department" });
      }
      break;

    case "DELETE":
      try {
        const department = await prisma.department.delete({
          where: { id },
        });
        res.status(200).json({ success: true, data: department });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, error: "Failed to delete department" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
