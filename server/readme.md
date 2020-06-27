## Getting Started
To run the app:
1. Set `"host": "localhost"` in `ormconfig.json`
2. Add `keys.json` into the `keys/` folder. 
3. `npm i` in the `/webapp` directory to install web app dependencies
4. Back in `/server`, `npm i && npm run update-views && npm start`
5. The app should be running on localhost:3000

## Developing
To develop the app with hot-reloading:
1. In one terminal: `tsc -w`
2. Concurrently in another: `npm run dev`

## Testing
Jest is used for testing.
- Unit tests: `npm run unit-jest`
- Integration tests: `npm run integration-jest`

## Updating React Views
To refresh the React bundle sent from the server:
- `npm run update-views` - then restart the server

## Docker
### Development Build
To run the app in a docker image locally:
1. Set `"host": "host.docker.internal"` in `ormconfig.json`.
2. `npm run build`
3. `docker build -t tabber:0.0.1 .`
4. `docker-compose up`

### Production Build
To push the docker build to production server:
1. rename `ormconfig-prod.json` to `ormconfig.json`
2. rename `keys-prod.json` to `keys.json`
3. `npm run build`
4. `docker build -t mrvernonliu/tabber:0.0.1 .`
5. `docker push mrvernonliu/tabber:0.0.1`

On the server run:
1. `docker pull mrvernonliu/tabber:0.0.1`
2. `docker-compose up -d`
