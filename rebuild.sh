git pull
pnpm install
pnpm build
pm2 delete python-string-viewer
# pm2 start "pnpm run start" --name python-string-viewer
pm2 start pnpm --name python-string-viewer -- start
# pm2 start serve --name kernel-viewer -- -s out -l 3001
pm2 save
sudo systemctl restart nginx

# debug
# pm2 logs python-string-viewer --lines 20 | cat
# systemctl status nginx | cat
# ls -la /etc/nginx/sites-enabled/ | cat
# netstat -tlnp | grep 3002 | cat
# ping -c 3 python-string-viewer.mlsys.dev | cat
# ping -c 3 -4 python-string-viewer.mlsys.dev | cat # 使用ipv4
# tail -n 20 /var/log/nginx/python-string-viewer.error.log | cat
# curl -I http://localhost:3002
# curl -s ifconfig.me
# curl -I http://142.171.20.179:3002
# 