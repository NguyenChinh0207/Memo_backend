import Courses from "../models/Course";
import Words from "../models/Word";

export const create = async (req, res) => {
  const { courseId, words } = req.body;

  try {
    const course = await Courses.findById(courseId);

    if (!course) {
      res.json({
        success: false,
        message: "Course not found",
      });
    }

    let wordsList = [];
    words.forEach((item) => {
      const newWord = new Words(item);
      newWord.save();
      wordsList.push(newWord._id);
    });

    course.words = wordsList;
    course.save();

    res.json({
      success: true,
      message: "Create successfull",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
