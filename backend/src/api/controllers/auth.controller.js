import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import genAuthToken from "../../utils/genAuthToken.js";
import { emailOrUsername } from "../../utils/helpers.js";

const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userNameExists = await User.findOne({
        username: req.body.username,
      });
      if (userNameExists) {
        return res
          .status(400)
          .json({ message: "Username already exists", success: false });
      }

      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "User already exists", success: false });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        avatar: req.body.avatar,
        contact: req.body.contact,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
        created_date: new Date(),
        last_login: new Date(),
      });

      try {
        const savedUser = await user.save();
        savedUser.password = undefined;
        const token = genAuthToken(savedUser);

        res.status(201).json({ user: savedUser, token: token, success: true });
      } catch (error) {
        logger.error(error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } catch (error) {
      logger.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    const type = emailOrUsername(username);

    try {
      let user;
      if (type === "email") {
        user = await User.findOne({ email: username });
      } else {
        user = await User.findOne({ username: username });
      }

      if (!user) {
        return res
          .status(400)
          .json({ sucess: false, message: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid password" });
      }

      user.password = undefined;

      const token = genAuthToken(user);
      res.status(200).json({
        success: true,
        message: "Succesfully logged in",
        user: user,
        token: token,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async checkAuth(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password");

      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ sucess: false, message: "Unauthorized" });
      }

      const token = authorization.split(" ")[1];

      res.status(200).json({ success: true, user: user, token: token });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ sucess: false, message: "Internal server error" });
    }
  },
};

export default authController;
