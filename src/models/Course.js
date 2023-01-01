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
      type: String
    },
    active: { type: Number, default: 0 },
    words: [{ type: Schema.Types.ObjectId, ref: "Words" }],
    owner: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);
const Courses = mongoose.model("Courses", CourseSchema, "courses");

export default Courses;
