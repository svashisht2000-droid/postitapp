import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/Posts.js";
import ClassModel from "./Models/ClassModel.js";
import CoursesModel from "./Models/CoursesModel.js";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors());

const connectString =
  "mongodb+srv://admin:Muscat123@postitcluster.rjk7gw9.mongodb.net/userInfos?appName=PostITCluster";
const PORT = Number(process.env.PORT) || 3001;

const startServer = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Web Server connected to mongodb");

    const server = app.listen(PORT, () => {
      console.log(`You are connected to web server on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Stop the existing process and restart the server.`,
        );
      } else {
        console.error("Server startup error:", err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();

app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name: name,
      email: email,
      password: hashedpassword,
    });
    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(500).json({ error: "User not found." });
    }
    console.log(user);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

app.post("/savePost", async (req, res) => {
  try {
    const postMsg = req.body.postMsg;
    const email = req.body.email;
    const post = new PostModel({
      postMsg: postMsg,
      email: email,
    });
    await post.save();
    res.send({ post: post, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/getPosts", async (req, res) => {
  try {
    const posts = await PostModel.find({}).sort({ createdAt: -1 });
    const countPost = await PostModel.countDocuments({});
    res.send({ posts: posts, count: countPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/likePost/:postId/", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;
  try {
    const postToUpdate = await PostModel.findOne({ _id: postId });
    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post not found." });
    }
    const userIndex = postToUpdate.likes.users.indexOf(userId);
    if (userIndex !== -1) {
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": -1 },
          $pull: { "likes.users": userId },
        },
        { new: true },
      );
      res.json({ post: updatedPost, msg: "Post unliked." });
    } else {
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": 1 },
          $addToSet: { "likes.users": userId },
        },
        { new: true },
      );
      res.json({ post: updatedPost, msg: "Post liked." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/updateUserProfile/:email/", async (req, res) => {
  const email = req.params.email;
  const name = req.body.name;
  const password = req.body.password; // this is hashed password.(unsafe)
  try {
    const userToUpdate = await UserModel.findOne({ email: email });
    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    userToUpdate.name = name;
    if (password !== userToUpdate.password) {
      const hashedpassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedpassword;
    } else {
      userToUpdate.password = password; //hashed password(unsafe)
    }
    await userToUpdate.save();
    res.send({ user: userToUpdate, msg: "Updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*API to fetch class list with student name */
app.get("/getclasslist", async (req, res) => {
  try {
    // Run an aggregation on classlists collection (ClassModel).
    // Goal: return each class record with studentid and student name.
    const classList = await ClassModel.aggregate([
      // 0) Limit initial results for performance while testing the join logic.
      // In production, consider pagination or filtering by semester/course.
      {
        $limit: 100,
      },
      // 1) Join each class record with students collection.
      // Maps: classlists.studentid -> students.sid
      // Using direct field mapping for performance (no expensive transformations).
      {
        $lookup: {
          from: "students",
          localField: "studentid",
          foreignField: "sid",
          as: "studentInfo",
        },
      },
      // 2) Create a top-level field sname for easier frontend usage.
      // Prefer sname from students collection, otherwise fallback to name field.
      {
        $addFields: {
          sname: {
            $ifNull: [
              { $arrayElemAt: ["$studentInfo.sname", 0] },
              { $ifNull: [{ $arrayElemAt: ["$studentInfo.name", 0] }, ""] },
            ],
          },
        },
      },
      // 3) Return only the fields required by the table.
      // This keeps API response small and easy to consume.
      {
        $project: {
          _id: 1,
          studentid: 1,
          coursecode: 1,
          sem: 1,
          section: 1,
          teacherid: 1,
          sname: 1,
        },
      },
    ]);

    // Send successful response with final array.
    res.status(200).json({ classList });
  } catch (err) {
    // If any DB/pipeline step fails, send error details.
    res.status(500).json({ error: err.message });
  }
});

/*API to fetch all courses */
app.get("/getcourses", async (req, res) => {
  try {
    const department = String(req.query.department || "").trim();
    const filter = {};

    if (department) {
      filter.department = department;
    }

    const courses = await CoursesModel.find(filter).sort({
      department: 0,
      level: 1,
      specialisation: 1,
    });
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*API to fetch unique course departments */
app.get("/getcoursedepartments", async (req, res) => {
  try {
    const rawDepartments = await CoursesModel.distinct("department");
    const departments = rawDepartments
      .map((item) => String(item || "").trim())
      .filter((item) => item.length > 0)
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({ departments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*API to add a new course */
app.post("/addcourse", async (req, res) => {
  try {
    const {
      courseid,
      coursename,
      specialisation,
      level,
      offeredby,
      thrs,
      phrs,
      pgrade,
      pmark,
      pgradepoint,
      cstatus,
      department,
    } = req.body;

    const course = new CoursesModel({
      courseid,
      coursename,
      specialisation,
      level,
      offeredby,
      thrs,
      phrs,
      pgrade,
      pmark,
      pgradepoint,
      cstatus,
      department,
    });

    await course.save();
    res.status(201).json({ course, msg: "Added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
