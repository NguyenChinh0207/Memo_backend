import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
    },
    my_language: {
      type: String,
    },
    image: {
      type: String,
    },
    voice: { type: Number, default: 13 },
    active: { type: Number, default: 0 },
    words: { type: String },
    units: [{ type: Schema.Types.ObjectId, ref: "Units" }],
    owner: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);
const Courses = mongoose.model("Courses", CourseSchema, "courses");

export default Courses;
