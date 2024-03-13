const express = require("express");
const Blog = require("../module/blog");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

router.get("/add", (req, res) => {
  return res.render("addBlog.ejs", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");

  return res.render("blog.ejs", {
    user: req.user,
    blog,
  });
});

const upload = multer({ storage: storage });

router.post("/", upload.single("coverImageUrl"), async (req, res) => {
  const { title, body } = req.body;

  await Blog.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.user._id}`);
});

module.exports = router;
