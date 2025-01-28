# Stage 1: Build the React App
FROM node:20.11.1-alpine3.19 AS build
# Set working directory
WORKDIR /app
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
# Set PATH to include node_modules binaries
ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_ENV=development
# Copy all other project files and run the build process
COPY . .
RUN npm run build
EXPOSE 3002

CMD ["npm", "start"]