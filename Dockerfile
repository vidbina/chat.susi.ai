FROM node:9

COPY . /usr/src

WORKDIR /usr/src

EXPOSE 3000 5000

RUN \
  npm install && \
  npm run build && \
  npm install -g serve

ENTRYPOINT serve -s build
