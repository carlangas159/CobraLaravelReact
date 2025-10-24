FROM php:8.1-cli

# Instalar dependencias del sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libicu-dev \
    libssl-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl opcache \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer (se copia el binario desde la imagen oficial de composer)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar el código de la aplicación
COPY . /var/www/html

# Copiar el entrypoint y darle permisos de ejecución
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ejecutar composer install (intenta pero no falla la construcción si ya hay vendor)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader || true

EXPOSE 8000

# Usar entrypoint para operaciones de arranque (migrations, composer, key)
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Iniciar el servidor de desarrollo de Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
