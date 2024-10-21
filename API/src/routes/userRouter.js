import express, { Router } from "express";
import { addUser } from "../modals/userModal.js";
import { hashPassword } from "../utils/bcrypt.js";

export const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    req.body.password = await hashPassword(password);
    const response = await addUser(req.body);

    response?._id
      ? res.json({
          status: "success",
          message: "registration successful",
        })
      : res.json({
          status: "error",
          message: "registraiton failed",
        });
  } catch (error) {
    res.json({
      status: "error",
      message: "cannot register the user",
    });
  }
});
