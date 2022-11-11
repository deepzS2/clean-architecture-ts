# Package json and yarn lock
FROM node:16-alpine as base
WORKDIR /usr/src/app

COPY ./package.json ./
RUN yarn install --production

# Start server
FROM node:16-alpine as release
WORKDIR /usr/src/app

COPY ./dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package.json ./package.json

ENTRYPOINT [ "yarn", "start" ]