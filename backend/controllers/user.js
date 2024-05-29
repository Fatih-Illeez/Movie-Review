const User = require("../models/user");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(401).json({ error: "This email already exists" });
  }
  const newUser = new User({ name, email, password });
  await newUser.save();

  // var transport = nodemailer.createTransport({
  //   host: "live.smtp.mailtrap.io",
  //   port: 587,
  //   auth: {
  //     user: "api",
  //     pass: "9e74388e24467a9d96dccb5d7464443a",
  //   },
  // });

  res.status(201).json({ user: newUser });
};
