#!/bin/bash

cont=$(docker run -d -t -v "$@")
code=$(timeout 10s docker wait "$cont" || true)
docker kill $cont &>/dev/null

if [ -z "$code" ]; then
    echo "timeout reached"
    docker rm $cont &>/dev/null
    exit 255
fi

docker logs $cont | sed 's/\x1b\[[0-9;]*m//g' | sed 's/\x1b\[K//g'
docker rm $cont &>/dev/null
exit $code
