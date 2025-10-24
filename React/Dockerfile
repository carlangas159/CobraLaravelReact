# Etapa de construcción
FROM node:18 AS builder

WORKDIR /app

# Copiar package.json e instalar dependencias de producción
COPY package*.json ./
RUN npm ci --silent

# Copiar el resto del proyecto y generar la build de producción (Vite -> dist)
COPY . .
RUN npm run build

# Etapa final: Nginx para servir archivos estáticos
FROM nginx:stable-alpine

# El build de Vite por defecto se crea en /app/dist
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (proxy para /api)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
