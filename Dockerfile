# Package json and yarn lock
FROM node:16-alpine as base
WORKDIR /user/src/app

COPY ./package.json ./

# Yarn install
FROM node:16-alpine as dependencies
RUN yarn install --production

# Start server
FROM node:16-alpine as release

COPY ./dist ./dist
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

EXPOSE 5000

ENTRYPOINT [ "yarn", "start" ]