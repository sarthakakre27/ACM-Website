#!/bin/bash

cont=$(docker run -d -t -v "$@")
code=$(timeout 3s docker wait "$cont" || true)

docker kill $cont &> /dev/null

if [ -z "$code" ]; then
    code=$("timeout")
fi

# echo output:
docker logs $cont
docker rm $cont &> /dev/null

exit $code