import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
  verifyPassword,
  changepassword,
  getsingleuser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);
router.post("/verifypassword/:userId", verifyToken, verifyPassword);
router.post("/changepassword/:userId", verifyToken, changepassword);
router.get("/getsingleuser/:userId", verifyToken ,  getsingleuser);

export default router;
