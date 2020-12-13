# Generate network for whole server container
docker network create serverNetwork

# Generate docker container from redis image
docker rm -f redisContainer

export  REDISADDR="redisContainer:6379"

docker run \
  -d \
  --name redisContainer \
  --network serverNetwork \
  redis

# Generate docker container from mysql image
docker rm -f mysqlContainer
docker pull matthewputra/sendItMySQL

# TODO: ADD PASSWORD AND DSN
export MYSQL_ROOT_PASSWORD=
export DSN="root:{PASSWORD}@tcp(mysqlContainer:3306)/sendItMySQL"

docker run \
  -d \
  -p 3306:3306 \
  --network serverNetwork \
  --name mysqlContainer \
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  -e MYSQL_DATABASE=sendItMySQL \
  matthewputra/sendItMySQL

# Generate docker container from mongoDB
docker rm -f mongoContainer
docker run \
  -d \
  --network serverNetwork \
  --name mongoContainer \
  mongo

# Generate docker container from microservice image
docker rm -f microserviceContainer
docker pull matthewputra/sendItMicroservice

export MESSAGESADDR="microserviceContainer:5200"

docker run \
  --network serverNetwork \
  --restart unless-stopped \
  -e MESSAGESADDR=$MESSAGESADDR \
  --name microserviceContainer \
  --restart unless-stopped \
  matthewputra/sendItMicroservice

# Generate docker container from gateway image
#TODO : CHECK WHICH ENVIRONMENTS ARE NEEDED
docker rm -f gatewayContainer
docker pull matthewputra/sendItGateway

export TLSCERT=/etc/letsencrypt/live/api.matthewputra.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/api.matthewputra.me/privkey.pem
export SESSIONKEY="key"
export SUMMARYADDR="http://summaryContainer:5100"
export MESSAGESADDR="http://messageContainer:5200"

docker run \
  -d \
  --network serverNetwork \
  --restart unless-stopped \
  -e TLSCERT=$TLSCERT \
  -e TLSKEY=$TLSKEY \
  -e SESSIONKEY=$SESSIONKEY \
  -e REDISADDR=$REDISADDR \
  -e MESSAGESADDR=$MESSAGESADDR \
  -e SUMMARYADDR=$SUMMARYADDR \
  -e DSN=$DSN \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --name gatewayContainer \
  matthewputra/sendItGateway

exit
