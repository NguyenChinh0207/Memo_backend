import Courses from "../models/Course.js";
import Lessons from "../models/Lesson.js";
import Units from "../models/Unit.js";

export const createLesson = async (req, res) => {
  const data = req.body;

  try {
    const lessons = await Lessons.find({
      unitId: data.unitId,
    });
    if (lessons && lessons.length > 0) {
      lessons.forEach((element) => {
        if (element.title === data.title) {
          return res.status(400).json({
            code: "E400",
            success: false,
            message: "Lesson name is already exist",
          });
        }
      });
    }
    const newlesson = new Lessons({
      ...data,
    });

    await newlesson.save();
    return res.json({
      success: true,
      message: "Create successfull",
      data: newlesson,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
export const editLesson = async (req, res) => {
  const data = req.body;
  try {
    const lesson = await Lessons.findById(data.id);
    for (const [key, value] of Object.entries(data)) {
      if (lesson[key] !== data[key]) {
        lesson[key] = value;
      }
    }

    await lesson.save();
    res.json({
      success: true,
      message: "Edit lesson successfull",
      id: lesson._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const getLessonsByUnitId = async (req, res) => {
  const { unitId } = req.body;
  try {
    const lessons = await Lessons.find({ unitId: unitId })
      .sort({
        createdAt: 1,
      })
    return res.json({
      success: true,
      message: "get list by id successfull",
      data: lessons,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const detailLesson = async (req, res) => {
  const { id } = req.body;
  try {
    const lesson = await Lessons.findById(id);
    const unitId = lesson.unitId;
    const unit = await Units.findById(unitId);
    const courseId = unit.courseId;
    const course = await Courses.findById(courseId);
    const voiceId = course.voice;
    return res.json({
      success: true,
      message: "get detail successfull",
      data: lesson,
      voiceId: voiceId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const deleteLesson = async (req, res) => {
  const { id } = req.body;
  try {
    const lesson = await Lessons.findById(id);
    if (!lesson) {
      return res.json({
        code: "E401",
        success: false,
        message: "Lesson not found",
        data: unit._id,
      });
    }
    lesson.deleteOne();
    res.json({
      success: true,
      message: "delete lesson successfull",
      data: unit._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
