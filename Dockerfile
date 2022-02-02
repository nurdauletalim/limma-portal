FROM nginx:latest
#FROM openresty/openresty
RUN rm -rf /usr/share/nginx/html/*
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY ./dist/sapakz /usr/share/nginx/html

EXPOSE 80 443
