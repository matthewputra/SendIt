# !/bin/bash

# Create docker image for gateway
cd gateway
GOOS=linux go build
docker build -t saksham8/sendit-gateway .
go clean
docker push saksham8/sendit-gateway

# Create docker image for mysql
cd ../db
docker build -t saksham8/sendit-mysql .
docker push saksham8/sendit-mysql

# Create docker image for microservice
cd ../microservice
docker build -t saksham8/sendit-microservice .
docker push saksham8/sendit-microservice

cd ..