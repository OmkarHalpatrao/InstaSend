import mongoose from "mongoose"

const placeholderSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, enum: ["text", "email", "number"], default: "text" },
})

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    placeholders: [placeholderSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Template || mongoose.model("Template", templateSchema)
