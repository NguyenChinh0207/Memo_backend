import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UnitSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    tag: { type: String },
    description: { type: String },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skills" }],
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lessons" }],
    courseId: { type: Schema.Types.ObjectId, ref: "Courses" },
  },
  {
    timestamps: true,
  }
);
const Units = mongoose.model("Units", UnitSchema, "units");

export default Units;
