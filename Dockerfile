# FROM node:13.12-alpine

# WORKDIR /usr/src/app

# COPY ["package.json", "package-lock.json*", "./"]
# RUN npm install --production=false --silent
# COPY . .


# RUN npm run build
# CMD [ "npm", "start" ]

# EXPOSE 8000
FROM node:13.12-alpine AS builder
WORKDIR /
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

FROM node:13.12-alpine 
WORKDIR /
COPY --from=builder /dist ./dist
COPY package*.json ./
RUN npm install --production --silent

WORKDIR /dist

CMD node index.js