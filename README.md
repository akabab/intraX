##Install
Clone the repository: `git clone https://github.com/akabab/intraX.git`

Get project dependencies: `npm install` **/!\** do this inside your project folder

##Nginx
Copy the nginx.conf to nginx install directory: `cp nginx.conf ~/.brew/etc/nginx/nginx.conf`

**/!\** Change both `/PATH/TO/THE/APP/` with your own application path

Reload nginx `nginx -s reload` or start nginx `nginx`

## **/!\ WORK IN PROGRESS** APIARY API

http://docs.intrax.apiary.io/

##Git
push current branch with `git push` --> `git config --global push.default simple`
