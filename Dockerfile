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
COPY ./apps/server/package.json ./

# Copy the pnpm-lock.yaml file from the local directory to /app in the container
COPY pnpm-lock.yaml ./

# Install dependencies listed in package.json using Yarn
RUN pnpm install

# Copy all files from the local ./app directory to /app in the container
COPY ./app .

# Build the project using Yarn
RUN pnpm build

# Generate database migrations
RUN pnpm db:generate

# Run database migrations
RUN pnpm db:migrate

# Expose port 3000 to allow communication with services outside of the container
EXPOSE 3000

# Define the default command to start the application when the container starts
CMD [ "node", "dist/index.cjs" ]
