// email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password, not your normal password
  },
});

export async function sendEmail({to, subject, text, html,}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  await transporter.sendMail({
    from: `"BookNook" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}