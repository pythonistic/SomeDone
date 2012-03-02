#!/bin/bash
if [[ $EUID -ne 0 ]]; then
    echo 'Please run this as root or with sudo.  Exiting.'
    exit 1
fi

if [[ ! -e /etc/debian_version ]]; then
    echo 'This script is intended to be run on Debian hosts.  Exiting.'
    exit 1
fi

install () {
    dpkg -s $1 1> /dev/null 2> /dev/null
    if [ $? -eq 0 ]; then
        echo "$1 is installed"
    else
        aptitude install $1+
    fi
}

# install the packages
install curl
install nodejs
install nginx
install couchdb
install libnode-cradle
which npm 1> /dev/null
if [[ $? -ne 0 ]]; then
    curl http://npmjs.org/install.sh | sh
fi


# create the nginx configuration directory (if needed)
if [[ ! -d /etc/nginx ]]; then
    mkdir /etc/nginx
fi
cp conf/node_balancer.nginx /etc/nginx/

# create the application www directories
if [[ ! -d /var/www/somedone ]]; then
    mkdir -p /var/www/somedone
fi
cp -a www/* /var/www/somedone/
chmod -R 755 /var/www/somedone

# install the node libraries
if [[ ! -x node_modules/express/bin/express ]]; then
    npm install express
else
    echo "express is installed"
fi
if [[ ! -d node_modules/express-resource ]]; then
    npm install express-resource
else
    echo "express-resource is installed"
fi

# start the daemons
### test the coniguration file
nginx -t -c node_balancer.nginx