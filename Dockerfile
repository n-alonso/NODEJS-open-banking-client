FROM node:18.19.1-alpine3.19

RUN mkdir /app && chown node:node /app

USER node

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY tsconfig.prod.json knexfile.ts ./
COPY scripts/ scripts/
COPY src/ src/

RUN yarn build

EXPOSE 9876

CMD [ "yarn", "start" ]