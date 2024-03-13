const express = require("express");
const path = require("path");
const app = express();
const PORT = 8001;
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const blogRouter = require("./routes/blog");
const Blog = require("./module/blog");

mongoose
  .connect("mongodb://127.0.0.1:27017/blog-app")
  .then(() => console.log("Mongo DB connected"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home.ejs", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT  : ${PORT}`);
});
