FROM node:18-alpine
WORKDIR /opt
COPY *.json ./
RUN npm install
COPY ./src ./src
RUN npx tsc
CMD [ "node", "src/index.js" ]
