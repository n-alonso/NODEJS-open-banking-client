#!/bin/sh

if ! [ -e .env ] || ! [ -s .env ]; then
    echo '.env file required'
    exit 2
fi

docker pull ajnick/open-banking-sandbox:1.0.0
docker run \
    --env-file .env \
    -p 9876:9876 \
    -v $(pwd)/logs:/app/logs \
    ajnick/open-banking-sandbox:1.0.0