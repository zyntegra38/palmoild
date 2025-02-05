import { sendReminder } from '../controllers/reminderController.js';

export default function handler(req, res) {
    sendReminder();
    console.log("Cron job is running...");
  
    // Example logic: cleanup, sending emails, etc.
    // You could interact with a database, update some data, etc.
  
    res.status(200).json({ message: "Cron job executed!" });
  }
  