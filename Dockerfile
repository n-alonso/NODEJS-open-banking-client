# Stage 1, compile the TS files
FROM node:18.19.1-alpine3.19 as build

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY tsconfig.prod.json .
COPY src/ src/

RUN yarn build

# Stage 2, copy the compiled JS and start the server
FROM node:18.19.1-alpine3.19

RUN mkdir /app && chown node:node /app

WORKDIR /app

USER node

COPY package.json .
COPY --from=build node_modules/ /app/node_modules/
COPY --from=build dist/ /app/dist/

EXPOSE 9876

CMD [ "yarn", "start" ]