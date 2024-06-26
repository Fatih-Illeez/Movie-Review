const { check, validationResult } = require("express-validator");

exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 8 to 20 characters long"),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length > 0) {
    return res.json({ error: error[0].msg });
  }

  next();
};
