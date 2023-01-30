import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ExamSchema = new Schema(
  {
    name: {
      type: String,
    },
    time_answer: {
      type: Number,
      default: 60,
    },
    questions_appear: { type: Number },
    courseId: { type: Schema.Types.ObjectId, ref: "Courses" },
    questions: [{ type: Object }],
    result: { type: String, default:"{}" },
  },
  {
    timestamps: true,
  }
);
const Exams = mongoose.model("Exams", ExamSchema, "exams");

export default Exams;
