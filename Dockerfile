# Use the official Node.js image with Alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the Next.js app for production
# RUN npm run build

# Expose the default port used by Next.js
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
