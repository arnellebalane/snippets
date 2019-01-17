#!/bin/bash

migrated=false

while [ $migrated = false ]; do
    npm run db:migrate
    if [ $? = 0 ]; then
        migrated=true
    else
        sleep 1
    fi
done

npm start
