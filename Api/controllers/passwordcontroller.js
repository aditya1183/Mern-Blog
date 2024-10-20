import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

const transpoter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.gmail,
    pass: process.env.pass,
  },
});

export const forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(errorHandler(403, "Email is required"));
  }

  try {
    const userfind = await User.findOne({ email });
    if (!userfind) {
      return next(errorHandler(404, "User not found"));
    }

    // Generate a JWT token valid for 2 minutes
    const token = jwt.sign({ _id: userfind._id }, process.env.JWT_SECRET, {
      expiresIn: "120s",
    });

    // Update user with token
    const setusertoken = await User.findByIdAndUpdate(
      userfind._id,
      { verifytoken: token },
      { new: true }
    );

    if (setusertoken) {
      // Set up email options
      const mailOptions = {
        from: process.env.gmail,
        to: email,
        subject: "Password Reset Request",
        text: `This link is valid for 2 minutes: http://localhost:5173/password-reset/${userfind._id}/${setusertoken.verifytoken}`,
      };

      // Send the email
      transpoter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          res.status(500).json({ status: 500, message: "Email not sent" });
        } else {
          res
            .status(200)
            .json({ status: 200, message: "Email sent successfully" });
        }
      });
    }
  } catch (error) {
    console.error("Error during forgot password process:", error);
    res.status(500).json({ status: 500, message: "An error occurred" });
  }
};
export const verifyuser = async (req, res, next) => {
  const { id, token } = req.params;

  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "user not exit" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

export const resetpassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);
      const setnewuserpass = await User.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );
      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass });
    } else {
      res.status(401).json({ status: 401, message: "user not exit" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
