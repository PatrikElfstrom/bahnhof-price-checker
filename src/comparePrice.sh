#!/bin/sh

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <speed> <price> <address>"
    echo "Example: $0 500/100 359 \"Rådhusgatan 5, 590 37 Kisa, Sweden\""
    exit 1
fi

SPEED="$1"
PRICE="$2"
ADDRESS="$3"

RESPONSE=$(./getPrices.sh "$ADDRESS")

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
MATCH_FOUND=false

while IFS= read -r line; do
    RESPONSE_SPEED=$(echo "$line" | awk '{print $1}')
    RESPONSE_PRICE=$(echo "$line" | awk '{print $2}')

    if [ "$RESPONSE_SPEED" == "$SPEED" ]; then
        if [ "$RESPONSE_PRICE" -eq "$PRICE" ]; then
            echo -e "${GREEN}You have the current price for $SPEED which is $RESPONSE_PRICE SEK.${NC}"
            exit 0
        elif [ "$RESPONSE_PRICE" -gt "$PRICE" ]; then
            echo -e "${GREEN}The current price for $SPEED is $RESPONSE_PRICE SEK which is higher than what you are paying.${NC}"
            exit 0
        else
            echo -e "${RED}The current price for $SPEED is $RESPONSE_PRICE SEK which is lower than what you are paying.${NC}"
            exit 1
        fi
    fi

done <<EOF
$RESPONSE
EOF

if ! $MATCH_FOUND; then
    echo -e "${RED}The speed $SPEED was not found in the product listing.${NC}"
    exit 1
fi
