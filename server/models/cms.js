import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema({
  cms_title: String,
  cms_key: String,
  cms_content: String,
  seo_title: String,
  seo_description: String,
  seo_keywords: String,
  status: String
});

const CMS = mongoose.model('CMS', cmsSchema);

export default CMS;
