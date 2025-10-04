FROM node:22-alpine

RUN apk add --no-cache ffmpeg

RUN addgroup discord && adduser -D -G discord discord-bot
 
USER discord-bot
 
WORKDIR /app

COPY --chown=discord-bot:discord package*.json ./
RUN npm ci --omit=dev

COPY --chown=discord-bot:discord dist ./dist
COPY --chown=discord-bot:discord music ./music

CMD ["node", "dist/index.cjs"]