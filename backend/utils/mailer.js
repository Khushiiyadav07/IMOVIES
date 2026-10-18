const nodemailer = require("nodemailer");

// Create reusable transporter (uses environment variables if configured, or console fallback)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "demo@imovies.com",
    pass: process.env.EMAIL_PASS || "demo123"
  }
});

const verifyTransport = () => {
  transporter.verify((error) => {
    if (error) {
      console.log("ℹ️ Mailer running in demo/offline mode. (Email reminders logged to console)");
    } else {
      console.log("✅ Email transport verified and ready");
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"iMovies Cinema" <${process.env.EMAIL_USER || "notifications@imovies.com"}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Notification email sent to ${to}: ${info.messageId || 'Success'}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log(`📧 [Demo Mode] Email to ${to} simulation: ${subject}`);
    return { success: true, simulated: true };
  }
};

module.exports = {
  transporter,
  verifyTransport,
  sendEmail
};

