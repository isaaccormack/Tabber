# React Webapp
The front-end for tabber is a single page React app utilizing client side routing. The app uses redux, typescipt, and react-bootstrap. The single page app is served from the back-end in production upon the clients initial request. AJAX requests are then used to fetch further data from the server.

A live-reloading server is available for local development. Steps to get started are given below.

## Developing
This app uses live-reloading through a development server running on port 3001. This development server proxies API requests to port 3000 where the server is running. Although it is possible to develop the front-end without simultaneously running the server, it is recommended to also run the server. Follow the getting started steps in `/server/readme.md` to do so.

To run the development server:
1. Install npm dependencies
   ```npm i```
2. Start the server
   ```npm start```

The development server should be running on localhost:3001. Note that if the back-end server is also running, it will be deploying the production views from localhost:3000. Be careful to access the right port when viewing the app in browser, especially after logging in with OAuth.

## Note About OAuth Login
When logging in with OAuth, the browser will redirect you to a production domain name for tabber (ie.`tabber.io`). For local development, you must manually redirect back to the desired server running locally. Specifically, when redirected to `http://tabber.io/oauth?authuser=0&code=...` replace the domain name with `localhost:3001` (ie. `http://localhost:3001/oauth?authuser=0&code=...`). This will redirect you back to the development server as an authenticated user. Use port 3000 to access views served from the back-end.

## Production Build
To update the views deployed from the server, use `npm run build`. This creates a production build of the React app and saves it into `/server/views`.