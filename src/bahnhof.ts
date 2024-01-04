import { nodemailer } from "./deps.ts";

const address = Deno.env.get("ADDRESS");
const currentSpeed = Deno.env.get("CURRENT_SPEED");
const currentPrice = Deno.env.get("CURRENT_PRICE");
const mailSubject = Deno.env.get("MAIL_SUBJECT");
const mailFrom = Deno.env.get("MAIL_FROM");
const mailTo = Deno.env.get("MAIL_TO");
const mailHost = Deno.env.get("MAIL_HOST");
const mailPort = Deno.env.get("MAIL_PORT");
const mailUsername = Deno.env.get("MAIL_USERNAME");
const mailPassword = Deno.env.get("MAIL_PASSWORD");

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
  Deno.exit(1);
}

function sendMail(text: string, callback: () => void) {
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
        console.log("mail sent");
      }
      callback && callback();
    }
  );
}

try {
  const command = new Deno.Command("./getPrices.sh", {
    args: [address],
  });

  const { code, stdout, stderr } = command.outputSync();
  const stdoutString = stdout.toString();

  // const stdout = execSync(`./getPrices.sh "${address}"`, { encoding: "utf-8" });

  const products = stdoutString.split("\n");
  products.forEach((line) => {
    const [speed, price] = line.split(" ");

    if (speed === currentSpeed) {
      if (price === currentPrice) {
        console.log(
          `You have the current price for ${speed} which is ${price} SEK.`
        );
        Deno.exit();
      } else if (price > currentPrice) {
        const message = `Price increased from ${currentPrice} to ${price}`;
        console.log(message);
        sendMail(message, () => {
          Deno.exit();
        });
      }

      const message = `Price decreased from ${currentPrice} to ${price}`;
      console.log(message);
      sendMail(message, () => {
        Deno.exit(1);
      });
    }
  });
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
