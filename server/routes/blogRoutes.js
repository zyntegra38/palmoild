import express from "express";
import Multer from "multer";
import Blog from "../models/blog.js";
import cloudinary from "cloudinary";
import {
  fetchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  fetchSingleBlog,
  fetchBlogAll,
} from "../controllers/blogController.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});

const router = express.Router();

router.post("/", upload.single("blog_image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);

    const {
      blog_title,
      blog_url,
      blog_content,
      seo_title,
      seo_description,
      seo_keywords,
      status,
    } = req.body;

    const blog_image = cldRes.secure_url;
    const blogData = {
      blog_title,
      blog_url,
      blog_content,
      seo_title,
      seo_description,
      seo_keywords,
      status,
      blog_image,
    };

    await createBlog(blogData, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update blog with image upload
router.put("/:id", upload.single("blog_image"), async (req, res) => {
  try {
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      updateData.blog_image = cldRes.secure_url;
    }

    const blogData = {
      blog_title: updateData.blog_title || existingBlog.blog_title,
      blog_url: updateData.blog_url || existingBlog.blog_url,
      blog_content: updateData.blog_content || existingBlog.blog_content,
      seo_title: updateData.seo_title || existingBlog.seo_title,
      seo_description:
        updateData.seo_description || existingBlog.seo_description,
      seo_keywords: updateData.seo_keywords || existingBlog.seo_keywords,
      status: updateData.status || existingBlog.status,
      blog_image: updateData.blog_image || existingBlog.blog_image,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
      new: true,
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", fetchBlog);
router.get("/all", fetchBlogAll);
router.get("/:key", fetchSingleBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
