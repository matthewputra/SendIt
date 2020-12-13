FROM node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5200
ENTRYPOINT ["node", "/app/index.js"]