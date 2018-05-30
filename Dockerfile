FROM node:8

ADD ./themes /app
WORKDIR /app

ENV PORT=8000 
EXPOSE 8000

CMD [ "npm", "run", "gulp" ]