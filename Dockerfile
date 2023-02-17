FROM node:18-alpine
WORKDIR /opt
COPY package*.json ./
RUN npm ci --only=production
COPY ./src ./src
CMD [ "node", "src/index.js" ]
