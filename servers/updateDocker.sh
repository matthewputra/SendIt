# Generate network for whole server container
docker network create serverNetwork

export TLSCERT=/etc/letsencrypt/live/api.serversideisfun.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/api.serversideisfun.me/privkey.pem
export SESSIONKEY="key"
export MICROSERVICEADDR="microserviceContainer:5200"
export  REDISADDR="redisContainer:6379"
export MYSQL_DATABASE="sendItMySqlDB"
export MYSQL_ROOT_PASSWORD="serversidedb"
export DSN="root:$MYSQL_ROOT_PASSWORD@tcp(mysqlContainer:3306)/$MYSQL_DATABASE"

# Generate docker container from gateway image
#TODO : CHECK WHICH ENVIRONMENTS ARE NEEDED
docker rm -f gatewayContainer
docker pull saksham8/sendit-gateway

docker run \
  -d \
  --network serverNetwork \
  -e TLSCERT=$TLSCERT \
  -e TLSKEY=$TLSKEY \
  -e SESSIONKEY=$SESSIONKEY \
  -e REDISADDR=$REDISADDR \
  -e MICROSERVICEADDR=$MICROSERVICEADDR \
  -e DSN=$DSN \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --restart unless-stopped \
  --name gatewayContainer \
  saksham8/sendit-gateway

# Generate docker container from redis image
docker rm -f redisContainer

docker run \
  -d \
  --name redisContainer \
  --network serverNetwork \
  redis

# Generate docker container from mysql image
docker rm -f mysqlContainer
docker pull saksham8/sendit-mysql

docker run \
  -d \
  --network serverNetwork \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --name mysqlContainer \
  -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
  -e MYSQL_DATABASE=$MYSQL_DATABASE \
  --restart unless-stopped \
  saksham8/sendit-mysql

# Generate docker container from microservice image
docker rm -f microserviceContainer
docker pull saksham8/sendit-microservice

docker run \
  --network serverNetwork \
  --restart unless-stopped \
  -e MICROSERVICEADDR=$MICROSERVICEADDR \
  --name microserviceContainer \
  --restart unless-stopped \
  saksham8/sendit-microservice

# Generate docker container from mongoDB
docker rm -f mongoContainer
docker run \
  -d \
  --network serverNetwork \
  --name mongoContainer \
  mongo

exit