import mongoose from "mongoose";

const featuredCompanySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: String,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  category_id_multi:  {
    type: String,
    default: null,
  },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  logo: String,
  website: String,
  mobile: String,
  profile: String,
  title: String,
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  address: String,
  description: String,
  email: String,
  status: String,
  date_added: { type: Date, default: Date.now },
  facebook_url: String,
  twitter_url: String,
  rating:  {
    type: String,
    default: 5,
  },
  linkedin_url: String,
  insta_url: String,
  brochure_url: String,
  company_slug:String,
});

const FeaturedCompany = mongoose.model('FeaturedCompany', featuredCompanySchema);

export default FeaturedCompany;
