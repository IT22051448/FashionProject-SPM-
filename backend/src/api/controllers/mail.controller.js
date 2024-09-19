import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mailgen from "mailgen";

dotenv.config();

export const sendEmail = async (email, itemCode, qnt, date) => {
  // Configure the transporter
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
      name: "Fashion retail Store",
      link: " ",
    },
  });

  const emailContent = {
    body: {
      intro:
        "We would like to inform you that we need to order a stock for the following item.",
      table: {
        data: [
          { key: "Item Code", value: itemCode },
          { key: "Quantity", value: qnt },
          { key: "Required Date", value: date },
        ],
      },
      outro:
        "Thank you for your prompt attention to this matter. We appreciate your continued partnership with us.",
    },
  };

  const emailBody = mailGenerator.generate(emailContent);

  const mailOptions = {
    from: process.env.Email,
    to: email,
    subject: "New Stock order",
    html: emailBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return {
      status: "success",
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
