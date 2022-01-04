#!/bin/bash

cont=$(docker run -d -t -v "$@")
code=$(timeout 10s docker wait "$cont" || true)
docker kill $cont &> /dev/null

if [ -z "$code" ]; then
    echo "timeout reached"
    docker rm $cont &> /dev/null
    exit 255
fi

docker logs $cont
docker rm $cont &> /dev/null
exit $code