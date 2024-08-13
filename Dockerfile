FROM node:14 as builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

USER node

RUN yarn

COPY --chown=node:node . .
COPY --chown=node:node .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"]