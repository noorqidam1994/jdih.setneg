# FROM node:16.18.0-alpine as dependencies
# WORKDIR /jdih
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# FROM node:16.18.0-alpine as builder
# WORKDIR /jdih
# COPY . .
# COPY --from=dependencies /jdih/node_modules ./node_modules
# RUN yarn build

# FROM node:16.18.0-alpine as runner
# WORKDIR /jdih
# ENV NODE_ENV production
# # If you are using a custom next.config.js file, uncomment this line.
# # COPY --from=builder /my-project/next.config.js ./
# COPY --from=builder /jdih/public ./public
# COPY --from=builder /jdih/server.js ./
# COPY --from=builder /jdih/knexfile.js ./
# COPY --from=builder /jdih/next.config.js ./
# COPY --from=builder /jdih/node_modules ./node_modules
# COPY --from=builder /jdih/package.json ./package.json

# EXPOSE 3000
# CMD ["yarn", "start"]

FROM node:18-alpine

# docker build -f /path/Dockerfile .
# create & set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy source files
COPY . /usr/src/app

# install dependencies
COPY ./package*.json /usr/src/app/

# RUN npm install -g npm@latest

RUN npm install

# start app
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]