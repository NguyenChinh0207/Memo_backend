import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {
      type: String
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    wordsLearned: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
    wishList: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
    role: { type: Number, default: 0 },
    progress: { type: String },
  },
  {
    timestamps: true,
  }
);
const Users = mongoose.model("Users", UserSchema, "users");

export default Users;
