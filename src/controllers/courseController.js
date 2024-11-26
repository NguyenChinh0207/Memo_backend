import Courses from "../models/Course.js";
import Users from "../models/User.js";
import { getMyCoursesService } from "../services/courses.service.js";

export const create = async (req, res) => {
  const data = req.body;

  if (!data.name || !data.owner) {
    return res.status(400).json({
      code: "E400",
      success: false,
      message: "Name and owner are required",
    });
  }

  try {
    // Tạo khóa học mới
    const newCourse = new Courses({ ...data });
    await newCourse.save();

    // Cập nhật thông tin của owner
    const owner = await Users.findById(data.owner);
    if (!owner) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "Owner not found",
      });
    }

    owner.courses = owner.courses || [];
    owner.courses.push(newCourse._id);
    await owner.save();

    res.json({
      success: true,
      message: "Create successful",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "E500",
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const edit = async (req, res) => {
  const data = req.body;
  // const url = req.protocol + "://" + req.get("host");
  // data.image = url + "/src/uploads/" + data.image;
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
      image: course.image,
      data: course,
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
    });
    let courses = await Courses.find({
      active: 1,
      $or: [
        { language: { $regex: `${keyword}` } },
        { name: { $regex: `${keyword}` } },
      ],
    })
      .populate("owner")
      .populate("units")
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
  const { keyword = "", status } = req.body;

  try {
    // Tạo điều kiện tìm kiếm chính cho khóa học
    const query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // Tìm theo tên khóa học
        { language: { $regex: keyword, $options: "i" } }, // Tìm theo ngôn ngữ
        { my_language: { $regex: keyword, $options: "i" } }, // Tìm theo ngôn ngữ
      ],
    };

    // Kiểm tra nếu status là mảng không rỗng thì thêm điều kiện active
    if (status && status.length > 0) {
      query.active = { $in: status }; // Chỉ tìm khóa học có active trong mảng status
    }

    // Tìm kiếm với các điều kiện
    const courses = await Courses.find(query)
      .populate("owner", "username") // Populate owner nhưng không lọc theo username tại đây
      .sort({ createdAt: -1 });

    // Lọc những khóa học có `owner` khớp điều kiện sau khi populate
    const filteredCourses = courses.filter((course) => course.owner !== null);

    // Lấy tổng số khóa học thỏa mãn điều kiện ban đầu
    const total = await Courses.countDocuments(query);

    res.json({
      success: true,
      message: "Get list all successful",
      data: filteredCourses,
      total: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const listCourseOwner = async (req, res) => {
  const { userId, keyword = "", status } = req.body;

  try {
    // Tạo điều kiện tìm kiếm chính
    const query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // Tìm theo tên khóa học
        { language: { $regex: keyword, $options: "i" } }, // Tìm theo ngôn ngữ
        { my_language: { $regex: keyword, $options: "i" } }, // Tìm theo ngôn ngữ
      ],
    };

    // Nếu có userId thì thêm điều kiện owner
    if (userId) {
      query.owner = userId; // Lọc theo owner (tìm khóa học của người dùng)
    }

    // Nếu có status thì thêm điều kiện active
    if (status && status.length > 0) {
      query.active = { $in: status };
    }

    // Tìm kiếm khóa học với các điều kiện
    const courses = await Courses.find(query)
      .populate("owner", "username") // Populate owner để lấy thông tin username
      .sort({ createdAt: -1 });

    // Lọc các khóa học có owner không phải null
    const filteredCourses = courses.filter((course) => course.owner !== null);

    // Lấy tổng số khóa học thỏa mãn điều kiện ban đầu
    const total = await Courses.countDocuments(query);

    res.json({
      success: true,
      message: "Get list of courses successful",
      data: filteredCourses,
      total: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};


export const detail = async (req, res) => {
  const { id } = req.body;
  try {
    const course = await Courses.findById(id)
      .populate("owner")
      .populate("units");
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

export const deleteCourseByUserId = async (req, res) => {
  const { courseId, userId } = req.body; // Lấy id của khóa học và user từ request

  try {
    const course = await Courses.findById(courseId);

    if (!course) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "Course not found",
      });
    }

    // Xóa khóa học khỏi danh sách courses của người dùng cụ thể
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "User not found",
      });
    }
    user.courses = user.courses.filter(
      (courseId) => courseId.toString() !== courseId
    );
    await user.save();

    // Xóa khóa học khỏi cơ sở dữ liệu
    await course.deleteOne();

    res.json({
      success: true,
      message: "Delete course successful",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.body;

  try {
    const course = await Courses.findById(id);

    if (!course) {
      return res.status(404).json({
        code: "E404",
        success: false,
        message: "Course not found",
      });
    }

    // Delete the course
    await course.deleteOne();

    res.json({
      success: true,
      message: "Delete course successful",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
      return res.status(404).json({
        code: "E404",
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

export const getUniqueUsers = async (req, res) => {
  try {
    const uniqueOwners = await Courses.aggregate([
      // Lấy chỉ trường owner
      {
        $project: {
          owner: 1,
        },
      },
      // Gom các ObjectId của owner vào một mảng duy nhất
      {
        $group: {
          _id: null,
          owners: { $addToSet: "$owner" },
        },
      },
      // Dùng $unwind để tách từng owner
      {
        $unwind: "$owners",
      },
      // Join với collection User để lấy chi tiết
      {
        $lookup: {
          from: "users",
          localField: "owners",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      // Giữ lại thông tin đã join
      {
        $unwind: "$ownerDetails",
      },
      // Chỉ trả về trường cần thiết
      {
        $project: {
          _id: "$owners",
          username: "$ownerDetails.username",
        },
      },
    ]);
    return res.json({
      success: true,
      message: "get users successfull",
      data: uniqueOwners.length > 0 ? uniqueOwners : [],
    });
  } catch (err) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal error server" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    // Kiểm tra xem file đã được upload hay chưa
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or unsupported file type",
      });
    }

    // // Lấy thông tin file đã upload
    // const filePath = `${req.protocol}://${req.get("host")}/public/uploads/${
    //   req.file.mimetype.startsWith("image/") ? "images" : "videos"
    // }/${req.file.filename}`;
    const relativePath = req.file.relativePath;

    // Trả về phản hồi thành công
    return res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: relativePath,
      },
    });
  } catch (error) {
    // Xử lý lỗi kích thước file vượt quá giới hạn
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File size too large",
      });
    }

    // Xử lý lỗi hệ thống khác
    console.error("Error uploading file:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
