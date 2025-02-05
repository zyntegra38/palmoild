import nodemailer from 'nodemailer';
import User from "../models/userModel.js";
import Mails from '../models/mails.js';
import EmailTemplate from "../models/templates.js";
import asyncHandler from "express-async-handler";
import moment from 'moment';

// Email credentials from environment variables
const contact_email_user = process.env.contact_email_user;
const contact_email_pass = process.env.contact_email_pass;
const contact_to_email = process.env.contact_to_email;

// Set up the transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: contact_email_user,
        pass: contact_email_pass,
    },
    debug: true,
});

// reminderController.js
const sendReminder = async () => {
  try {
    const getDayStartAndEnd = (days) => {
      const startOfDay = moment().subtract(days, 'days').startOf('day').toDate();
      const endOfDay = moment().subtract(days, 'days').endOf('day').toDate();
      return { startOfDay, endOfDay };
    };
    // Get the start and end for 2, 5, and 7 days ago
    const { startOfDay: startDate2DaysAgo, endOfDay: endDate2DaysAgo } = getDayStartAndEnd(3);
    const { startOfDay: startDate5DaysAgo, endOfDay: endDate5DaysAgo } = getDayStartAndEnd(6);
    const { startOfDay: startDate7DaysAgo, endOfDay: endDate7DaysAgo } = getDayStartAndEnd(8);

    console.log('Dates calculated:', {
      startDate2DaysAgo,
      endDate2DaysAgo,
      startDate5DaysAgo,
      endDate5DaysAgo,
      startDate7DaysAgo,
      endDate7DaysAgo,
    });

    // Find users created exactly on 2, 5, or 7 days ago
    const inactiveUsers = await User.find({
      status: 0,
      role: 0,
      $or: [
        { createdAt: { $gte: startDate2DaysAgo, $lte: endDate2DaysAgo } },
        { createdAt: { $gte: startDate5DaysAgo, $lte: endDate5DaysAgo } },
        { createdAt: { $gte: startDate7DaysAgo, $lte: endDate7DaysAgo } }
      ]
    });

    console.log('Inactive users found:', inactiveUsers);

    // Fetch the email template for reminder from the database
    const emailTemplate = await EmailTemplate.findOne({ name: "premiumReminder" });

    if (!emailTemplate) {
      console.error('Email template not found');
      return; // Exit if template is missing
    }

    console.log('Email template fetched:', emailTemplate);

    // Use Promise.all to send emails concurrently
    const emailPromises = inactiveUsers.map(async (user) => {
      const content = emailTemplate.template
        .replace("{{name}}", user.name)
        .replace("{{price}}", "$74.95/year")
        .replace("{{discountedPrice}}", "$74.95/year")
        .replace("{{premiumLink}}", "https://www.palmoildirectory.com/subscribe");

      console.log('Email content prepared for user:', user.email);

      const mailOptions = {
        from: contact_email_user,
        to: user.email,
        subject: emailTemplate.subject || 'Unlock Premium Features – Try Palm Oil Directory Premium Today!',
        html: content,
      };

      // Save email sending information in the Mails collection
      await Mails.create({
        name: user.name,
        email: user.email,
        subject: emailTemplate.subject || 'Unlock Premium Features – Try Palm Oil Directory Premium Today!',
        status: 1
      });

      console.log('Mail record created for user:', user.email);

      // Send the email
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent to:', user.email, 'Response:', info.response);
      } catch (error) {
        console.error('Error sending email to:', user.email, 'Error:', error);
      }
    });

    // Wait for all email sending to finish concurrently
    await Promise.all(emailPromises);

    console.log('All reminder emails sent successfully');
  } catch (error) {
    console.error('Error in sendReminder:', error);
  }
};

// Controller to manually trigger the reminder
const sendReminderMessage = asyncHandler(async (req, res) => {
  try {
    await sendReminder(); // Call without req/res
    res.status(200).send('Reminder sent!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error sending reminder');
  }
});

export { sendReminderMessage, sendReminder };