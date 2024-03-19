FROM node:18.19.1-alpine3.19

WORKDIR /app

COPY . .

RUN yarn install \
    && yarn build \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 9876

CMD [ "yarn", "start" ]