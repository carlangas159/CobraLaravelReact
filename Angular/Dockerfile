# Etapa de build: instalar dependencias y generar build de producción
FROM node:18 AS builder
WORKDIR /app

# Copiar package.json y package-lock.json si existen
COPY package*.json ./

# Instalar Angular CLI globalmente para poder construir si se requiere
RUN npm ci --silent || npm install --no-audit --no-fund --silent

# Copiar el resto del proyecto y construir (si el proyecto no existe, la build fallará y se debe scaffoldear)
COPY . .

# Si existe script de build en package.json, ejecutar
RUN if [ -f package.json ]; then npm run build --if-present; fi

# Etapa final: servir con Nginx
FROM nginx:stable-alpine

# Copiar build al directorio que sirve Nginx
# Copiar contenido de /app/dist (cualquier carpeta dentro) al html de nginx
COPY --from=builder /app/dist/* /usr/share/nginx/html/

# Copiar configuración nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
