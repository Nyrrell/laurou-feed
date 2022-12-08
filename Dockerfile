FROM node:16-alpine

WORKDIR usr/app
COPY ./ ./
RUN yarn install \
&& rm -rf node_modules \
&& yarn cache clean

CMD yarn start