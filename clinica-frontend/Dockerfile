FROM node:20-alpine

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código (en dev se sobreescribe con el volumen)
COPY . .

# Exponer el puerto por defecto de Vite
EXPOSE 5173

# Arrancar Vite, enlazándolo a 0.0.0.0 para que sea accesible desde el host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
