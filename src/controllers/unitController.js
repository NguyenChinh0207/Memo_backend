import Courses from "../models/Course.js";
import Exams from "../models/Exams.js";
import Units from "../models/Unit.js";

export const createUnit = async (req, res) => {
  const data = req.body;

  try {
    const units = await Units.find({
      courseId: data.courseId,
    });
    if (units && units.length > 0) {
      units.forEach((element) => {
        if (element.name === data.name) {
          return res.status(400).json({
            code: "E400",
            success: false,
            message: "Unit name is already exist",
          });
        }
      });
    }
    const newUnit = new Units({
      ...data,
    });

    await newUnit.save();
    return res.json({
      success: true,
      message: "Create successfull",
      data: newUnit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const editUnit = async (req, res) => {
  const data = req.body;
  try {
    const unit = await Units.findById(data.id);
    for (const [key, value] of Object.entries(data)) {
      if (unit[key] !== data[key]) {
        unit[key] = value;
      }
    }

    await unit.save();
    res.json({
      success: true,
      message: "Edit unit successfull",
      id: unit._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const detailUnit = async (req, res) => {
  const { id } = req.body;
  try {
    const unit = await Units.findById(id);
    return res.json({
      success: true,
      message: "get detail successfull",
      data: unit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const getUnitsByCourseId = async (req, res) => {
  const { courseId } = req.body;
  try {
    const units = await Units.find({ courseId: courseId })
      .sort({
        createdAt: 1,
      })
      .populate("lessons");
    return res.json({
      success: true,
      message: "get list by id successfull",
      data: units,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const deleteUnit = async (req, res) => {
  const { id } = req.body;
  try {
    const unit = await Units.findById(id);
    if (!unit) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "Unit not found",
        data: unit._id,
      });
    }
    unit.deleteOne();
    res.json({
      success: true,
      message: "delete unit successfull",
      data: unit._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
