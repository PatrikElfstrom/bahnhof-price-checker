import { load, nodemailer } from "./deps.ts";

const env = await load();

const mailSubject = env["MAIL_SUBJECT"] ?? Deno.env.get("MAIL_SUBJECT");
const mailFrom = env["MAIL_FROM"] ?? Deno.env.get("MAIL_FROM");
const mailTo = env["MAIL_TO"] ?? Deno.env.get("MAIL_TO");
const mailHost = env["MAIL_HOST"] ?? Deno.env.get("MAIL_HOST");
const mailPort = env["MAIL_PORT"] ?? Deno.env.get("MAIL_PORT");
const mailUsername = env["MAIL_USERNAME"] ?? Deno.env.get("MAIL_USERNAME");
const mailPassword = env["MAIL_PASSWORD"] ?? Deno.env.get("MAIL_PASSWORD");

export function sendMail(text: string, callback: () => void) {
  console.log("💌 Sending mail...");

  const transporter = nodemailer.createTransport({
    host: mailHost,
    port: Number(mailPort),
    auth: {
      user: mailUsername,
      pass: mailPassword,
    },
  });

  transporter.sendMail(
    {
      from: mailFrom,
      to: mailTo,
      subject: mailSubject,
      text,
    },
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log("✅ Mail sent");
      }
      callback && callback();
    }
  );
}
