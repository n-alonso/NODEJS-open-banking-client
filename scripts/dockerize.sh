#!/bin/sh

if ! [ -e .env ] || ! [ -s .env ]; then
    echo '.env file required'
    exit 2
fi

docker pull ajnick/open-banking-sandbox:v0.3.2
docker run \
    --env-file .env \
    -e NODE_ENV=production \
    -p 9876:9876 \
    -v $(pwd)/logs:/app/logs \
    ajnick/open-banking-sandbox:v0.3.0