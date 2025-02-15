import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import Unsubscribed from "../models/mailunsubscribed.js";
import Mails from "../models/mails.js";
import EmailTemplate from "../models/templates.js";

// Fetch all email templates
export const getEmailTemplates = asyncHandler(async (req, res) => {
  try {
    const templates = await EmailTemplate.find({});
    res.status(200).json(templates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching templates", error: error.message });
  }
});

// create a new email template
export const createEmailTemplate = asyncHandler(async (req, res) => {
  const { name, subject, template } = req.body;

  try {
    // Check if template with same name already exists
    const existingTemplate = await EmailTemplate.findOne({ name });
    if (existingTemplate) {
      return res.status(400).json({
        message: "Template with this name already exists",
      });
    }

    // Create new template
    const newTemplate = await EmailTemplate.create({
      name,
      subject,
      template,
    });

    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({
      message: "Error creating template",
      error: error.message,
    });
  }
});

// Update a specific email template
export const updateEmailTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, subject, template } = req.body;

  try {
    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      { name, subject, template },
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(updatedTemplate);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating template", error: error.message });
  }
});

export const sendContactMail = asyncHandler(async (req, res) => {
  const contact_email_user = process.env.contact_email_user;
  const contact_email_pass = process.env.contact_email_pass;
  const contact_to_email = process.env.contact_to_email;

  const { name, email, subject, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "mail.palmoildirectory.com",
    port: 465,
    secure: true,
    auth: {
      user: contact_email_user,
      pass: contact_email_pass,
    },
  });
  const mails = await Mails.create({
    name,
    email,
    subject: "Contact Mail",
    status: 1,
  });
  const mailOptions = {
    from: `"Palmoildirectory" <${contact_email_user}>`,
    to: contact_to_email,
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: "Error sending email" });
    } else {
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

export const sendResetMail = asyncHandler(async (req, res) => {
  const { email, name, resetPasswordToken } = req.body;

  if (!email || !resetPasswordToken) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const template = await EmailTemplate.findOne({ name: "resetMail" });

  if (!template) {
    return res.status(404).json({ error: "Reset mail template not found" });
  }

  try {
    const contact_email_user = process.env.contact_email_user;
    const contact_email_pass = process.env.contact_email_pass;

    // Add URL prefix to the resetPasswordToken
    const resetUrl = `https://www.palmoildirectory.com/user/newpassword/${resetPasswordToken}`;

    const content = template.template
      .replace("{{name}}", name || "User")
      .replace("{{resetPasswordToken}}", resetUrl); // Use the full URL here

    const transporter = nodemailer.createTransport({
      host: "mail.palmoildirectory.com",
      port: 465,
      secure: true,
      auth: {
        user: contact_email_user,
        pass: contact_email_pass,
      },
    });

    await Mails.create({
      name,
      email,
      subject: "Password Reset",
      status: 1,
    });
    const unsubscribeLink = `<p>If you no longer wish to receive emails from us, you can <a href="https://www.palmoildirectory.com/unsubscribe/${email}">unsubscribe here</a>.</p>`;
    const contentWithUnsubscribe = content + unsubscribeLink;
    const mailOptions = {
      from: `"Palmoildirectory" <${contact_email_user}>`,
      to: email,
      subject: template.subject || "Password Reset",
      html: contentWithUnsubscribe,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Email sending error:", error);
    res
      .status(500)
      .json({ error: "Error sending email", details: error.message });
  }
});

export const sendwelcomeMail = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const template = await EmailTemplate.findOne({ name: "welcomeMail" });

  if (!template) {
    return res.status(404).json({ error: "Welcome mail template not found" });
  }

  const contact_email_user = process.env.contact_email_user;
  const contact_email_pass = process.env.contact_email_pass;

  const content = template.template
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{password}}", password);

  const transporter = nodemailer.createTransport({
    host: "mail.palmoildirectory.com",
    port: 465,
    secure: true,
    auth: {
      user: contact_email_user,
      pass: contact_email_pass,
    },
  });
  await Mails.create({
    name,
    email,
    subject: "Welcome mail",
    status: 1,
  });
  const unsubscribeLink = `<p>If you no longer wish to receive emails from us, you can <a href="https://www.palmoildirectory.com/unsubscribe/${email}">unsubscribe here</a>.</p>`;
  const contentWithUnsubscribe = content + unsubscribeLink;
  const mailOptions = {
    from: `"Palmoildirectory" <${contact_email_user}>`,
    to: email,
    subject: template.subject,
    html: contentWithUnsubscribe,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: "Error sending email" });
    } else {
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

export const sendPaymentMail = asyncHandler(async (req, res) => {
  const { name, email, date, expiry_date, amount_paid, transaction_id } =
    req.body;
  const template = await EmailTemplate.findOne({ name: "paymentMail" });

  if (!template) {
    return res.status(404).json({ error: "Payment mail template not found" });
  }

  const contact_email_user = process.env.contact_email_user;
  const contact_email_pass = process.env.contact_email_pass;

  const content = template.template
    .replace("{{name}}", name)
    .replace("{{date}}", date)
    .replace("{{expiry_date}}", expiry_date)
    .replace("{{amount_paid}}", amount_paid)
    .replace("{{transaction_id}}", transaction_id);

  await Mails.create({
    name,
    email,
    subject: "Payment mail",
    status: 1,
  });

  const transporter = nodemailer.createTransport({
    host: "mail.palmoildirectory.com",
    port: 465,
    secure: true,
    auth: {
      user: contact_email_user,
      pass: contact_email_pass,
    },
  });
  const unsubscribeLink = `<p>If you no longer wish to receive emails from us, you can <a href="https://www.palmoildirectory.com/unsubscribe/${email}">unsubscribe here</a>.</p>`;
  const contentWithUnsubscribe = content + unsubscribeLink;
  const mailOptions = {
    from: `"Palmoildirectory" <${contact_email_user}>`,
    to: email,
    subject: template.subject,
    html: contentWithUnsubscribe,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: "Error sending email" });
    } else {
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

export const sendCustomMail = asyncHandler(async (req, res) => {
  const contact_email_user = process.env.contact_email_user;
  const contact_email_pass = process.env.contact_email_pass;
  const contact_to_email = process.env.contact_to_email;

  const { email, subject, message } = req.body;
  const mails = await Mails.create({
    name: "",
    email,
    subject,
    status: 1,
  });
  const transporter = nodemailer.createTransport({
    host: "mail.palmoildirectory.com",
    port: 465,
    secure: true,
    auth: {
      user: contact_email_user,
      pass: contact_email_pass,
    },
  });

  const unsubscribeLink = `<p>If you no longer wish to receive emails from us, you can <a href="https://www.palmoildirectory.com/unsubscribe/${email}">unsubscribe here</a>.</p>`;

  const updatedMessage = `${message}<br><br>${unsubscribeLink}`;

  const mailOptions = {
    from: `"Palmoildirectory" <${contact_email_user}>`,
    to: email,
    subject: subject,
    html: updatedMessage,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({ error: "Error sending email" });
    } else {
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

export const unsubscribeMail = asyncHandler(async (req, res) => {
  const email = req.params.email;
  const unsubscribed = await Unsubscribed.create({
    email,
  });

  if (unsubscribed) {
    res.status(201).json(unsubscribed);
  } else {
    res.status(400);
    throw new Error("Invalid");
  }
});

export const sendMultiCustomMail = asyncHandler(async (req, res) => {
  const contact_email_user = process.env.contact_email_user;
  const contact_email_pass = process.env.contact_email_pass;
  const { emails, names, companies, templateId } = req.body;
  const emailList = emails.split(",");
  const nameList = names.split(",");
  const companyList = companies.split(",");

  if (
    emailList.length !== nameList.length ||
    emailList.length !== companyList.length
  ) {
    return res
      .status(400)
      .json({ error: "The number of emails, names, and companies must match" });
  }

  // Fetch the selected template from the database using templateId
  const template = await EmailTemplate.findById(templateId);

  if (!template) {
    return res.status(404).json({ error: "Selected template not found" });
  }

  const transporter = nodemailer.createTransport({
    host: "mail.palmoildirectory.com",
    port: 465,
    secure: true,
    auth: {
      user: contact_email_user,
      pass: contact_email_pass,
    },
  });

  for (let i = 0; i < emailList.length; i++) {
    const email = emailList[i].trim();
    const name = nameList[i].trim();
    const company = companyList[i].trim();

    try {
      const content = template.template
          .replace(/{{name}}/g, name)
          .replace(/{{company}}/g, company); 

      const unsubscribeLink = `<p>If you no longer wish to receive emails from us, you can <a href="https://www.palmoildirectory.com/unsubscribe/${email}">unsubscribe here</a>.</p>`;
      const contentWithUnsubscribe = content + unsubscribeLink;

      const mailOptions = {
        from: `"Palmoildirectory" <${contact_email_user}>`,
        to: email,
        subject: template.subject,
        html: contentWithUnsubscribe,
      };

      await transporter.sendMail(mailOptions);
      await Mails.create({
        name,
        email,
        subject: template.subject,
        status: 1,
      });
    } catch (error) {
      await Mails.create({
        name,
        email,
        subject: template.subject,
        status: 0,
      });
      continue;
    }
  }
  return res.status(200).json({
    message:
      "Emails sent successfully, with some errors logged for specific email addresses.",
  });
});

export const getEmailHistory = async (req, res) => {
  try {
    const mails = await Mails.find({}).sort({ createdAt: -1 });
    res.json(mails);
  } catch (error) {
    console.error("Error fetching mails data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
