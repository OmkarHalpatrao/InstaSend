import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    googleId: { type: String, required: true, unique: true },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", userSchema)
