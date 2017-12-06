#!/bin/bash
#set -e

service ssh start

if [ "${AUTHORIZED_KEYS}" != "**None**" ]; then
    echo "=> Found authorized keys"
    mkdir -p /root/.ssh
    chmod 700 /root/.ssh
    arr=$(echo ${AUTHORIZED_KEYS} | tr "," "\n")
    echo "=> Adding public key to /root/.ssh/authorized_keys: $arr"
    echo "$arr" >> /root/.ssh/authorized_keys
    chmod 600 /root/.ssh/authorized_keys
fi

if [ ! -f /.root_pw_set ]; then
    /set_root_pw.sh
fi

service mongod start
service mongod status
sleep 3

nohup /root/.nvm/versions/node/v9.2.0/bin/node /app/server/server.js >/dev/null 2>&1 &

while :; do
    # check your mongod server is running.
    ps -ef | grep mongod > /dev/null 2>&1
    err=$?
    if [ "0" != "$err" ]; then
        echo "your mongod server has stop, please restart it"
        service mongod restart
    fi

    #service mongod status
    # wait for 60 seconds
    sleep 60

    ps -ef | grep node | grep -v grep > /dev/null 2>&1
    err=$?
    echo "err is " $err
    if [ "0" != "$err" ]; then
        echo "your node has stop, please restart it"
        nohup /root/.nvm/versions/node/v9.2.0/bin/node /app/server/server.js >/dev/null 2>&1 &
    fi
done