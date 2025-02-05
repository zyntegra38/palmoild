import express from "express";
import passport from "passport";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Mails from '../models/mails.js';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//register or login user to DB
router.get("/login/success", async (req, res) => {
  try {
    if (req.user) {
      let credentials;
      const userExists = await User.findOne({ email: req.user._json.email });
      if (userExists) {
        if(userExists.provider){
          credentials = {
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
            status: userExists.status,
          };
          res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);
        }else{
          res.redirect(`${process.env.CLIENT_URL}?profile=&&message='User already exist'`);
        }        
      } else {
        const newUser = new User({
          name: req.user._json.name,
          email: req.user._json.email,
          provider: req.user.provider,
          password: Date.now(), // Dummy password
        });
        await newUser.save();
        credentials = {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        };
        const email_user=newUser.name;
        const email_email=newUser.email;

        const mails = await Mails.create({
          name:newUser.name,
          email:newUser.email,
          subject:'Welcome Mail',
          status:1
        });

        const contact_email_user = process.env.contact_email_user;
        const contact_email_pass = process.env.contact_email_pass;
      
        const transporter = nodemailer.createTransport({
          host: 'mail.palmoildirectory.com',
          port: 465,  
          secure: true,
          auth: {
            user: contact_email_user,
            pass: contact_email_pass
          }
        });

        const mailOptions = {
          from: `"Palmoildirectory" <${contact_email_user}>`,
          to: email_email, 
          subject: 'Welcome to Palmoildirectory.com',
          html: `<body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #F8F8F8;color: #333;">
                <div class="email-container" style="max-width: 600px;margin: 20px auto;background-color: #FFFBF2;  padding: 20px;border: 1px solid #ddd;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <div class="header" style="text-align: center;margin-bottom: 20px;">
                    <img src="https://palmoild-thbn.vercel.app/uploads/blog_image-1733223918881-107204872.png" alt="Palm Oil Directory Logo" style="max-width: 150px;">
                    </div>
                    <p style="font-size: 14px;line-height: 1.6;">Hello ${email_user},</p>
                    <p style="font-size: 14px;line-height: 1.6;">Thank you very much for choosing Palm Oil Directory.</p>
                    <p style="font-size: 14px;line-height: 1.6;">Take your business connections to the next level with Palm Oil Directory .</p>
                    <div class="premium-details" style="border: 1px solid #ddd;padding: 15px;margin: 20px 0;background-color: #F9F9F9;">
                    <h3>Please find below your login details:</h3>
                    <strong>Email:</strong> ${email_email}
                    <h3>Premium Features:</h3>
                    <p>Price: <span class="price" style="font-size: 16px;font-weight: bold;color: #27AE60;">$74.95/year</span> (Normally $100/year – Save $26.05!)</p>
                    <ul style=" padding-left: 20px;">
                        <li style="list-style: none;
                    margin: 5px 0;">✓ Full access to the platform with all features unlocked.</li>
                        <li style="list-style: none; margin: 5px 0;">✓ View details of all 7000+ companies, including comprehensive contact details.</li>
                        <li style="list-style: none; margin: 5px 0;">✓ Direct contact enabled with companies.</li>
                        <li style="list-style: none; margin: 5px 0;">✓ Access to 80+ categories for browsing.</li>
                    </ul>
                    <a href="https://www.palmoildirectory.com/subscribe" class="cta-button" style="display: inline-block;padding: 10px 20px;background-color: #27AE60;color: #fff;text-decoration: none;border-radius: 5px;margin-top: 10px;">Start Your Premium Access</a>
                    <p>If you have any questions or need support, feel free to email us at <a href="mailto:info@palmoildirectory.com">info@palmoildirectory.com</a>.</p>
                    </div>
                    <p>Best regards,</p>
                    <p>Palm Oil Directory Team</p>
                    <div class="footer-banner" style="background-color: #000;color: #fff;text-align: center;padding: 10px 0;margin-top: 20px;">
                    <h3 style=" margin: 0;font-size: 18px;font-weight: bold;letter-spacing: 2px;"><a href="https://www.palmoildirectory.com/" style="text-decoration: none;color: white;">W W W . P A L M O I L D I R E C T O R Y . C O M</a></h3>
                    </div>
                </div>
            </body>`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(200).json({ message: 'Error' });
          } else {
            res.status(200).json({ message: 'Success' });
          }
        });
        res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);      }      
    } else {
      res.status(403).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


router.get("/login-fb/success", async (req, res) => {
  try {
    if (req.user) {
      let credentials;
      const userExists = await User.findOne({ fbaccountId: req.user._json.id, provider: 'facebook'});
      if (userExists) {
        if(userExists.provider){
          credentials = {
            _id: userExists._id,
            name: userExists.name,
            role: userExists.role,
            status: userExists.status,
          };
          res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);
        }else{
          res.redirect(`${process.env.CLIENT_URL}?profile=&&message='User already exist'`);
        }        
      } else {
        const newUser = new User({
          name: req.user._json.displayName,
          provider: 'facebook',
          password: Date.now(), // Dummy password
        });
        await newUser.save();
        credentials = {
          _id: newUser._id,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
        };
        res.redirect(`${process.env.CLIENT_URL}/?profile=${encodeURIComponent(JSON.stringify(credentials))}`);      }      
    } else {
      res.status(403).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/login-link/success", async (req, res) => {
  try {
    if (req.user) {
      let credentials;
      const userExists = await User.findOne({ fbaccountId: req.user._json.id, provider: 'facebook'});
      if (userExists) {
        if(userExists.provider){
          credentials = {
            _id: userExists._id,
            name: userExists.name,
            role: userExists.role,
            status: userExists.status,
          };
          res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);
        }else{
          res.redirect(`${process.env.CLIENT_URL}?profile=&&message='User already exist'`);
        }        
      } else {
        const newUser = new User({
          name: req.user._json.displayName,
          provider: 'facebook',
          password: Date.now(), // Dummy password
        });
        await newUser.save();
        credentials = {
          _id: newUser._id,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
        };
        res.redirect(`${process.env.CLIENT_URL}/?profile=${encodeURIComponent(JSON.stringify(credentials))}`);      }      
    } else {
      res.status(403).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//authenticate the user using google

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/success", 
    failureRedirect: "/auth/login/failed", 
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/login-fb/success",
    failureRedirect: "/auth/login/failed",
  })
);


router.get("/linkedin",passport.authenticate("linkedin", {scope: ["r_basicprofile", "r_emailaddress"]}));
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/auth/login-link/success",
    failureRedirect: "/auth/login/success",
  })
);

//login failed
router.get("/login/failed", (req, res) => {
  res.status(401);
  throw new Error("Login Failed");
});

//logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/s");
  });
});

export default router;
