import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
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
    avatar: {
      type: String
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
    wishList: [{ type: Schema.Types.ObjectId, ref: "Courses" }],
    progress: { type: String },
    role: { type: Number },
  },
  {
    timestamps: true,
  }
);
const Users = mongoose.model("Users", UserSchema, "users");

export default Users;
