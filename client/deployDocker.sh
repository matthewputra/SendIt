chmod u+x buildDocker.sh
sh ./buildDocker.sh

# Navigate to AWS server side
ssh ec2-user@serversideisfun.me < updateDocker.sh