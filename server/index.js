import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import passport from "./utils/passport.js";
import FavoriteRoutes from './routes/favoriteRoutes.js';
import StaffRoutes from './routes/staffRoutes.js';
import CmsRoutes from './routes/cmsRoutes.js';
import BlogRoutes from './routes/blogRoutes.js';
import MailerRoutes from './routes/mailerRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import sitemapRoutes from './routes/sitemapRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js'
import pdfRoutes from "./routes/pdfRoutes.js";
import featuredcompanyRoutes from './routes/featuredcompanyRoutes.js';
import Razorpay from 'razorpay';
import cron from 'node-cron';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors());
passport(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const dirname = path.resolve();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Use environment variables
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order endpoint
app.post('/create-order', async (req, res) => {
    const options = {
      amount: 7495, // Amount in paise
      currency: 'USD',
    };
  
    try {
      const response = await razorpay.orders.create(options);
      res.json(response);
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ error: error.message });
    }
});


// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/featuredcompanies', featuredcompanyRoutes);
app.use('/api/favorites', FavoriteRoutes);
app.use('/api/staff', StaffRoutes);
app.use("/auth", authRoutes);
app.use("/api/cmsdata", CmsRoutes);
app.use("/api/blogdata", BlogRoutes);
app.use("/api/mailer", MailerRoutes);
app.use("/sitemap", sitemapRoutes);
app.use('/api/reminder', reminderRoutes);
app.use("/api/report", pdfRoutes);

app.use(notFound);
app.use(errorHandler);

import { sendReminder } from './controllers/reminderController.js';

// cron.schedule('* * * * *', () => {
//   console.log('Sending reminder every minute...');
//   sendReminder();
// });

app.listen(port, () => console.log(`Server started on port ${port}`));
