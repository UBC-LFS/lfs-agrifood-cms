apk add nodejs
apk add nodejs-npm
apk add g++
apk add make
apk add python
cd my-site/
rm package-lock.json
cat <<EOF >.env
COOKIE_SECRET=0074de6842af2f854a35128e3b07fd222a02e204a72a18bc00cd0617a4549732926c7d71e08607d3ddc30ee45dc507e2b83cbb4afcb07bead35eb6da7779a8c3
EOF
npm install
node keystone
