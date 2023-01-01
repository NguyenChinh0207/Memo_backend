import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WordSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
const Words = mongoose.model("Words", WordSchema, "words");

export default Words;
