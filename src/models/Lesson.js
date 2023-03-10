import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LessonSchema = new Schema(
  {
    title: {
      type: String,
    },
    titleTargetLanguage: {
      type: String,
    },
    content: {
      type: String,
    },
    tagType: {
      type: String,
    },
    video: {
      type: String,
    },
    newWords: [
      {
        type: Object,
      },
    ],
    questions: [
      {
        type: Object,
      },
    ],
    unitId: { type: Schema.Types.ObjectId, ref: "Units" },
  },
  {
    timestamps: true,
  }
);
const Lessons = mongoose.model("Lessons", LessonSchema, "lessons");

export default Lessons;
