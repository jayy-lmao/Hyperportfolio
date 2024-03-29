# pull official base image
FROM python:3.7-alpine

# set work directory
WORKDIR /usr/src/app

# set environment varibles
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# install psycopg2
RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add postgresql \
    && apk add postgresql-dev \
    && pip install psycopg2 \
    && apk del build-deps \
    && apk add --update nodejs \
    && apk add --update nodejs-npm
  

# install nodejs and npm
# RUN apk add nodejs=10.14.2-r0 npm=10.14.2-r0

# install jshint, csslint
RUN npm install -g jshint@2.10.2
RUN npm install -g csslint@1.0.5

# install dependencies
RUN pip install --upgrade pip
RUN pip install pipenv
COPY ./Pipfile /usr/src/app/Pipfile
RUN pipenv install --skip-lock --system

COPY ./portfolios/sql/views/CreateViews.sql /sql/

# copy entrypoint.sh
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# copy project
COPY . /usr/src/app/
EXPOSE 8000

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
