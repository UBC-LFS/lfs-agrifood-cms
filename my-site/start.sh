#!/bin/bash

pm2 delete keystone

cd my-site

source .env

npm install
# node keystone
pm2 -f start keystone.js