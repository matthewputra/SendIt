# # Stage 0
# FROM nginx as build-stage
# RUN mkdir /app
# WORKDIR /app
# COPY package*.json /app
# RUN npm install
# COPY . /app
# RUN npm run build

# # Stage 1

# FROM nginx:1.17.1-alpine
# EXPOSE 443
# COPY --from=build-step /app/build /usr/share/nginx/html
# COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

# pull official base image
# FROM node

# # add `/app/node_modules/.bin` to $PATH
# # ENV PATH /app/node_modules/.bin:$PATH

# # set working directory
# WORKDIR /app

# # install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install --silent
# RUN npm install react-scripts@4.0.1 -g --silent

# # add app
# COPY . ./

# # start app
# CMD ["npm", "start"]

FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@4.0.1 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]