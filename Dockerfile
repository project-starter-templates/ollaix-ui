ARG NODE_TAG=22-alpine

# Build stage
FROM node:$NODE_TAG AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for the build
ARG BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$BASE_URL

# Build the app
RUN npm run build

# Serve stage
FROM docker.io/nginx:alpine

# Create a non-root user to run nginx
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser

# Create app directory
RUN mkdir -p /app/www

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/www

# Copy nginx config template
COPY ./nginx/nginx.conf /etc/nginx/templates/default.conf.template

# Set correct ownership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    # Nginx needs to read and write to these directories
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

# Expose port (will be overridden by Render)
EXPOSE 80

# Tell nginx's template processing which variables to replace
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=80

# Switch to non-root user
USER webuser

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
