import express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";
import {forgotpassword , verifyuser , resetpassword} from "../controllers/passwordcontroller.js"



const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/forgot-password", forgotpassword);

router.get("/resetpassword/:id/:token" , verifyuser);
router.post("/:id/:token" , resetpassword);

export default router;
