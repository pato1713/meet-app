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
CMD ["npm", "run", "start"]

# ---------------------------------------
# Production stage
# ---------------------------------------
FROM node:18 AS production

WORKDIR /node

COPY package*.json tsconfig.json ./

# Default build argument is dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "start"]