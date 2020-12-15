docker rm -f clientContainer

docker pull saksham8/sendit-client

export TLSCERT=/etc/letsencrypt/live/serversideisfun.me/fullchain.pem
export TLSKEY=/etc/letsencrypt/live/serversideisfun.me/privkey.pem

docker run \
  -d \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  -e TLSCERT=$TLSCERT \
  -e TLSKEY=$TLSKEY \
  -p 443:443 \
  -p 80:80 \
  --name clientContainer \
  saksham8/sendit-client

exit