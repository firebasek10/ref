const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require("express");
const fs = require("fs");
const Post = require("./models/Post");
// const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
// const path = require("path");
// connectDB();

const app = express(); 
dotenv.config();
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB Connection Success 👍'))
.catch((err) =>{
    console.log(err);
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const posts = JSON.parse(fs.readFileSync(`${__dirname}/utils/posts.json`, "utf-8"));

const importData = async () => {
  try {
    await Post.create(posts);
    console.log("Data Successfully imported 👌");
    process.exit();
  } catch (error) {
    console.log(`ERROR 💥: ${error}`);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Post.deleteMany({});
    console.log("Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log(`ERROR 💥: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
app.use(express.json());
app.use("/api/v1/posts", postRoutes);