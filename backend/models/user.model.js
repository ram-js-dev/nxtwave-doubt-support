import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { USER_ROLES } from "../constants.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is missing"],
    },
    email: {
      type: String,
      required: [true, "Email is missing"],
      unique: [true, "Email already registered"],
    },
    password: {
      type: String,
      required: [true, "Password is missing"],
    },
    role: {
      type: String,
      default: USER_ROLES.student,
      enum: [USER_ROLES.student, USER_ROLES.mentor],
    },
    specialization: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

const user = mongoose.model("User", userSchema);

export default user;
