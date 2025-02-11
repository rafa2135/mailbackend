require("dotenv").config();
const cors = require("cors"); // Import the cors middleware
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const express = require("express");
const rateLimit = require("express-rate-limit"); //limiter
const { body, validationResult } = require("express-validator"); //validator
const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM_EMAIL",
  "CONTACT_EMAIL_RECIPIENT",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    console.error(`ERROR: Missing environment variable: ${variable}`);
    process.exit(1); // Exit the process
  }
}

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests (important for Next.js frontend)
app.use(bodyParser.json()); // Parse JSON request bodies

//api/send-email
//rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests. Please try again later.",
});

app.use("/api/send-email", limiter); //apllying rate limiter

app.post(
  "/api/send-email",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("message")
      .notEmpty()
      .withMessage("Message is required")
      .isLength({ max: 1000 })
      .withMessage("Message is too long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, lastName, email, message } = req.body;

    // Nodemailer transporter setup (configure your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.CONTACT_EMAIL_RECIPIENT,
      subject: `New Form Submission from ${name} ${lastName}`,
      replyTo: email,
      text: `Name: ${name} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name} ${lastName}</p>
          <p><strong>Email:</strong> <span class="math-inline">${email}</p\>
          <p\><strong\>Message\:</strong\></p\><p\></span>${message}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email." });
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
