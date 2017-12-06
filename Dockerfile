FROM hub.c.163.com/nasawz/cec
COPY . /app
COPY entrypoint.sh /entrypoint.sh
EXPOSE 6081