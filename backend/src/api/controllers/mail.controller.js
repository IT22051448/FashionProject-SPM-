import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mailgen from "mailgen";
import crypto from "crypto";
import { addSupplierToken } from "../controllers/supplierToken.controller";

dotenv.config();

export const sendEmail = async (email, itemId, qnt, date) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.Email,
      pass: process.env.appPass,
    },
  });

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Fashion Retail Store",
      link: " ",
    },
  });

  const generateToken = async () => {
    return crypto.randomBytes(6).toString("base64url");
  };

  const token = await generateToken();

  // The link for order confirmation
  const confirmationLink = `http://localhost:5173/supplier-order/${token}`;

  // Email content
  const emailContent = {
    body: {
      intro:
        "We would like to inform you that we need to order stock for the following item.",
      table: {
        data: [
          { key: "Item Code", value: itemId },
          { key: "Quantity", value: qnt },
          { key: "Required Date", value: date },
          {
            key: "Confirm your suply via this link",
            value: `(${confirmationLink})`,
          },
        ],
      },
      outro: `
        Thank you for your prompt attention to this matter. We appreciate your continued partnership with us.`,
    },
  };

  const emailBody = mailGenerator.generate(emailContent);

  const mailOptions = {
    from: process.env.Email,
    to: email,
    subject: "New Stock Order",
    html: emailBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    const supplierTokenData = {
      token,
      itemId,
      quantity: qnt,
      date,
    };

    await addSupplierToken(supplierTokenData);

    return {
      status: "success",
      message: "Email sent successfully and token saved",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
