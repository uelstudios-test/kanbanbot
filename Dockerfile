FROM node:12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

RUN npm install nodemon -g

COPY . .

EXPOSE 80

CMD ["nodemon", "-L", "index.js"]