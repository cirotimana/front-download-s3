# React Downloader App - Despliegue con Docker

Aplicación React para descarga de archivos desde recaudadores, dockerizada y lista para producción.

## 📋 Requisitos Previos

- Docker instalado (versión 20.10+)
- Docker Compose instalado (versión 1.29+)
- Git instalado

## 🚀 Instrucciones de Despliegue

### 1. Clonar el repositorio en el servidor

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
nano .env
```

Edita el archivo `.env` con tus credenciales:

```env
VITE_API_KEY=tu_api_key_real
VITE_API_BASE_URL=http://tu-backend-real.com
```

### 3. Construir y levantar el contenedor

```bash
# Construir la imagen
docker-compose build

# Levantar el contenedor
docker-compose up -d
```

### 4. Verificar que está funcionando

```bash
# Ver logs
docker-compose logs -f

# Verificar contenedores activos
docker ps
```

Accede a: `http://192.168.21.41:3030`

## 🔧 Comandos Útiles

### Detener la aplicación
```bash
docker-compose down
```

### Reiniciar la aplicación
```bash
docker-compose restart
```

### Ver logs en tiempo real
```bash
docker-compose logs -f react-app
```

### Reconstruir después de cambios
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Limpiar recursos de Docker
```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune -a
```

## 📦 Actualizar la Aplicación

```bash
# En el servidor
cd tu-repo
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Notas de Seguridad

- **Nunca subas el archivo `.env` a GitHub**
- Agrega `.env` a tu `.gitignore`
- Configura las variables de entorno directamente en el servidor

## 🐛 Troubleshooting

### Puerto 3030 ya está en uso
```bash
# Ver qué está usando el puerto
sudo lsof -i :3030

# O cambiar el puerto en docker-compose.yml
ports:
  - "3031:3030"  # Usar puerto 3031 en su lugar
```

### Problemas de permisos
```bash
# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### La aplicación no carga
```bash
# Verificar logs detallados
docker logs react-downloader-app

# Verificar conectividad
curl http://192.168.21.41:3030
```

## 📱 Estructura del Proyecto

```
.
├── src/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .dockerignore
├── .env.example
├── .gitignore
└── README.md
```

## 🌐 Acceso

- **Desarrollo local**: `http://localhost:3030`
- **Servidor**: `http://192.168.21.41:3030`

---

**Nota**: Asegúrate de que el firewall del servidor permita conexiones en el puerto 3030.