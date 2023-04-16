# ---------------------------------------
# Development stage
# ---------------------------------------
FROM node:18 AS development
WORKDIR /node
COPY package*.json tsconfig.json ./
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
RUN npm install
WORKDIR /node/app
CMD ["npm", "start"]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM nginx:1.23.4 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n 18

WORKDIR /node
COPY package*.json tsconfig.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build

RUN rm -rf /usr/share/nginx/html/*
RUN mv dist/* /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]