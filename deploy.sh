#!/bin/bash
export PATH="$PATH:/home/ubuntu/.nvm/versions/node/v20.6.1/bin"

cd /home/ubuntu/course-delevery-backend
git pull origin main
yarn install
yarn build
pm2 stop cd
pm2 start cd
# pm2 start npm --name "cd" -- run "start"
