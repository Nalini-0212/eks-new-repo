FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && chown -R node:node /app
COPY --chown=node:node app.js ./app.js
USER node
CMD ["node","app.js"]
