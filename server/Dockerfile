FROM node:12

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN ls
CMD [ "node", "bin/www" ]

EXPOSE 3000
