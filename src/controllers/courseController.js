import Courses from "../models/Course.js";
import Users from "../models/User.js";
import { getMyCoursesService } from "../services/courses.service.js";

export const create = async (req, res) => {
  const data = req.body;
  // Simple validate
  if (!data.name) {
    return res.status(400).json({
      success: false,
      message: "Course name is require",
    });
  }
  try {
    const newCourse = new Courses({
      ...data,
      owner: data.owner,
    });

    await newCourse.save();
    res.json({
      success: true,
      message: "Create successfull",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const edit = async (req, res) => {
  const data = req.body;
  try {
    const course = await Courses.findById(data.id);
    for (const [key, value] of Object.entries(data)) {
      if (course[key] !== data[key]) {
        course[key] = value;
      }
    }

    await course.save();
    res.json({
      success: true,
      message: "Edit Course successfull",
      id: course._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const list = async (req, res) => {
  const { skip, limit, keyword } = req.body;
  try {
    const coursesTotal = await Courses.find({
      active: 1,
    })
    let courses = await Courses.find({
      active: 1,
      $or: [
        { language: { $regex: `${keyword}` } },
        { name: { $regex: `${keyword}` } },
      ],
    })
      .populate("owner")
      .sort({ createdAt: -1 })
      .skip(skip * limit)
      .limit(limit);

    const total = coursesTotal?.length;

    res.json({
      success: true,
      message: "get list successfull",
      data: courses,
      total: total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const listAll = async (req, res) => {
  const { keyword } = req.body;
  try {
    const coursesTotal = await Courses();
    let courses = await Courses.find({
      $or: [
        { language: { $regex: `${keyword}` } },
        { name: { $regex: `${keyword}` } }
      ],
    })
      .populate("owner")
      .sort({ createdAt: -1 })

    const total = coursesTotal?.length;

    res.json({
      success: true,
      message: "get list all successfull",
      data: courses,
      total: total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};


export const listCourseOwner = async (req, res) => {
  const { userId } = req.body;
  try {
    const coursesTotal = await Courses.find({
      owner: await Users.find({_id: userId})
    })
    let courses = await Courses.find({
      owner: await Users.find({_id: userId})
    })
      .populate("owner")
      .sort({ createdAt: -1 })
    
    const total = coursesTotal?.length;

    res.json({
      success: true,
      message: "get list successfull",
      data: courses,
      total: total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const detail = async (req, res) => {
  const { id } = req.body;
  try {
    const course = await Courses.findById(id)
      .populate("owner");
    return res.json({
      success: true,
      message: "get detail successfull",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.body;
  try {
    const course = await Courses.findById(id);
    if (!course) {
      res.json({
        success: false,
        message: "course not found",
        data: course,
      });
    }
    course.deleteOne();
    res.json({
      success: true,
      message: "delete course successfull",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const addMyCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  try {
    const user = await Users.findById(userId);
    if (user?.wishList && user.wishList.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Course already taken.",
      });
    }
    user.wishList.push(courseId);
    await user.save();
    return res.json({
      success: true,
      message: "add Course successfull",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const removeMyCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  try {
    const user = await Users.findById(userId);
    if (!user?.wishList && !user.wishList.includes(courseId)) {
      return res.status(401).json({
        success: false,
        message: "course not found",
      });
    }
    user.wishList = user?.wishList.filter((item) => {
      return JSON.stringify(item).replaceAll('"', "") !== courseId;
    });
    await user.save();
    return res.json({
      success: true,
      message: "delete course successfull",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const getMyCourses = async (req, res) => {
  const { userId } = req.body;
  try {
    const myCourses = await getMyCoursesService(userId);

    return res.json({
      success: true,
      message: "get my courses successfull",
      data: myCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
