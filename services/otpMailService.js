const nodemailer = require("nodemailer");

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 465),
    secure: String(process.env.EMAIL_PORT || 465) === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

/**
 * Sends a 6-digit OTP email with modern, responsive styling.
 * @param {string} toEmail - Recipient email
 * @param {string} name - Recipient name (optional)
 * @param {string} otp - 6-digit OTP
 * @param {'register'|'forgot'} purpose - Purpose of the OTP
 */
async function sendOtpEmail(toEmail, name = "", otp, purpose = "register") {
  const isRegister = purpose === "register";
  const subject = isRegister
    ? `${otp} is your IELTS Mockpoint verification code`
    : `${otp} is your IELTS Mockpoint password reset code`;

  const heading = isRegister ? "Verify Your Email Address" : "Reset Your Password";
  const subText = isRegister
    ? "Thank you for joining IELTS Mockpoint! To complete your registration and verify your account, please enter the 6-digit verification code below:"
    : "We received a request to reset your IELTS Mockpoint account password. Please enter the 6-digit security code below to set a new password:";

  const validityMinutes = isRegister ? 10 : 15;
  const safeName = name ? String(name).replace(/[<>&]/g, "").trim() : "Student";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f7fb; font-family:'Segoe UI', Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7fb; padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(11,43,82,0.08); border:1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b2b52 0%, #1565c9 100%); padding:28px 24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800; letter-spacing:0.5px;">IELTS Mockpoint</h1>
              <p style="margin:6px 0 0 0; color:#dbeafe; font-size:13px; font-weight:500;">Official Mock Tests & AI Band Evaluation</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:32px 28px 24px 28px;">
              <h2 style="margin:0 0 14px 0; color:#0b2b52; font-size:20px; font-weight:700;">${heading}</h2>
              <p style="margin:0 0 14px 0; font-size:15px; line-height:1.6; color:#334155;">Hello <strong>${safeName}</strong>,</p>
              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#475569;">${subText}</p>

              <!-- OTP Code Display Card -->
              <div style="background:#f8fafc; border:2px dashed #1565c9; border-radius:12px; padding:20px 16px; text-align:center; margin:24px 0;">
                <span style="display:block; font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#64748b; font-weight:700; margin-bottom:8px;">Your 6-Digit Verification Code</span>
                <span style="font-family:'Courier New', monospace, monospace; font-size:36px; font-weight:800; letter-spacing:10px; color:#0b2b52; display:inline-block; padding-left:10px;">${otp}</span>
              </div>

              <!-- Expiry & Warning -->
              <p style="margin:0 0 8px 0; font-size:13px; color:#64748b; text-align:center;">
                ⏱️ This code expires in <strong>${validityMinutes} minutes</strong>.
              </p>
              <p style="margin:0 0 24px 0; font-size:12px; color:#94a3b8; text-align:center;">
                If you did not make this request, you can safely ignore this email.
              </p>

              <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;">

              <p style="margin:0; font-size:13px; line-height:1.5; color:#64748b; text-align:center;">
                Need help? Contact our support team anytime at <a href="mailto:support@ieltsmockpoint.com" style="color:#1565c9; text-decoration:none; font-weight:600;">support@ieltsmockpoint.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:18px 24px; text-align:center; border-top:1px solid #f1f5f9;">
              <p style="margin:0; font-size:11px; color:#94a3b8;">
                © 2026 IELTS Mockpoint. All rights reserved.<br>
                Dedicated to helping IELTS candidates achieve their target band scores.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const text = `Hello ${safeName},\n\nYour IELTS Mockpoint verification code is: ${otp}\n\nThis code is valid for ${validityMinutes} minutes.\nIf you did not request this, please ignore this email.\n\n- The IELTS Mockpoint Team`;

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`\n[DEV - EMAIL NOT CONFIGURED] OTP for ${toEmail} (${purpose}) => ${otp}\n`);
    return { success: true, devMode: true };
  }

  await transporter.sendMail({
    from: `"IELTS Mockpoint" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    text,
    html
  });

  return { success: true, devMode: false };
}

module.exports = {
  sendOtpEmail,
  getTransporter
};
