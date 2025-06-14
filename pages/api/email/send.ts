import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { google } from "googleapis"
import formidable from "formidable"
import fs from "fs"
import { authOptions } from "@/pages/api/auth/[...nextauth]"



export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.accessToken) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    // if (!session?.refreshToken) {
    //   console.error("❌ No refresh token found in session");
    // } else {
    //   // console.log("✅ Refresh Token:", session.refreshToken.slice(0, 10) + '...'); // Don't log the full token in production
    //   console.log("✅ Refresh Token:", session.refreshToken)
    // }

    const form = formidable({ multiples: false })

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const subject = fields.subject?.[0] || ""
    const content = fields.content?.[0] || ""
    const recipient = fields.recipient?.[0] || ""
    const attachment = files.attachment?.[0]

    if (!recipient) {
      return res.status(400).json({ error: "Recipient email is required" })
    }

    // Set up Gmail API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + "/api/auth/callback/google",
    )

    oauth2Client.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    })

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Create email message
    let emailMessage = [
      `To: ${recipient}`,
      `Subject: ${subject}`,
      "Content-Type: text/html; charset=utf-8",
      "",
      content,
    ].join("\n")

    // Handle attachment if present
    if (attachment) {
      const boundary = "boundary_" + Date.now()
      const attachmentData = fs.readFileSync(attachment.filepath)
      const attachmentBase64 = attachmentData.toString("base64")

      emailMessage = [
        `To: ${recipient}`,
        `Subject: ${subject}`,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        content,
        "",
        `--${boundary}`,
        `Content-Type: application/octet-stream; name="${attachment.originalFilename}"`,
        `Content-Disposition: attachment; filename="${attachment.originalFilename}"`,
        "Content-Transfer-Encoding: base64",
        "",
        attachmentBase64,
        `--${boundary}--`,
      ].join("\n")
    }

    const encodedMessage = Buffer.from(emailMessage).toString("base64").replace(/\+/g, "-").replace(/\//g, "_")

    // Send email
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error sending email:", JSON.stringify(error, null, 2))
    return res.status(500).json({ error: "Failed to send email" })
  }
}
