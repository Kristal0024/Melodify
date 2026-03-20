const nodemailer = require('nodemailer');
require('dotenv').config();

// Singleton for the transporter
let transporter;

async function getTransporter() {
    if (transporter) return transporter;

    // Use environment variables if available
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });
    } else {
        // Fallback to transient Ethereal account for development
        console.log("No SMTP credentials found. Creating a test account...");
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log("Ethereal Test Account Created:", testAccount.user);
    }
    return transporter;
}

async function sendOTP(email, otp) {
    try {
        const _transporter = await getTransporter();
        const mailOptions = {
            from: '"Melodify Support" <support@melodify.com>',
            to: email,
            subject: "Your Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: #fff; border-radius: 8px;">
                    <h2 style="color: #1db954;">Melodify Password Reset</h2>
                    <p>You requested a password reset. Use the OTP below to proceed:</p>
                    <div style="font-size: 32px; font-weight: bold; background: #282828; padding: 10px; margin: 20px 0; text-align: center; color: #1db954; border-radius: 4px; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p>This OTP expires in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        const info = await _transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        const url = nodemailer.getTestMessageUrl(info);
        if (url) console.log("Preview URL: %s", url);
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}

module.exports = { sendOTP };
