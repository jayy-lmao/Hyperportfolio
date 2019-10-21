# Docker-compose

This will be using postgres and is basically a simulation of production.

To run dev in docker-compose:
```bash
docker-compose up -d --build
```

To migrate the database
```bash
docker-compose exec web python manage.py migrate --noinput
```

Make sure when you are done with dev to shut down the docker-compose:
```bash
docker-compose down -v
```

For record `-v` is for deleting the 'volumes' used for storage by the docker container. This will wipe all contents of the database etc.

Nginx will be hosting the endpoints on port 80; it should be available on https://localhost.com/testpoint
