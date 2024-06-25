# This file is a template, and might need editing before it works on your project.
FROM 883424753239.dkr.ecr.ap-northeast-2.amazonaws.com/apne2-devops-base-nodejs:20.11.1-alpine3.19 as build

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# app dependencies
# 컨테이너 내부로 package.json 파일들을 복사
COPY package*.json ./

# package.json 및 package-lock.json 파일에 명시된 의존성 패키지들을 설치
RUN npm install

# RUN yarn

# 호스트 머신의 현재 디렉토리 파일들을 컨테이너 내부로 전부 복사
COPY . .

# ARG name

# npm build
# RUN if [ "$ENV" = "qa" ]; then \
#       npm run staging; \         
#     else \
#       npm run product; \
#     fi
# RUN npm run staging
# RUN npm run build

# RUN npm run build
RUN npm run develop

# prod environment
FROM nginx:stable-alpine

# 이전 빌드 단계에서 빌드한 결과물을 /usr/share/nginx/html 으로 복사한다.
# COPY --from=build /app/build /usr/share/nginx/html
WORKDIR /app
# COPY ./dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

# 기본 nginx 설정 파일을 삭제한다. (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf

# custom 설정파일을 컨테이너 내부로 복사한다.
COPY nginx/nginx.conf /etc/nginx/conf.d

# 컨테이너의 80번 포트를 열어준다.
EXPOSE 80

# nginx 서버를 실행하고 백그라운드로 동작하도록 한다.
CMD ["nginx", "-g", "daemon off;"]
