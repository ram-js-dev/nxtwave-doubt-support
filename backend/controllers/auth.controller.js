import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).send({ message: "Email is already registered" });
  } else {
    await User.create({ username, email, password });
    res.status(201).send({ message: "User registered successfully" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select(
    "_id email role specialization password"
  );
  if (user === null) {
    res.status(400).send({ data: { email: ["Invalid email address"] } });
    return;
  }

  const isPwdMatched = await bcrypt.compare(password, user.password);
  if (!isPwdMatched) {
    res.status(400).send({ data: { password: ["Incorrect password"] } });
    return;
  }
  const payload = {
    userId: user._id,
    role: user.role,
  };
  const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  delete user["password"];
  res.status(200).send({
    message: "User logged in successfully",
    data: { jwtToken, user },
  });
};
