FROM node:10.15

LABEL Ivashenko O.V.

RUN mkdir -p /BE

WORKDIR /BE

ADD ./ /BE
