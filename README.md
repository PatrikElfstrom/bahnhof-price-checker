# Bahnhof Price Check

Check the current price of Bahnhof's internet service and send an email if the price has changed.

## Usage

### Docker compose

```
version: '3'
services:
  bahnhof-price-checker:
    image: ghcr.io/patrikelfstrom/bahnhof-price-checker:latest
    container_name: bahnhof-price-checker
    environment:
      - ADDRESS=Rådhusgatan 5, 590 37 Kisa, Sweden
      - CURRENT_SPEED=500/100
      - CURRENT_PRICE=459
      - MAIL_SUBJECT=Bahnhof Price Change
      - MAIL_FROM=yourserver@example.com
      - MAIL_TO=you@example.com
      - MAIL_HOST=mailhost.example.com
      - MAIL_PORT=587
      - MAIL_USERNAME=your_mail_username
      - MAIL_PASSWORD=your_mail_password
    restart: always
```

### Call shell scripts directly

Clone the repo and just call comparePrice.sh with your current speed, price and address.
No mail will be sent using this method.

Requires jq, cURL and Sed.

```console
$ ./comparePrice.sh 500/100 459 "Rådhusgatan 5, 590 37 Kisa, Sweden"
The current price for 500/100 is 359 SEK which is lower than what you are paying.
```

Or to just get the current prices:

```console
$ ./getPrices.sh "Rådhusgatan 5, 590 37 Kisa, Sweden"
10/10 249
100/10 259
100/100 299
250/100 339
250/250 389
500/100 489
500/500 539
1000/100 579
1000/1000 829
```
