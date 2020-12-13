chmod u+x buildDocker.sh
./buildDocker.sh

# Navigate to AWS server side
# TODO: CHANGE THE DOMAIN
ssh ec2-user@api.matthewputra.me < updateDocker.sh