
## Local Build
Pre-docker steps
1. Set ormconfig to use the host:
- host.docker.internal

Run these one your local machine
1. npm run build
2. docker built -t tabber:0.0.1 .
3. docker-compose up


## Production Build
Pre-docker steps
1. rename ormconfig-prod to ormconfig
2. rename keys-prod.json to keys.json

Run these on your local machine:
1. npm run build
2. docker build -t mrvernonliu/tabber:0.0.1 .
3. docker push mrvernonliu/tabber:0.0.1

On the server run
1. docker pull mrvernonliu/tabber:0.0.1
2. docker-compose up -d 



