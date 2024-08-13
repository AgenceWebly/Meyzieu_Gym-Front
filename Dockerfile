# Base stage for common setup
FROM node:18-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Build stage with argument for configuration
FROM base AS builder
ARG CONFIGURATION
RUN npm run build --configuration="$CONFIGURATION"

# Development stage
FROM node:18-alpine AS dev
WORKDIR /usr/src/app
COPY . .

# Install all dependencies including devDependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "1000"]
EXPOSE 4200

# Production stage
FROM nginx:1.21-alpine AS prod

# Copy nginx configuration
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from the builder stage
COPY --link --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80