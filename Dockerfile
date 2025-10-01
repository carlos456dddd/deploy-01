# Dockerfile
FROM node:18-alpine
WORKDIR /app

# Instalamos las 2 librerías que necesitamos SIN package.json
RUN npm install pg dotenv

# Copiamos nuestros archivos
COPY server.js ./
COPY public ./public

# Puerto que escuchará el contenedor
EXPOSE 8080
CMD ["node", "server.js"]