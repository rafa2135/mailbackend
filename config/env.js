const requiredEnvVariables = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM_EMAIL",
  "CONTACT_EMAIL_RECIPIENT",
];

function validateEnvVariables() {
  for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
      console.error(`ERROR: Missing environment variable: ${variable}`);
      process.exit(1); // Exit the process
    }
  }
}

module.exports = validateEnvVariables;
