# Stage 0
# FROM tiangolo/node-frontend:10 as build-stage
# WORKDIR /app
# COPY package*.json /app/
# RUN npm install
# COPY ./ /app/
# RUN npm run build

# # Stage 1
# FROM nginx:1.15
# EXPOSE 443
# COPY --from=build-stage /app/build/ /usr/share/nginx/html
# COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

# pull official base image
FROM node:13.12.0-alpine

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.1 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]