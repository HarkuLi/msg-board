FROM ubuntu
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g -y nodemon
RUN mkdir /msgBoard
WORKDIR /msgBoard
CMD ["npm", "start"]
EXPOSE 3000