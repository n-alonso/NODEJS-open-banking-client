#!/bin/sh

if ! [ -e .env ] || ! [ -s .env ]; then
    echo '.env file required'
    exit 2
fi

docker pull ajnick/open-banking-sandbox
docker run -d --env-file .env -p 9876:9876 ajnick/open-banking-sandbox:v0.1.0 