import Blog from "../models/blog.js";
import asyncHandler from "express-async-handler";
import path from "path";

export const createBlog = asyncHandler(async (blogData, res) => {
  try {
    const {
      blog_title,
      blog_url,
      blog_content,
      seo_title,
      seo_description,
      seo_keywords,
      status,
      blog_image,
    } = blogData;

    if (!blog_image) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    const newBlog = new Blog({
      blog_title,
      blog_url,
      blog_image,
      blog_content,
      seo_title,
      seo_description,
      seo_keywords,
      status,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

function extractFileName(filePath) {
  return path.basename(filePath);
}

// Get all categories for frontend
export const fetchBlogAll = async (req, res) => {
  try {
    const Blogdetails = await Blog.find({}, "blog_url blog_content");
    res.json(Blogdetails);
  } catch (error) {
    console.error("Error fetching Blog data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all categories
export const fetchBlog = async (req, res) => {
  try {
    const Blogdetails = await Blog.find();
    res.json(Blogdetails);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a category/blog
export const updateBlog = async (id, blogData) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, {
      new: true,
    });
    return updatedBlog; // Return the updated blog data
  } catch (error) {
    console.error("Error in updateBlog:", error);
    throw new Error(error.message); // Throw error to be handled in the route
  }
};

export const fetchSingleBlog = async (req, res) => {
  const key = req.params.key;
  try {
    const existingBlog = await Blog.findOne(
      { blog_url: key },
      "seo_title seo_keywords seo_description blog_title blog_image blog_content"
    );
    res.json(existingBlog);
  } catch (error) {
    console.error("Error fetching single Blog data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Delete a category
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
