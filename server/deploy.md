# Production Deployment
This guide illustrates the steps needed to create a production build on the client and deploy it on the server. The app is run on the server in a docker container with a nginx reverse proxy.

## Client Steps
The client must package the most up-to-date front and back end code, build this into a docker image, and push the image to docker hub.

1. Transpile the typescript and create a production build of the React app
   ``` npm run build ```
2. Build a production docker image
   ``` docker build -t tabber . ```
3. Tag the image as a new release `X.Y.Z`
   ``` docker tag tabber icormack/tabber:X.Y.Z ```
4. Push the image to docker hub
   ``` docker push icormack/tabber:X.Y.Z ```

The image is now archived on docker hub and ready to be pulled down to the server.

## Server Steps
In short, the server uses nginx as a reverse proxy to the app running a docker container, listening on port 3000. Certbot is utilized to enable https through nginx. That is, deployment on the server involves the following 3 aspects:
- Local machine setup
- Pulling and running docker image from docker hub
- Nginx setup

Before starting, install `docker`, `docker-compose`, `nginx` and `python-certbot-nginx` if necessary.

### Machine Setup
The following steps should be completed in the home directory.
1. Create a directory which will mount to the docker container, holding the logs
   ``` mkdir logs ```
2. Create a `.env` file to hold all environment variables. Use `.env.test` in the repo as a template. The server will fail to start if any necessary env variables are not defined.
3. Create a `docker-compose.yml` file and copy the `tabber` service into it from the docker-compose.yml file in the repo. __Update__ the image field to the latest tag to be pulled from docker hub. (ie. `image: icormack/tabber:X.Y.Z`)

### Docker Deploy
1. Pull the latest image from docker hub
   ``` sudo docker pull icormack/tabber:X.Y.Z ```
2. Run the image using docker-compose (-d to run in background)
   ``` docker-compose up -d ```
3. Check the logs to see if the server started successfully
   ``` docker-compose logs ```

The server should be running on localhost:3000. The server can be stopped with ` docker-compose down `.

### Nginx Setup
The below steps are summarized from a [simple tutorial](https://winstonkotzan.com/blog/2019/03/09/production-https-setup-for-ruby-on-rails-app-with-docker.html) outlining how to use nginx with certbot as a reverse proxy using https. An example of the resultant nginx file can be seen in the repo under `/server/nginx/`
1. Ensure the firewall is configured to allow inbound http (port 80) and https (port 443) traffic.
2. Modify the default nginx server being run in `/etc/nginx/sites-available/default` to proxy all requests to
   tabber running on localhost:3000. Delete the `root` and `index` fields in the server. The resulting server should look something like this:
    ```
    server {
        listen 80;
        listen [::]:80;
        server_name my-example-domain.com www.my-example-domain.com;

        location / {
            proxy_pass http://localhost:3000;
        }
    }
    ```

2. There should already be a simlink from this file to `/etc/nginx/sites-enabled/default` enabling
   to run the server defined on this file. At the point, the site should be accessible via http
3. Run `python-certbot-nginx` to enable https
   ```  sudo certbot --nginx -d my-example-domain.com -d www.my-example-domain.com ```

Tabber should now be running at https://my-example-domain.com
