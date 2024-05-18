# Use the Debian Bullseye base image
FROM debian:11

# Update the package list and install required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    python3 \
    npm

# Expose port if necessary
EXPOSE 80
EXPOSE 4200

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs


RUN npm install -g yarn

RUN yarn install

RUN npm install -g @angular/cli

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app



# Entry point or CMD to start your Angular application
# CMD ["ng", "serve", "--host", "0.0.0.0"]
