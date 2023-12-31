import { promisify } from "node:util";
import got from "got";
import { CookieJar } from "tough-cookie";
import nodemailer from "nodemailer";

const cookieJar = new CookieJar();
const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));

const cookie = [
  "searchableAddress",
  JSON.stringify({
    city: { name: "G\u00f6teborg", normalizedName: "goteborg" },
    formattedAddressString: "Styrfarten 3, 417 65 G\u00f6teborg",
    type: "DEFAULT",
    villafiberData: [],
    street: "Styrfarten",
    zip: "41765",
    number: "3",
    networkName: "Framtidens Bredband - ITUX",
  }),
].join("=");

await setCookie(cookie, "https://bahnhof.se");

const { headers } = await got.get(
  "https://bahnhof.se/bredband/nya-framtidens-bredband/goteborg"
);

const { data } = await got
  .get(
    "https://bahnhof.se/ajax/bredband/products/nya-framtidens-bredband/goteborg",
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": headers["X-CSRF-TOKEN"],
      },
      cookieJar,
    }
  )
  .json();

const { price } = data.products.find(
  ({ title }) => title === "1000/1000 Mbit/s"
);

if (currentPrice === price) {
  console.log(`No price change`);
  return;
}

console.log(`New price: ${price}`);

const googleAppPassword = "dmnvsmrepbhbiptu";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    pass: googleAppPassword,
  },
});

transporter.sendMail(
  {
    from: "me@patrikelfstrom.se",
    to: "me@patrikelfstrom.se",
    subject: `Bahnhof pris har ändrats från ${currentPrice} till ${price}`,
    text: `Bahnhof pris har ändrats från ${currentPrice} till ${price}`,
  },
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("mail sent");
    }
  }
);
