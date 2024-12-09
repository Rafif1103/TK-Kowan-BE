# Use the specified platform and Node.js base image
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18-alpine AS ship

# Install dependencies and add non-root user
RUN apk --no-cache add curl ca-certificates \
    && addgroup -S app && adduser -S -g app app

# Set working directory
WORKDIR /home/app

# Set npm to suppress verbose output
ENV NPM_CONFIG_LOGLEVEL warn

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all application files
COPY . .

# Set permissions for the app directory
RUN chown -R app:app /home/app && chmod 777 /tmp

# Switch to non-root user
USER app

# Expose port 8080
EXPOSE 80

# Start the Node.js application
CMD ["node", "index.js"]