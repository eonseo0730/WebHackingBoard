FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN mkdir -p data && printf '%s\n' \
'{' \
'  "users": [ { "username": "guest", "password": "guest" } ],' \
'  "posts": [],' \
'  "nextPostId": 1' \
'}' > data/db_json

EXPOSE 3000

CMD ["node","app.js"]