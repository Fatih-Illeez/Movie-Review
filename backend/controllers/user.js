const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const nodemailer = require("nodemailer");
const { isValidObjectId } = require("mongoose");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(401).json({ error: "This email already exists" });
  }
  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit otp
  let OTP = "";
  for (let i = 0; i < 5; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  // store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  //send that otp to our user

  await newEmailVerificationToken.save();

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b5b903729887b8",
      pass: "ab77261f625edd",
    },
  });

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
      <h1>Your verification OTP</h1>
      <p>Hi ${newUser.name},</p>
      <p>Thank you for registering. Please use the following OTP to verify your email.</p>
      <h2>${OTP}</h2>`,
  });

  res.status(201).json({ message: "User created successfully" });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (isValidObjectId(userId)) return res.json({ error: "Invalid user" });

  const user = await User.findById(userId);
  if (!user) return res.json({ error: "User not found" });
  if (user.isVerified) return res.json({ error: "user is already verified" });

  const token = await EmailVerificationToken.findOne({ owner: user._id });
  if (!token) return res.json({ error: "token not found" });
};
