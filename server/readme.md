# Server
The server is developed locally using `docker` and `docker-compose`. Install these if you haven't already. This is a single page app using client side routing. Upon initial request, the server sends a bundle of React views to the client. These views are built in `/webapp/` and saved into `/server/views/`.

A live-reloading environment is provided for ease of development. Steps to get started are below.

## Getting Started
Optional - checkout `develop` branch for most up-to-date code.
1. Create a `.env` file in `/server/` which mirrors variables defined in `.env.test`
2. Install npm dependencies in __both__ `/server/` and `/webapp/`
   ``` npm i && cd ../webapp && npm i ```
3. Transpile the typescript and create bundle of react views
   ``` npm run build ```
4. Build and run the docker image
   ``` docker-compose up --build tabber-dev ```

Use ``` docker-compose down ``` to take the app down.

Tabber should be running on localhost:3000

### Live-Reloading
The docker-compose file creates a bind-mount between the source code directories on your local machine and within the container. To enable live-reloading, simply run `tsc -w` while the app is running in docker to have changes to the typescript automatically transpiled. The app is being run in docker with `nodemon`, so it will restart when changes to the javascript are made.

### Not Using Docker
If running the app on your local machine is preferred:
- Use the `Dockerfile` as a guide to install all dependencies
- Run `npm start` to start the server or `tsc -w` and `npm run dev` _concurrently_ to enable live-reloading via nodemon

## Testing
Jest is used for testing.
- Unit tests: `npm test`
- Integration tests: `npm run integration-jest`

## Updating React Views
To refresh the React bundle sent from the server:
- `npm run update-views` - then restart the server
