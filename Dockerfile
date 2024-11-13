# Stage 1: Build the React application
FROM node:18.20.3-slim AS build

WORKDIR /builddir

COPY package.json yarn.lock ./

RUN yarn

COPY . ./

RUN yarn build  
RUN ls /builddir
# 'yarn staging' 대신 'yarn build'로 변경

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /builddir/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /builddir/build /usr/share/nginx/html 


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
