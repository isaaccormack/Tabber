# NOTES:
#   - this Dockerfile is intended for production builds
#   - 'npm build' MUST be run before building image to get newest views and compiled typescript

FROM ubuntu:18.04

RUN apt-get update && apt-get install -y python3  python3-dbg  python3-pip

# dependencies for crepe
RUN pip3 install -U pip
RUN pip3 install llvmlite==0.34.0
RUN python3 -m pip install librosa

# crepe is run in app like "python3 -m crepe" => install with python3 -m pip
RUN python3 -m pip install crepe
RUN python3 -m pip install --upgrade tensorflow

# used to convert every audio file saved on server to .wav
RUN apt-get install -y ffmpeg

# install nodejs 12, comes packaged with npm 6
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - &&  apt-get install -y nodejs

# install npm dependencies
WORKDIR /app
COPY package*.json /app/
RUN npm install

# create directories app uses to save files
RUN mkdir /app/crepe
RUN mkdir /app/logs
RUN mkdir /app/uploads

# create user to run app with and give necessary ownership
RUN addgroup -gid 10001 tabber && \
    adduser -uid 10000 --gid 10001 --home /home/tabber --disabled-password --gecos '' tabber && \
    chown -R tabber:tabber /app/crepe && \
    chown -R tabber:tabber /app/logs && \
    chown -R tabber:tabber /app/uploads

# copy only necessary files
COPY bin /app/bin
COPY dist /app/dist
COPY tabbing /app/tabbing
COPY views /app/views
COPY ormconfig.js /app/

EXPOSE 3000

USER tabber

# TODO: change this to use forever
CMD [ "node", "bin/www" ]
