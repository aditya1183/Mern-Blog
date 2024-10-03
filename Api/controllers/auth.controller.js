import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if email or username already exists
  const existingUser = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });

  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use." });
  }

  if (existingUsername) {
    return res.status(400).json({ message: "Username is already taken." });
  }

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Signup successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// export const signup = async (req, res, next) => {
//   const { username, email, password } = req.body;

//   // Check if any required field is missing
//   if (!username || !email || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   // Check if email or username already exists

//   if (existingUser) {
//     return res.status(400).json({ message: "Email is already in use." });
//   }

//   if (existingUsername) {
//     return res.status(400).json({ message: "Username is already taken." });
//   }

//   const hashedPassword = bcryptjs.hashSync(password, 10);

//   const newUser = new User({
//     username,
//     email,
//     password: hashedPassword,
//   });

//   try {
//     await newUser.save();
//     res.status(201).json({ message: "Signup successful" });
//   } catch (error) {
//     if (error.code === 11000) {
//       // Handle duplicate key error (unique constraint violation)
//       const duplicateField = Object.keys(error.keyValue)[0];
//       const errorMessage =
//         duplicateField === "email"
//           ? "Email is already in use."
//           : "Username is already taken.";
//       return res.status(400).json({ message: errorMessage });
//     }

//     return res
//       .status(500)
//       .json({ message: "Server error. Please try again later." });
//   }
// };

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
