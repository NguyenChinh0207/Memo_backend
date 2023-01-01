import argon2 from "argon2";
import Users from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { username, password, email } = req.body;

  //Simple validate
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing username or password.",
    });
  }
  try {
    // Check for existing user
    const user = await Users.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Username already taken.",
      });
    }
    const emailField = await Users.findOne({ email });
    if (emailField) {
      return res.status(400).json({
        success: false,
        message: "Email already taken.",
      });
    }
    // All good
    const hardPassword = await argon2.hash(password);
    const newUser = new Users({ username, password: hardPassword, email });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  //Simple validate
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing username or password.",
    });
  }
  try {
    // Check for existing user
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password.",
      });
    }
    // Usernamr found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // All good
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User login successfully",
      accessToken,
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist!",
      });
    }
    return res.json({
      success: true,
      message: "User login successfully",
      accessToken
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
