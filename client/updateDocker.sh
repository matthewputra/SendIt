docker rm -f clientContainer

docker pull saksham8/sendit-client

export TLSCERT=/etc/letsencrypt/live/serversideisfun.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/serversideisfun.me/privkey.pem

docker run \
  -d \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  -v /app/node_modules \
  -v ${PWD}:/app \
  -e TLSCERT=$TLSCERT \
  -e TLSKEY=$TLSKEY \
  -p 443:443 \
  --name clientContainer \
  saksham8/sendit-client

exit