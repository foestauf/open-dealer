###################
# BUILD FOR LOCAL DEVELOPMENT
###################
ARG DATABASE_URL

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN apk add --update --no-cache openssl1.1-compat

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV production

RUN npm ci --omit=dev && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

RUN apk add --update --no-cache openssl1.1-compat

RUN npx prisma generate

ENV DATABASE_URL=$DATABASE_URL
ENV PORT=${PORT:-80}

CMD [ "node", "dist/src/main.js" ]
