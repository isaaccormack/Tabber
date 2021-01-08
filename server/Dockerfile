FROM ubuntu:18.04

RUN apt-get update && apt-get install -y python3  python3-dbg  python3-pip

RUN pip3 install -U pip

RUN pip3 install llvmlite==0.34.0

# TODO: may need to use python -m pip install crepe instead because this is the cmd used in the app to run crepe
RUN python3 -m pip install crepe

RUN python3 -m pip install --upgrade tensorflow

RUN addgroup -gid 10001 tabber && \
    adduser -uid 10000 --gid 10001 --home /home/tabber --disabled-password --gecos '' tabber

# can add this above in first line
#RUN apt-get install -y nodejs:12 npm

RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - &&  apt-get install -y nodejs

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN ls
# change this to npm run start?
#CMD [ "node", "bin/www" ]

# should this be before?
EXPOSE 3000
