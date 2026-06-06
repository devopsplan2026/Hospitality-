# Use Node.js 18 Alpine image for a lightweight container
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies without audit and funding info for faster build
RUN npm install --no-audit --no-fund

# Copy the rest of the application source code
COPY . .

# Run the build script to generate the production-ready static files
RUN npm run build

# Use Node.js 18 Alpine again for the runtime environment
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install the 'serve' package globally to serve static files
RUN npm install -g serve

# Copy the build output from the previous stage into this stage
COPY --from=0 /app/build ./build

# Expose port 3003 for the server
EXPOSE 3003

# Command to start the server and serve the static files
CMD ["serve", "-s", "build", "-l", "3003"]
