# !/bin/bash

npm run build

docker build -t saksham8/sendit-client .
docker push saksham8/sendit-client