FROM node:14

ARG yarncmd
ARG exposedport

WORKDIR /app
COPY package.json /app/package.json

RUN apt-get update \
        && apt-get install -y apt-transport-https \
        && curl https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
        && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
        && apt-get update \
        && apt-get install -y yarn \
        && yarn install

COPY . /app

EXPOSE $exposedport

CMD ["yarn", $yarncmd]
