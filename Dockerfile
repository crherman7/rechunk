##############################################################
# build image at root of repository for yarn.lock context
# command:
# docker build -f app/Dockerfile . -t rechunk
##############################################################

# Use the latest Node.js image as the base image
FROM node:20-alpine3.18

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json file from the local directory to /app in the container
COPY ./app/package.json ./

# Copy the yarn.lock file from the local directory to /app in the container
COPY yarn.lock ./

# Install dependencies listed in package.json using Yarn
RUN yarn install

# Copy all files from the local ./app directory to /app in the container
COPY ./app .

# Build the project using Yarn
RUN yarn build

# Generate database migrations
RUN yarn db:generate

# Run database migrations
RUN yarn db:migrate

# Expose port 3000 to allow communication with services outside of the container
EXPOSE 3000

# Define the default command to start the application when the container starts
CMD [ "node", "dist/index.cjs" ]
