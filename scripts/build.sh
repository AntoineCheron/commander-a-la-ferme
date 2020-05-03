#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd DIR

npm run build
cd client
npm install
npm run build
rm -rf node_modules
