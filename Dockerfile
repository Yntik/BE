FROM node:10.15

LABEL Ivashenko O.V.

RUN mkdir -p /BE

WORKDIR /BE

ADD ./ /BE

EXPOSE 3000

RUN apt-get update -y
RUN npm install
RUN npm install pm2 -y -g 
CMD ["/bin/sh", "start.sh"]
