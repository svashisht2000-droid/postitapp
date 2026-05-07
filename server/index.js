import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/Posts.js";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());
app.use(cors());
const connectString =
  "mongodb+srv://admin:Muscat123@postitcluster.rjk7gw9.mongodb.net/userInfos?appName=PostITCluster";

app.listen(3001, () => {
  console.log("You are connected to web server");
});

mongoose.connect(connectString).then(() => {
  console.log("Web Server connected to mongodb");
});

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
  const password = req.body.password;  // this is hashed password.(unsafe)
  try {
    const userToUpdate = await UserModel.findOne({ email: email });
    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    userToUpdate.name = name;
    if (password !== userToUpdate.password)
    {
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
