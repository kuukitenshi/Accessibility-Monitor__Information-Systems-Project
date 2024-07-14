FROM node:16

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3019

CMD [ "npm", "start" ]