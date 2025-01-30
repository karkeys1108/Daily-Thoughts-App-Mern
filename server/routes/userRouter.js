const express = require("express");
const router = express.Router();
const { signup,login,getUser,logOut,isloggedin,createDiary,updateDiary,getDiary,deleteDiary,sentOtp,resetPassword} = require("../controller/userController");
const {auth}=require("../auth/userAuth")
router.post("/signup",signup);
router.post("/login",login);
router.get("/getuser",auth,getUser)
router.delete("/logout",logOut)
router.get("/isloggedin",isloggedin)
router.post("/creatediary",auth,createDiary)
router.put("/updatediary",auth,updateDiary)
router.post("/sendotp",sentOtp)
router.post("/resetpassword",resetPassword)
router.get("/getdiary",auth,getDiary)
router.delete("/deletediary",auth,deleteDiary)
module.exports = router;
