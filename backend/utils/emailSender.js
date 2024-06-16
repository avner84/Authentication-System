const nodemailer = require("nodemailer");
const { EMAIL_PASSWORD } = require('../config/vars');
const { api: API_URL } = require('../config/default');

// Setting up the transporter for nodemailer using Gmail service
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: "authentication.system100@gmail.com", // Gmail email address to send from
    pass: EMAIL_PASSWORD, // Gmail password or app-specific password
  },
});

// Function to send verification email (initial or resend)
const sendVerificationEmail = (email, token, initial = true) => {
  const subject = initial ? "Activate Your Account at Authentication System – Your Final Step to Complete Registration!" : "Authentication System – Verification Link Resent";
  const htmlContent = initial ? 
    `<p>Hello,</p>
    <p>Thank you for registering with Authentication System! Please click the following link to verify your email address and activate your account:</p>
    <p><a href="${API_URL}/auth/verify?token=${token}">Verify Your Account</a></p>
    <p>If you did not request this email, you can ignore it.</p>` :
    `<p>Hi there,</p>
    <p>We've noticed you requested to resend your account verification link for Authentication System.</p>
    <p>To complete the verification of your account, please click on the link below:</p>
    <p><a href="${API_URL}/auth/verify?token=${token}">Verify Your Account</a></p>
    <p>If you didn't request this, please ignore this email or contact us if you feel something is wrong.</p>`;

  const mailOptions = {
    from: "authentication.system100@gmail.com",
    to: "avner84@gmail.com",
    subject: subject,
    html: htmlContent,
  };

  // Sending the email using the transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};


// Function to send password reset email
const sendPasswordResetEmail = (email, token) => {
  const subject = "Password Reset Request";
  const htmlContent = `
    <p>Hello,</p>
    <p>You have requested to reset your password for your Authentication System account.</p>
    <p>Please use the link below to verify your password reset request. This link will expire in 5 minutes:</p>
    <p><a href="${API_URL}/auth/validate-reset-password-token?token=${token}">Verify and Reset Your Password</a></p>
    <p>If you did not request a password reset, please ignore this email or contact support if you believe this is an error.</p>`;

  const mailOptions = {
    from: "authentication.system100@gmail.com",
    to: "avner84@gmail.com",
    subject: subject,
    html: htmlContent,
  };

  // Sending the email using the transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending password reset email: ", error);
    } else {
      console.log("Password reset email sent: ", info.response);
    }
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};



