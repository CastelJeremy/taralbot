FROM node:18-alpine
WORKDIR /opt
COPY *.json ./
RUN npm ci --only=production
COPY ./src ./src
RUN npx tsc
CMD [ "node", "src/index.js" ]
