# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple http server for serving static content
RUN npm install -g serve

# The application will run on port 3000
EXPOSE 3000

# Run the app
CMD ["serve", "-s", "build", "-l", "3000"]