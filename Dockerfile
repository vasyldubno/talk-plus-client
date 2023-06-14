FROM node:18-alpine

WORKDIR /usr/src/client/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3005

CMD [ "yarn", "dev" ]