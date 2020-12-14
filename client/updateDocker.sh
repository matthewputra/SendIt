docker rm -f clientContainer

docker pull saksham8/sendit-client

export TLSCERT=/etc/letsencrypt/live/api.serversideisfun.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/api.serversideisfun.me/privkey.pem

docker run \
  -d \
  -e TLSCERT=$TLSCERT \
  -e TLSKEY=$TLSKEY \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --name clientContainer \
  saksham8/sendit-client

exit