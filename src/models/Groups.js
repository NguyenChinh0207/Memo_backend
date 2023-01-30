import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    type: { type: Number, default: 0 }, // 1: day người khác, 2: học cùng bạn
    courses: [{ type: Schema.Types.ObjectId, ref: "Courses" }], // chỉ hiện thị những khóa học đã thêm vào của tôi
    member: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    active: { type: Number, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);
const Groups = mongoose.model("Groups", GroupSchema, "groups");

export default Groups;
