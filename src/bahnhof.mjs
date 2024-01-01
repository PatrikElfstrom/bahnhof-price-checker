import nodemailer from "nodemailer";
import { execSync } from "child_process";

const address = process.env.ADDRESS;
const currentSpeed = process.env.CURRENT_SPEED;
const currentPrice = process.env.CURRENT_PRICE;
const mailSubject = process.env.MAIL_SUBJECT;
const mailFrom = process.env.MAIL_FROM;
const mailTo = process.env.MAIL_TO;
const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT;
const mailUsername = process.env.MAIL_USERNAME;
const mailPassword = process.env.MAIL_PASSWORD;

if (
  !address ||
  !currentSpeed ||
  !currentPrice ||
  !mailSubject ||
  !mailFrom ||
  !mailTo ||
  !mailHost ||
  !mailPort ||
  !mailUsername ||
  !mailPassword
) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

function sendMail(text, callback) {
  const config = {
    host: mailHost,
    port: mailPort,
    auth: {
      user: mailUsername,
      pass: mailPassword,
    },
  };

  const transporter = nodemailer.createTransport(config);

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
        console.log("mail sent");
      }
      callback && callback();
    }
  );
}

try {
  const stdout = execSync(`./getPrices.sh "${address}"`, { encoding: "utf-8" });

  const products = stdout.split("\n");
  products.forEach((line) => {
    const [speed, price] = line.split(" ");

    if (speed === currentSpeed) {
      if (price === currentPrice) {
        console.log(
          `You have the current price for ${speed} which is ${price} SEK.`
        );
        process.exit(0);
      } else if (price > currentPrice) {
        const message = `Price increased from ${currentPrice} to ${price}`;
        console.log(message);
        sendMail(message, () => {
          process.exit(0);
        });
      }

      const message = `Price decreased from ${currentPrice} to ${price}`;
      console.log(message);
      sendMail(message, () => {
        process.exit(1);
      });
    }
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
