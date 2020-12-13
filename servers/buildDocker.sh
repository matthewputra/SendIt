# Create docker image for gateway
cd gateway
GOOS=linux go build
docker build -t matthewputra/sendItGateway .
go clean
docker push matthewputra/sendItGateway

# Create docker image for mysql
cd ../db
docker build -t matthewputra/sendItMySQL .
docker push matthewputra/sendItMySQL

# Create docker image for microservice
cd ../microservice
docker build -t matthewputra/sendItMicroservice .
docker push matthewputra/sendItMicroservice

cd ..

#TODO : Decide to use which Docker