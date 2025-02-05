import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getSites,
  createSite,
  deleteSite,
  updateSite,
} from '../controllers/siteController.js';

const router = express.Router();

// Routes for sites
router.route('/').get(getSites).post(createSite);
router.route('/:id').delete(deleteSite);
router.route('/:id').put(updateSite);

export default router;
