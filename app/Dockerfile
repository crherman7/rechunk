##############################################################
# build image at root of repository for yarn.lock context
# command:
# docker build -f app/Dockerfile . -t rechunk
##############################################################

From node:latest

WORKDIR /app

COPY ./app/package.json ./
COPY yarn.lock ./

RUN yarn install

COPY ./app .

RUN yarn build

EXPOSE 3000

CMD [ "node", "dist/index.cjs" ]