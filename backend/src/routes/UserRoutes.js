import express from "express"
import { deleteUser, forgetPasswordOtp, getUserList, loginUser, logoutUser, otpVerify, passwordUpdate, registerUser } from "../controller/User.controller.js";
import { betHistory, createBet } from "../controller/Bet.controller.js";




const router = express.Router();

//router for registering client
router.post("/api/user/register",registerUser)
//for login
router.post("/api/user/login",loginUser)
//api for getting list
router.get("/api/user/profileList",getUserList)
//sending otp on email
router.post("/api/user/forgetpassotp",forgetPasswordOtp)
//verification of otp
router.post("/api/user/verifyOtp",otpVerify)
//api for logging out client
router.post("/api/user/userLogout",logoutUser)
//api for deleting client
router.delete("/api/user/deleteUser/:_id",deleteUser)
//api for updating password
router.put("/api/user/passwordupdate",passwordUpdate)



//<!----------------Bet routing--------------!>
router.post("/api/user/createBet/:userId",createBet)
//api to gert betHistory based on gameType
router.get("/api/user/betHistory/:gameType",betHistory)


export default router