FROM php:8.3-cli

# Instalar dependencias del sistema y extensiones de PHP necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Obtener e instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar el código del proyecto al contenedor (útil para producción)
# En desarrollo local usamos un volumen, pero es buena práctica tenerlo
COPY . .

# Exponer el puerto por defecto de artisan serve
EXPOSE 8000

# Comando por defecto para iniciar el servidor de desarrollo
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
