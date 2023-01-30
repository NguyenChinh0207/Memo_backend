import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProgressSchema = new Schema(
  {
    progress: {
      type: String,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);
const Progress = mongoose.model("Progress", ProgressSchema, "progress");

export default Progress;
