FROM node:20-alpine AS builder

WORKDIR /app

# Define build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_APP_NAME
ARG VITE_APP_TAGLINE
ARG VITE_APP_PRIMARY_COLOR
ARG VITE_APP_SECONDARY_COLOR

# Set them as ENV for the build process
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_TAGLINE=$VITE_APP_TAGLINE
ENV VITE_APP_PRIMARY_COLOR=$VITE_APP_PRIMARY_COLOR
ENV VITE_APP_SECONDARY_COLOR=$VITE_APP_SECONDARY_COLOR

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# Use custom nginx config for SPA routing and websocket proxy if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
