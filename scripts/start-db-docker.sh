#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd DIR

docker run -it --rm --name commander-a-la-ferme-pg -p 5432:5432 -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=commander-a-la-ferme -v ~/db/postgres/data:/var/lib/postgresql/data postgres:12