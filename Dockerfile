# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY frontend .
# This argument allows the host to pass the live backend URL during the build process
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve the files using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Expose standard web port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]