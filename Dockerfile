FROM node:16-alpine

WORKDIR usr/app
COPY ./ ./
RUN yarn install \
&& yarn cache clean

CMD yarn start