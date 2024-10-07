// controllers/referralController.js

const Referral = require("../models/referral");
const Loyalty = require("../models/loyalty");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  //port: 587 ,
  //secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});

// verify connection configuration

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

// Create a new referral
exports.createReferral = async (req, res) => {
  try {
    const { referrerEmail, referredEmail } = req.body;

    // Generate a unique referral token
    const referralToken = crypto.randomBytes(20).toString("hex");

    // Save the referral with the token
    const newReferral = new Referral({
      referrerEmail,
      referredEmail,
      token: referralToken,
    });
    await newReferral.save();
    console.log("Referral saved successfully.");

    // Send email with referral link
    const referralLink = `http://localhost:5173/auth/signup?referralToken=${referralToken}`;

    const mailOptions = {
      to: referredEmail,
      subject: `You’ve been referred to join our loyalty program!`,
      text: `Hello,
  
        You have been referred by ${referrerEmail} to become a member of the Fashion House. 
  
        Please sign up using the following link to enjoy the benefits:
        ${referralLink}
  
        Best regards,
        Manilka Fernando
        Fashion House`,
    };

    console.log("Sending referral email with options:", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Referral email sent successfully.");

    res
      .status(201)
      .json({ message: "Referral created and email sent successfully!" });
  } catch (err) {
    console.error("Error creating referral:", err);
    res.status(400).json({ error: err.message });
  }
};
