import Courses from "../models/Course";

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
      owner: req.userId,
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
      message: "Edit successfull",
      id: req.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const list = async (req, res) => {
  const { skip, limit, keyword } = req.body;
  try {
    let courses = await Courses.find({
      $or: [
        { language: { $regex: `${keyword}` } },
        { name: { $regex: `${keyword}` } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip * limit)
      .limit(limit);

    const total = await Courses.countDocuments({});

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
    const course = await Courses.findById(id).populate("words");
    res.json({
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
