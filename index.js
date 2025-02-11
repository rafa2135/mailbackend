require("dotenv").config();
const cors = require("cors"); // Import the cors middleware
const createTransporter = require("./config/nodemailer"); // Import the createTransporter function
const createMailOptions = require("./utils/emailOptions"); // Import the createMailOptions function
const bodyParser = require("body-parser"); // Import the body-parser middleware
const express = require("express");
const validarEnv = require("./config/env");
const { validationResult } = require("express-validator"); //validator
const app = express();
const port = process.env.PORT || 3000;

validarEnv(); // Validate environment variables

// Middleware
const validationRules = require("./middleware/validators"); //validator
const limiter = require("./middleware/rateLimiter"); // Rate limiter
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies

//api/send-email
app.use("/api/send-email", limiter); //apllying rate limiter

app.post("/api/send-email", validationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Extract fields from request body
  const { name, lastName, email, message } = req.body;
  // Nodemailer transporter setup
  const transporter = createTransporter();
  // Mail options
  const mailOptions = createMailOptions(name, lastName, email, message);
  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
