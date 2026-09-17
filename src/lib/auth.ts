import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP server is ready:", success);
  }
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: '"Example Team" <italimbd@gmail.com>',
          to: user.email,
          subject: "Verify your email address",

          text: `Please verify your email address by clicking this link:
${verificationUrl}`,

          html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color: #f4f6f8; padding: 40px 0;"
        >
          <tr>
            <td align="center">

              <!-- Main Container -->
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width: 600px;
                  width: 100%;
                  background-color: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #2563eb;
                      padding: 30px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                      "
                    >
                      Example Team
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px;">

                    <h2
                      style="
                        margin: 0 0 20px;
                        color: #222222;
                        font-size: 24px;
                      "
                    >
                      Verify Your Email Address
                    </h2>

                    <p
                      style="
                        margin: 0 0 15px;
                        color: #555555;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Hello, ${user.name}
                    </p>

                    <p
                      style="
                        margin: 0 0 25px;
                        color: #555555;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Thank you for creating an account with
                      <strong>Example Team</strong>.
                      Please click the button below to verify your email
                      address and activate your account.
                    </p>

                    <!-- Button -->
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      align="center"
                      style="margin: 30px auto;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            border-radius: 6px;
                            background-color: #2563eb;
                          "
                        >
                          <a
                            href="${verificationUrl}"
                            target="_blank"
                            style="
                              display: inline-block;
                              padding: 14px 28px;
                              color: #ffffff;
                              text-decoration: none;
                              font-size: 16px;
                              font-weight: bold;
                              border-radius: 6px;
                            "
                          >
                            Verify My Email
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 0 0 10px;
                        color: #666666;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      If the button doesn't work, copy and paste the
                      following link into your browser:
                    </p>

                    <p
                      style="
                        margin: 0 0 25px;
                        word-break: break-all;
                        font-size: 13px;
                      "
                    >
                      <a
                        href="${verificationUrl}"
                        target="_blank"
                        style="color: #2563eb;"
                      >
                        ${verificationUrl}
                      </a>
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #777777;
                        font-size: 14px;
                        line-height: 1.6;
                      "
                    >
                      If you did not create an account, you can safely
                      ignore this email.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      background-color: #f8fafc;
                      padding: 25px;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0 0 8px;
                        color: #888888;
                        font-size: 13px;
                      "
                    >
                      © ${new Date().getFullYear()} Example Team.
                      All rights reserved.
                    </p>

                    <p
                      style="
                        margin: 0;
                        color: #aaaaaa;
                        font-size: 12px;
                      "
                    >
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
});
