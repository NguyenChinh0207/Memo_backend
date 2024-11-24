import argon2 from "argon2";
import Users from "../models/User.js";
import jwt from "jsonwebtoken";
import Progress from "../models/Progress.js";

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
        code: "E003",
        success: false,
        message: "Username already taken.",
      });
    }
    const emailField = await Users.findOne({ email });
    if (emailField) {
      return res.status(400).json({
        code: "E004",
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
      data: newUser,
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
        code: "E001",
        success: false,
        message: "Incorrect username or password.",
      });
    }
    // Usernamr found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(400).json({
        code: "E002",
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
      data: user,
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
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const saveUser = async (req, res, next) => {
  const user_fb = req.body;
  try {
    const email_fb = user_fb?.email;
    const user = await Users.findOne({ email: email_fb });
    if (user) {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );
      return res.json({
        success: true,
        message: "User login successfully",
        accessToken,
        data: user,
      });
    } else {
      const newUser = new Users({
        username: user_fb?.name,
        email: user_fb?.email,
      });
      await newUser.save();
      const accessToken = jwt.sign(
        { userId: user_fb?.userID },
        process.env.ACCESS_TOKEN_SECRET
      );
      return res.json({
        success: true,
        message: "User login successfully",
        accessToken,
        data: newUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
export const listUsers = async (req, res) => {
  const { keyword, roleType } = req.body; // Thêm status vào đây
  try {
    let query = {
      $or: [
        { username: { $regex: `${keyword}`, $options: "i" } },
        { fullname: { $regex: `${keyword}`, $options: "i" } },
        { email: { $regex: `${keyword}`, $options: "i" } },
      ],
    };

    // Kiểm tra nếu có status thì thêm vào điều kiện tìm kiếm
    if (roleType && roleType.length > 0) {
      query.role = { $in: roleType }; // Điều kiện tìm kiếm theo active
    }

    let users = await Users.find(query)
      .populate("courses")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "get list successful",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const editUser = async (req, res) => {
  const data = req.body; // Lấy dữ liệu từ request body
  try {
    const user = await Users.findById(data._id); // Tìm người dùng theo _id

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    for (const [key, value] of Object.entries(data)) {
      if (key === "progress") {
        // Cập nhật progress vào bảng Progress
        const existingProgress = await Progress.findOne({ ownerId: data._id });

        if (existingProgress) {
          // Nếu đã có bản ghi Progress, cập nhật progress
          existingProgress.progress = value;
          await existingProgress.save();
        } else {
          // Nếu chưa có bản ghi Progress, tạo mới
          await Progress.create({
            ownerId: data._id,
            progress: value,
          });
        }
      } else {
        // Cập nhật thông tin khác trong bảng Users
        if (user[key] !== data[key]) {
          user[key] = value;
        }
      }
    }

    await user.save(); // Lưu lại thông tin người dùng

    res.json({
      success: true,
      message: "Edit User successful",
      id: user._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};