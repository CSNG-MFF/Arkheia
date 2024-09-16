# Dockerfile for React client

# Build react client
FROM node:alpine

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN npm install

# Install serve to run the app
RUN npm install -g serve

# copy local files to app folder
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build"]
