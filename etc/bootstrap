#!/bin/bash

cmd=$1

# Always run database migrations
npm run db:migrate

case $cmd in
    start)
        npm start
        ;;

    dev)
        npm run dev
        ;;
esac
