FROM node:16-alpine
WORKDIR /usr/app

# Install Bash
RUN apk add --no-cache --upgrade bash

# Install G++ and GCC
RUN apk add build-base

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Install Java 
RUN apk --no-cache add openjdk11
RUN apk add sed