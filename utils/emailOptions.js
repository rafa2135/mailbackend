const createMailOptions = (name, lastName, email, message) => {
  return {
    from: process.env.SMTP_FROM_EMAIL,
    to: process.env.CONTACT_EMAIL_RECIPIENT,
    subject: `New Form Submission from ${name} ${lastName}`,
    replyTo: email,
    text: `Name: ${name} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name} ${lastName}</p>
                 <p><strong>Email:</strong> <span class="math-inline">${email}</p>
                 <p><strongMessage:</strong></p><p>${message}</p>`,
  };
};

module.exports = createMailOptions;
