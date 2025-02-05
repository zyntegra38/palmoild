import express from 'express';
import { sendReminderMessage } from '../controllers/reminderController.js';

const router = express.Router();

router.get('/send-reminder', sendReminderMessage);

export default router;
