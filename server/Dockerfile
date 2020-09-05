FROM node:12

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN apt-get update || : && apt-get install python3 -y
# RUN apt-get update || : && apt-get install curl -y
RUN apt-get update || : && apt-get install python3-pip -y
# RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
# RUN python get-pip.py
RUN python3 -m pip install --upgrade tensorflow
RUN python3 -m pip install crepe

RUN ls
CMD [ "node", "bin/www" ]

EXPOSE 3000
