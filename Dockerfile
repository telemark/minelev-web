# Setting the base to nodejs 8.7.0
FROM node:8.7.0-alpine

# Maintainer
MAINTAINER Geir Gåsodden

#### Begin setup ####

# Installs git
RUN apk add --update --no-cache git

# Bundle app source
COPY . /src

# Change working directory
WORKDIR "/src"

# Install dependencies
RUN npm install --production

# Expose 8000
EXPOSE 8000

# Startup
ENTRYPOINT npm start
