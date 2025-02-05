import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  name: String,
});

const Site = mongoose.model('Site', siteSchema);

export default Site;
