import Exams from "../models/Exams";

export const create = async (req, res) => {
  const data = req.body;
  // Simple validate
  if (!data.name) {
    return res.status(400).json({
      success: false,
      message: "Exam name is require",
    });
  }

  try {
    const exams = await Exams.find({
      courseId: data.courseId,
    });
    if (exams && exams.length > 0) {
      exams.forEach((element) => {
        if (element.name === data.name) {
          return res.status(400).json({
            code: "E400",
            success: false,
            message: "Exam name is already exist",
          });
        }
      });
    }
    const newExam = new Exams({
      ...data,
    });

    await newExam.save();
    return res.json({
      success: true,
      message: "Create successfull",
      data: newExam,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const edit = async (req, res) => {
  const data = req.body;
  try {
    const exam = await Exams.findById(data.id);
    for (const [key, value] of Object.entries(data)) {
      if (exam[key] !== data[key]) {
        exam[key] = value;
      }
    }

    await exam.save();
    res.json({
      success: true,
      message: "Edit Course successfull",
      id: exam._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const list = async (req, res) => {
  const { courseId } = req.body;
  try {
    let exams = await Exams.find({ courseId }).populate("courseId");
    res.json({
      success: true,
      message: "get list successfull",
      data: exams,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const detail = async (req, res) => {
  const { id } = req.body;
  try {
    const exam = await Exams.findById(id);
    return res.json({
      success: true,
      message: "get detail successfull",
      data: exam,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const deleteExam = async (req, res) => {
  const { id } = req.body;
  try {
    const exam = await Exams.findById(id);
    if (!exam) {
      return res.json({
        code: "E401",
        success: false,
        message: "exam not found",
        data: exam._id,
      });
    }
    exam.deleteOne();
    res.json({
      success: true,
      message: "delete course successfull",
      data: exam._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
