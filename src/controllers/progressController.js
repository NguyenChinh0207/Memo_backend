import Courses from "../models/Course.js";
import Progress from "../models/Progress.js";
import Users from "../models/User.js";

export const createProgress = async (req, res) => {
  const { progress, userId } = req.body;
  try {
    const progressFounded = await Progress.find({ ownerId: userId });
    if (progressFounded.length > 0) {
      return res.status(400).json({
        code: "E400",
        success: false,
        message: "Progress already taken.",
      });
    } else {
      const newProgress = new Progress({
        progress: progress,
        ownerId: userId,
      });
      await newProgress.save();
      return res.json({
        success: true,
        message: "Create successfull",
        data: newProgress,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const updateProgress = async (req, res) => {
  const { data, userId } = req.body;
  try {
    const newProgress = await Progress.findOne({ ownerId: userId });
    const user = await Users.findOne({ _id: userId });
    newProgress.progress = data;
    user.progress = data;
    await user.save();
    await newProgress.save();
    return res.json({
      success: true,
      message: "Edit successfull",
      id: newProgress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const getProgressByUserId = async (req, res) => {
  const { userId } = req.body;
  try {
    const progressData = await Progress.findOne({ ownerId: userId });
    return res.json({
      success: true,
      message: "get detail successfull",
      data: progressData?.progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
