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
      return res.status(200).json(templates)
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
        name,
        subject,
        body,
        placeholders: placeholders || [],
        userId: user._id,
      })
      await newTemplate.save()
      return res.status(201).json(newTemplate)
    } catch (err) {
      console.error("Error saving template:", err)
      return res.status(500).json({ error: "Failed to create template" })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}
