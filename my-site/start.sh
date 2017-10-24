#!/bin/bash

pm2 delete keystone

cd my-site

source .env

npm install
pm2 start my-site/keystone