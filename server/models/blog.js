import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  blog_title: String,
  blog_url: String,
  blog_image: String,
  blog_content: String,
  seo_title: String,
  seo_description: String,
  seo_keywords: String,
  status: String
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
