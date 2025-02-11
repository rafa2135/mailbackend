const { body } = require("express-validator");

const contactFormValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 1000 })
    .withMessage("Message is too long"),
];

module.exports = contactFormValidationRules;
