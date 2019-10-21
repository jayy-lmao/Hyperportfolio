#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
    echo "Migrating..."

    python /usr/src/app/manage.py migrate
    python /usr/src/app/manage.py loaddata /usr/src/app/users/data/auth.json
    python /usr/src/app/manage.py loaddata /usr/src/app/portfolios/data/transactiontype.json

    PGPASSWORD=$SQL_PASSWORD psql \
      -h $SQL_HOST \
      -d $SQL_DATABASE \
      -U $SQL_USER \
      -f /sql/CreateViews.sql
    # TODO: Add a superuser fixture


    echo "=====================================\n Migrating done!!\n====================================="
fi

python3 /usr/src/app/manage.py jenkins --enable-coverage

# python3 manage.py runserver

# pipenv run python3 manage.py runserver

gunicorn stocks_django.wsgi:application \
  --bind 0.0.0.0:8000  \
  --access-logfile - \
  --threads=4 \
  --worker-class=gthread \
  -w $(( 2 * `cat /proc/cpuinfo | grep 'core id' | wc -l` + 1 ))

#
# exec "$@"
