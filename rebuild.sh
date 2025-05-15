git pull
pnpm install
pnpm build
pm2 delete python-string-viewer
pm2 start "pnpm run start" --name python-string-viewer
# pm2 start serve --name kernel-viewer -- -s out -l 3001
pm2 save
sudo systemctl restart nginx
