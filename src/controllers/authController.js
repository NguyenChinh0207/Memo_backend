import argon2 from "argon2";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Users from "../models/User.js";
import jwt from "jsonwebtoken";
import Progress from "../models/Progress.js";
import path from "path";
import hbs from "nodemailer-express-handlebars";

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
        code: "E0003",
        success: false,
        message: "Username already taken.",
      });
    }
    const emailField = await Users.findOne({ email });
    if (emailField) {
      return res.status(400).json({
        code: "E0004",
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
        code: "E0001",
        success: false,
        message: "Incorrect username or password.",
      });
    }
    // Usernamr found
    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      return res.status(400).json({
        code: "E0002",
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

export const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "User not found.",
      });
    }

    const isValidOldPassword = await argon2.verify(user.password, oldPassword);

    if (!isValidOldPassword) {
      return res.status(400).json({
        code: "E0002",
        success: false,
        message: "Old password is incorrect.",
      });
    }

    const hashedNewPassword = await argon2.hash(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const generateStrongPassword = () => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?/";

  const all = lower + upper + numbers + symbols;

  const getRandomChar = (chars) =>
    chars[Math.floor(Math.random() * chars.length)];

  let password = "";
  password += getRandomChar(lower); // At least one lowercase
  password += getRandomChar(upper); // At least one uppercase
  password += getRandomChar(numbers); // At least one number
  password += getRandomChar(symbols); // At least one symbol

  // Fill the rest of the password to meet minLength
  while (password.length < 8) {
    password += getRandomChar(all);
  }

  // Shuffle the password to randomize the order
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};

// API gửi mã xác thực qua email
export const generateCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "User not found",
      });
    }

    // Generate verification code
    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    user.code = verificationCode;
    user.save();

    // Gửi email
    const configs = {
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    };

    const hbsOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./src/views"),
        defaultLayout: false,
        layoutsDir: "./src/views",
      },
      viewPath: path.resolve("./src/views"),
      extName: ".handlebars",
    };

    const options = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Your New Password In MEMO",
      template: "verify-password-code-template", // thay tên template bang template của e
      context: {
        //trong này truyền nội dung muốn đưa ra template
        userName: user.username,
        passwordCode: verificationCode,
      },
    };

    const transporter = nodemailer.createTransport(configs);
    transporter.use("compile", hbs(hbsOptions));

    await transporter.sendMail(options);

    res.json({
      success: true,
      message: "Verification code sent to email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// API xác minh mã code
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Kiểm tra xem email và mã code có hợp lệ không
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and code are required.",
      });
    }
    const user = await Users.findOne({ email, code });

    if (!user) {
      return res.status(400).json({
        code: "E0006",
        success: false,
        message: "Email mismatch.",
      });
    }

    // Generate random password
    const randomPassword = generateStrongPassword();
    const hashedPassword = await argon2.hash(randomPassword);

    // Update user's password
    user.password = hashedPassword;
    user.code = "";
    await user.save();

    // Send email
    const configs = {
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD,
      },
    };

    const hbsOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./src/views"),
        defaultLayout: false,
        layoutsDir: "./src/views",
      },
      viewPath: path.resolve("./src/views"),
      extName: ".handlebars",
    };

    const options = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Your New Password In MEMO",
      template: "generator-password-template", // thay tên template bang template của e
      context: {
        //trong này truyền nội dung muốn đưa ra template
        password: randomPassword,
        userName: user.username,
      },
    };

    const transporter = nodemailer.createTransport(configs);
    transporter.use("compile", hbs(hbsOptions));

    await transporter.sendMail(options);

    // Xác minh thành công, có thể lưu trạng thái vào cơ sở dữ liệu người dùng
    res.json({
      success: true,
      message: "Send password successful.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
