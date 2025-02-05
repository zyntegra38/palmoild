import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCountries,
  createCountry,
  deleteCountry,
  updateCountry,
  getCountryCompanies,
} from '../controllers/countryController.js';

const router = express.Router();

// Routes for countries
router.route('/').get(getCountries).post(createCountry);
router.route('/:id').delete(deleteCountry);
router.route('/:id').put(updateCountry);
router.get('/:countryName', getCountryCompanies);

export default router;
