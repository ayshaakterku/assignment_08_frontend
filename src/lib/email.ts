// email.ts

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

interface IEmail {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: IEmail) {
  try {
    const info = await transporter.sendMail({
      from: `BookNook <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("GMAIL EMAIL ERROR:", error);
    throw error;
  }
}



// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // Gmail App Password, not your normal password
//   },
// });

// export async function sendEmail({to, subject, text, html,}: {
//   to: string;
//   subject: string;
//   text?: string;
//   html?: string;
// }) {
//   await transporter.sendMail({
//     from: `"BookNook" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html,
//   });
// }