import Courses from "../models/Course";

// export const create = async (req, res) => {
//   const { courseId, word } = req.body;

//   try {
//     const course = await Courses.findById(courseId);

//     if (!course) {
//       res.json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     let wordsList = course?.words || [];
//     const newWord = new Words(word);
//     newWord.save();
//     wordsList.push(newWord._id);

//     course.words = wordsList;
//     course.save();

//     res.json({
//       success: true,
//       message: "Create successfull",
//       data: course?.words,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal error server" });
//   }
// };
// export const deleteWord = async (req, res) => {
//   const { courseId, wordId } = req.body;
//   try {
//     const word = await Words.findById(wordId);
//     const course = await Courses.findById(courseId).populate("words");
//     if (!word) {
//       res.json({
//         success: false,
//         message: "This word is not found",
//       });
//     }
//     if (!course) {
//       res.json({
//         success: false,
//         message: "Course not found",
//       });
//     }
//     word.deleteOne();
//     const filteredItems = course?.words.filter((item) => item._id !== wordId);
//     course.words = filteredItems;
//     await course.save();

//     res.json({
//       success: true,
//       message: "delete word successfull",
//       data: course?.words,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Internal error server" });
//   }
// };

export const updateWords = async (req, res) => {
  const { courseId, words } = req.body;
  try {
    const course = await Courses.findById(courseId);
    if (words !== course?.words) {
      course.words = words;
      await course.save();
    }
    res.json({
      success: true,
      message: "Update word successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};
