import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { sendEmail } from "@/lib/email";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("book-nook");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,

    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        console.log("Password reset requested:", user.email);

        const result = await sendEmail({
          to: user.email,
          subject: "Reset Your BookNook Password",

          text: `
Hello ${user.name},

You requested to reset your BookNook password.

Click the link below to reset your password:

${url}

If you did not request this, please ignore this email.

BookNook Team
        `,

          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Your BookNook Password</h2>

            <p>Hello ${user.name},</p>

            <p>
              You requested to reset your BookNook password.
            </p>

            <a
              href="${url}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #C2F800;
                color: #15171D;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>

            <p>
              If you did not request this, please ignore this email.
            </p>

            <p>BookNook Team</p>
          </div>
        `,
        });

        console.log("Password reset email sent:", result?.messageId);
      } catch (error) {
        console.error("Password reset email failed:", error);
        throw error;
      }
    },

    onPasswordReset: async ({ user }) => {
      console.log(`Password successfully reset for ${user.email}`);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // account: {
  //   accountLinking: {
  //     enabled: true,
  //     trustedProviders: ["google"],
  //   },
  // },

  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
