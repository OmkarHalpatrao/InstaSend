
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { connectDB } from "@/utils/db"
import Template from "@/models/Template"
import User from "@/models/User"
import { authOptions } from "@/pages/api/auth/[...nextauth]"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return res.status(401).json({ error: "User not found" })
  }

  if (req.method === "GET") {
    try {
      const templates = await Template.find({ userId: user._id }).sort({ updatedAt: -1 })
      const mapped = templates.map((t) => {
        const plain = t.toObject();
        plain.id = plain._id.toString();
        delete plain._id;
        return plain;
      });
      return res.status(200).json(mapped)
    } catch (err) {
      console.error("Error fetching templates:", err)
      return res.status(500).json({ error: "Failed to fetch templates" })
    }
  }

  if (req.method === "POST") {
    const { name, subject, body, placeholders } = req.body

    if (!name || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    try {
      const newTemplate = new Template({
        name: name.trim(),
        subject: subject.trim(),
        body: body.trim(),
        placeholders: placeholders || [],
        userId: user._id,
      })
      await newTemplate.save()
      const plain = newTemplate.toObject();
      plain.id = plain._id.toString();
      delete plain._id;
      return res.status(201).json(plain)
    } catch (error) {
      console.error("Creating template failed:", error)
      return res.status(500).json({ error: "Failed to create template" })
    }
  }
  res.setHeader("Allow", ["GET", "POST"])
  return res.status(405).json({ error: "Method not allowed" })
}
