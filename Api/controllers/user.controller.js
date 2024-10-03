import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const verifyPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Compare the provided password with the stored hashed password
    const isMatch = bcryptjs.compareSync(req.body.password, user.password);

    if (!isMatch) {
      return next(errorHandler(400, "Incorrect password"));
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const changepassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const hashedPassword = bcryptjs.hashSync(req.body.newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  // if (req.body.password) {
  //   if (req.body.password.length < 6) {
  //     return next(errorHandler(400, "Password must be at least 6 characters"));
  //   }
  //   req.body.password = bcryptjs.hashSync(req.body.password, 10);
  // }
  // if (req.body.username) {
  //   if (req.body.username.length < 7 || req.body.username.length > 20) {
  //     return next(
  //       errorHandler(400, "Username must be between 7 and 20 characters")
  //     );
  //   }
  //   if (req.body.username.includes(" ")) {
  //     return next(errorHandler(400, "Username cannot contain spaces"));
  //   }
  //   if (req.body.username !== req.body.username.toLowerCase()) {
  //     return next(errorHandler(400, "Username must be lowercase"));
  //   }
  //   if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
  //     return next(
  //       errorHandler(400, "Username can only contain letters and numbers")
  //     );
  //   }
  // }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone,
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getsingleuser = (req, res, next) => {
  const userid = req.params.userId;

  // Assuming you have a User model or a way to retrieve a user by ID
  User.findById(userid)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User  not found" });
      }
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};
