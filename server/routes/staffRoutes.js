import express from 'express';
const router = express.Router();
import {
    getStaff
} from'../controllers/staffController.js';


router.get('/:id', getStaff);

export default router;