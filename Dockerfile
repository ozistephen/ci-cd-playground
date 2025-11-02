# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY app/package.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY app ./
EXPOSE 3000
CMD ["node", "src/index.js"]
