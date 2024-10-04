import express from "express";
import { sendEmail } from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { email, itemCode, qnt, date } = req.body;

  try {
    const message = await sendEmail(email, itemCode, qnt, date);

    res.status(200).send(message);
  } catch (error) {
    console.error("Error sending email:", error);

    res.status(500).send(error.message);
  }
});

export default router;
