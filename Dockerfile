# Stage 1 -> base setup
FROM node:18.19.1-alpine3.19 as base

RUN mkdir /app && chown node:node /app
WORKDIR /app
USER node

COPY package.json yarn.lock tsconfig.prod.json ./

RUN yarn install --prod  && yarn cache clean

# Stage 2 -> build/compile
FROM base AS build
RUN yarn install && yarn cache clean
COPY src/ src/

RUN yarn build

# Stage 3 -> ship the compiled js
FROM base

COPY package.json .
COPY --from=build dist/ /app/dist/

EXPOSE 9876

CMD [ "yarn", "start" ]