# =====================================
# DOCKERFILE PARA PRODUCCIÓN
# Multi-stage build para optimizar tamaño
# =====================================

# Etapa 1: Build (compilación)
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias para compilación
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript a JavaScript
RUN npm run build

# =====================================
# Etapa 2: Producción (runtime)
FROM node:20-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Cambiar propietario de archivos al usuario nodejs
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Variables de entorno para producción
ENV NODE_ENV=production

# Comando de inicio optimizado para producción
CMD ["node", "dist/app.js"]


