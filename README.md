## server steup - only needed to be done once when the instance was created

snap install docker

## Note the server hostname is already (just created a subdomain on my personal domain)

cloudcomputingassignment.stephridnell.com

## if you i stop and start the ec2 instance, it will have a new DNS name so this will fail so need to update the cname record in route54

1. go to https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances
1. get the Public IPv4 DNS value of the ec2 instance
1. go to https://us-east-1.console.aws.amazon.com/route53/v2/hostedzones#ListRecordSets/Z1WQV6XJWIIZ88
1. select the record cloudcomputingassignment and update the vale with the new one.
1. save
1. wait a couple of mins for dns to propagate

## deployment:

## first zip assignment 2 (just do it in finder)

## copy zip folder to instance

scp assignment2.zip ubuntu@cloudcomputingassignment.stephridnell.com:/tmp/

## log onto the server

ssh ubuntu@cloudcomputingassignment.stephridnell.com

## on the server

sudo su
cd /tmp/

## for some weird reason it doesnt work when running it out of the /tmp/ dir so move it to home.

cp assignment2.zip ~/

cd ~

## if the assignment2 folder exists blow them away but quadriple check you arent on your local ;)

## rm -rf assignment2

unzip assignment2.zip

## if it complains about an osx dir existing just press A

cd assignment2/

docker-compose up -d --build

docker-ps ## just checking if the containers are running

## view in browser

cloudcomputingassignment.stephridnell.com
