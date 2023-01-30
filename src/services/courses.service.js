import Progress from "../models/Progress";
import Users from "../models/User";

export const getMyCoursesService = async (userId) => {
  const user = await Users.findById(userId)
    .populate("wishList")
  const progressData = await Progress.findOne({ ownerId: userId });

  const data = {
    progress: progressData?.progress,
    courses: user?.wishList,
  };
  return data || {};
};
