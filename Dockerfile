# Setting the base to nodejs 10.1.0
FROM node:10.5.0-alpine@sha256:92f749eb7f99240cad108616985696469484f680dd227af24241465f2d3a147f

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
