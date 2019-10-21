 
![](docs/images/hyperportfolio_gh.jpg)



Built by **Mujeok Coderz** for *UNSW Capstone project*

![Build Status](https://travis-ci.com/unsw-cse-comp3900-9900/capstone-project-mujeok_coderz.svg?token=3r5G2uou25xnFnDvhz79&branch=master)

## Usage

~~~For the best experience of using the app, we recommend visiting our website, formerly hosted on AWS.

**Website** can be found on:

[http://hyperportfol.io](http://hyperportfol.io/)

Registration only requires address of `[A-z]@[A-z].[A-z]`, and will not be verified. (This is in part to avoid our storage of peoples emails for a educational site)~~

Site is no longer hosted, but can be run locally if given a rapidAPI key.


## Development

There are a number of environment variables  which must be set. 

### Local Development

**Requirements**: docker, docker-compose, a stable internet connection.

When developing locally, it is recommended you store your *server* environment variables in a `.env` file within the `src/` directory.

```sh
DEBUG=0
SECRET_KEY=<you can choose your own secure key>
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=stocks_django_prod
SQL_USER=stocks_django
SQL_PASSWORD=stocks_django
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
RAPID_API_KEY=<Send an email to Mujeok Coderz to request this>
```

Most of these variables don't need to be secure for local development; however RapidAPI is a service which can be abused. If you choose to provide your own RapidAPI key then keep it secure; if you want to use ours for assessing the program please send us an email.



The site can be hosted locally using `docker-compose` up inside of the `src/` folder.



```sh
$ docker-compose up
Starting src_db_1 ... 
Starting src_nginx_1 ... 
```


Once `docker-compose` has it fully built and loaded, you will be able to access the site at `http://localhost:3001`.



Code commenting and documentation for the React front-end is automatically built into document which can be accessed here: [**React Documentation**](https://docs-hyperportfolio.netlify.com/)

![Documentation Status](https://docs-hyperportfolio.netlify.com/badge.svg) [![Netlify Status](https://api.netlify.com/api/v1/badges/2623d731-a56d-4a7d-b932-1900b12c2cf5/deploy-status)](https://app.netlify.com/sites/docs-hyperportfolio/deploys)


## Technology

**Reverse Proxy**: Nginx  
**Client/Frontend**: React   
**Server/Backend**: Django (Restful API)   
**DB**: Postgresql  
**Testing**: Cypress   
**Deployment**: AWS   



## Media



## UX: Demonstration of the site in action

[![hyperportfolio user video](https://img.youtube.com/vi/HQH3R_z0vAQ/0.jpg)](https://www.youtube.com/watch?v=HQH3R_z0vAQ)



### Devops: How our site is deployed from Master.

[![hyperportfolio devops video](https://img.youtube.com/vi/SV1-5yFzgKw/0.jpg)](https://www.youtube.com/watch?v=SV1-5yFzgKw)

