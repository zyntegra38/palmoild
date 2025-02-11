import express from 'express';
import Multer from 'multer';
import cloudinary from 'cloudinary';

import { 
  createCompany, 
  getCompanies, 
  updateCompany,
  deleteCompany,
  getCompanyDetails,
  getSingleCompanyDetails,
  getSingleCompanies,
  searchCompanies,
  getFeaturedCompanies,
  getRelatedCompanies, 
  getCompanyList,
  getNormalUserCompanies,
  } from '../controllers/featuredcompanyController.js';

const router = express.Router();

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

// Routes for companies
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    let logo = '';
    if (req.file.buffer) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      logo = cldRes.secure_url;
    }
    const {
        user_id,
        company,
        category_id,
        country_id,
        website,
        mobile,
        email,
        profile,
        title,
        site_id,
        address,
        description,
        status,
        facebook_url,
        twitter_url,
        linkedin_url,
        insta_url,
        brochure_url,
        staff
    } = req.body;

    const companyData = {
        user_id,
        company,
        category_id,
        country_id,
        website,
        mobile,
        email,
        profile,
        title,
        site_id,
        address,
        description,
        status,
        facebook_url,
        twitter_url,
        linkedin_url,
        insta_url,
        brochure_url,
        staff,
        logo 
    };

    await createCompany(companyData, res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/', getCompanies);
router.get('/normaluser', getNormalUserCompanies);
router.get('/list', getCompanyList);
router.get('/featuredlist', getFeaturedCompanies);
router.get('/single/:companyId', getSingleCompanies);
router.get('/search', searchCompanies);
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const companyId = req.params.id;
    let {
        user_id,
        company,
        category_id,
        country_id,
        website,
        mobile,
        email,
        profile,
        title,
        site_id,
        address,
        description,
        status,
        facebook_url,
        twitter_url,
        linkedin_url,
        insta_url,
        brochure_url,
        staff,
        logo 
    } = req.body;
    
    if (req.file && req.file.buffer) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      
      logo = cldRes.secure_url;
    }

    const companyData = {
        user_id,
        company,
        category_id,
        country_id,
        website,
        mobile,
        email,
        profile,
        title,
        site_id,
        address,
        description,
        status,
        facebook_url,
        twitter_url,
        linkedin_url,
        insta_url,
        brochure_url,
        staff,
        logo // This will now hold the potentially updated logo URL
    };

    // Call your updateCompany function to update the company data
    await updateCompany(companyId, companyData, res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id', deleteCompany);
router.get('/:companyName', getCompanyDetails);
router.get('/category/:catID/:companyId', getRelatedCompanies);
router.get('/user/:userID', getSingleCompanyDetails);


export default router;
