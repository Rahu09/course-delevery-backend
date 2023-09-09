export PATH="$PATH:/home/ubuntu/.nvm/versions/node/v20.6.1/bin"

cd /home/ubuntu/course-delevery-backend
pm2 start npm --name "cd" -- run "start"