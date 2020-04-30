# https://mherman.org/blog/dockerizing-a-react-app/#docker
FROM node:10.20.0-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

# https://stackoverflow.com/a/52196681/2888763
RUN npm config set unsafe-perm true
RUN npm ci
RUN npm install react-scripts@3.4.0 -g

COPY . ./
RUN npm run build

FROM nginx:stable

COPY --from=build /app/build /usr/share/nginx/html

# https://github.com/Waltari10/proxy-tutorial-frontend/blob/master/Dockerfile
# Copy our configuration file to a folder in our Docker image where Nginx will use it
COPY default.conf.template /etc/nginx/conf.d/default.conf.template

# Configure Nginx for Heroku
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'

EXPOSE $PORT

