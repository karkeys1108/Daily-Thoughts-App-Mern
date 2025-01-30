const { User, Diary } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email id",
      });
    }
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }
    //store in database
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });
    return res.status(200).json({
      success: true,
      message: "Sign up successfully! Please login now.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Error: err,
      message: "user can't created, try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if all the details are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    let user = await User.findOne({ email });
    //checking if user exist with  this email id or not
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not exist with this email id",
      });
    }
    //payload for token
    const payload = {
      email: user.email,
      id: user._id,
    };
    //verify password
    if (await bcrypt.compare(password, user.password)) {
      //create token
      let token = await jwt.sign(payload, process.env.SERCETCODE, {
        expiresIn: "2h",
      });
      user = user.toObject();
      user.password = undefined; //hidepassword
      //option for cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "None",
        secure: true,
      };
      return res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
      //send cookie
      // res.cookie("token", token, options).status(200).json({
      //   success: true,
      //   user,
      //   message: "User Logged in Successfully",
      // });
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login failure",
      Error: err,
    });
  }
};
exports.isloggedin = async (req, res) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    if (!token || token == undefined) {
      return res.json({
        success: false,
        message: "Token missing",
      });
    } else {
      return res.json({
        success: true,
        message: "Token found",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while verifying token",
    });
  }
};
exports.logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "user Details",
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Error: err,
      message: "can't find user details",
    });
  }
};

exports.createDiary = async (req, res) => {
  try {
    const { date, body } = req.body;
    const userId = req.user.id;
    const existingDiary = await Diary.findOne({ date });

    if (existingDiary) {
      return res.status(400).json({
        success: false,
        message: "You have already added a diary for this day.",
      });
    }
    const newDiary = new Diary({
      user: userId,
      date,
      body,
    });
    const savedDiary = await newDiary.save();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          diary: { diaryId: savedDiary._id, date: savedDiary.date },
        },
      },
      { new: true }
    )
      .populate("diary.diaryId")
      .exec();
    res.status(200).json({
      user: updatedUser,
      diary: savedDiary,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Error while creating diary",
    });
  }
};

exports.getDiary = async (req, res) => {
  try {
    const diaryId = req.query.diaryId;
    const userId = req.user.id;
    const diary = await Diary.findById(diaryId);
    if (!diary) {
      return res.status(404).json({
        success: false,
        message: "Diary not found",
      });
    }
    if (String(userId) !== String(diary.user)) {
      return res.status(401).json({
        success: false,
        message: "User does not have access to this diary",
      });
    }
    res.status(200).json(diary);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error while reading diary",
    });
  }
};

exports.deleteDiary = async (req, res) => {
  try {
    const diaryId = req.query.diaryId;
    const userId = req.user.id;
    const diary = await Diary.findById(diaryId);
    if (!diary) {
      return res.status(404).json({
        success: false,
        message: "Diary not found",
      });
    }
    if (String(userId) !== String(diary.user)) {
      return res.status(401).json({
        success: false,
        message: "User does not have access to this diary",
      });
    }
    const deletedDiary = await Diary.findByIdAndDelete(diaryId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          diary: { diaryId: deletedDiary._id, date: deletedDiary.date },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "diary deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error while deleting diary",
    });
  }
};

exports.updateDiary = async (req, res) => {
  try {
    const diaryId = req.params.diaryId;  // Get diaryId from URL params
    const userId = req.user.id;  // Get the userId from the request user object (authentication)
    
    // Find the diary by ID
    const diary = await Diary.findById(diaryId);
    if (!diary) {
      return res.status(404).json({
        success: false,
        message: "Diary not found",
      });
    }

    // Check if the user is authorized to update this diary
    if (String(userId) !== String(diary.user)) {
      return res.status(401).json({
        success: false,
        message: "User does not have access to this diary",
      });
    }

    // Update the diary body with the new content
    const updatedDiary = await Diary.findByIdAndUpdate(
      diaryId,  // The ID of the diary to update
      { body: req.body.updatedDiary },  // The updated body
      { new: true }  // Return the updated diary
    );

    // Send the updated diary back in the response
    res.status(200).json(updatedDiary);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error while updating diary",
    });
  }
};

//sendotp
exports.sentOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    //checking if user exist with  this email id or not
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not exist with this email id",
      });
    }
    const code = Math.floor(Math.random() * 999999 + 111111);
    const otp = {
      code,
      validTime: Date.now() + 15 * 60 * 1000,
    };
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { otp },
      { new: true }
    );
    req.userId = user._id;
    const message = `Your verification code is ${code}`;
    await sendEmail(email, "Verify OTP", message);
    return res.status(200).json({
      success: true,
      message: "Email sent",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error while sending  otp",
    });
  }
};

//change  password

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email });
    //checking if user exist with  this email id or not
    if (String(user.otp.code) !== String(code)) {
      return res.status(401).json({
        success: false,
        message: "otp don't match",
      });
    }
    if (Date.now() > user.otp.validTime) {
      return res.status(401).json({
        success: false,
        message: "otp Time Exceed",
      });
    }
    // const code = Math.floor(Math.random() * 999999 + 111111);
    const otp = {};
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { otp, password: hashPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "password  reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error while changing  password",
    });
  }
};
