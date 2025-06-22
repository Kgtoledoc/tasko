# 🚀 Guía de Despliegue - Tasko

## 📋 Información General

Esta guía te ayudará a desplegar Tasko en diferentes plataformas y entornos de producción.

## 🎯 Opciones de Despliegue

### 1. Despliegue Completo (Recomendado)
- **Frontend**: Vercel, Netlify o GitHub Pages
- **Backend**: Railway, Render o Heroku
- **Base de datos**: SQLite (desarrollo) o PostgreSQL (producción)

### 2. Despliegue con Docker
- Contenedores Docker para frontend y backend
- Docker Compose para orquestación
- Base de datos PostgreSQL

### 3. Despliegue en VPS
- Servidor Ubuntu/Debian
- Nginx como proxy reverso
- PM2 para gestión de procesos

## 🌐 Despliegue en Plataformas Cloud

### Frontend - Vercel

#### 1. Preparar el proyecto
```bash
# En el directorio frontend
npm run build
```

#### 2. Configurar variables de entorno
Crear archivo `.env.production`:
```env
REACT_APP_API_URL=https://tu-backend.railway.app
```

#### 3. Desplegar en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

#### 4. Configuración en Vercel Dashboard
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Backend - Railway

#### 1. Preparar el proyecto
```bash
# En el directorio backend
npm run build
```

#### 2. Configurar variables de entorno
```env
NODE_ENV=production
PORT=3001
DB_PATH=./database/tasko.db
CORS_ORIGIN=https://tu-frontend.vercel.app
```

#### 3. Desplegar en Railway
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login y desplegar
railway login
railway init
railway up
```

#### 4. Configuración en Railway
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

### Alternativa: Render

#### 1. Conectar repositorio
- Conectar tu repositorio de GitHub
- Seleccionar el directorio `backend`

#### 2. Configurar build
```bash
# Build Command
npm install && npm run build

# Start Command
npm start
```

#### 3. Variables de entorno
```env
NODE_ENV=production
PORT=10000
DB_PATH=./database/tasko.db
CORS_ORIGIN=https://tu-frontend.vercel.app
```

## 🐳 Despliegue con Docker

### Dockerfile para Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "start"]
```

### Dockerfile para Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Servir con nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_PATH=./database/tasko.db
      - CORS_ORIGIN=http://localhost:3000
    volumes:
      - tasko-db:/app/database
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=tasko
      - POSTGRES_USER=tasko_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  tasko-db:
  postgres-data:
```

### Nginx Configuration
```nginx
# frontend/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### Comandos de Docker
```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🖥️ Despliegue en VPS

### 1. Configurar servidor Ubuntu

#### Actualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

#### Instalar dependencias
```bash
sudo apt install -y curl git nginx postgresql postgresql-contrib
```

#### Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Instalar PM2
```bash
sudo npm install -g pm2
```

### 2. Configurar PostgreSQL

#### Crear base de datos
```bash
sudo -u postgres psql

CREATE DATABASE tasko;
CREATE USER tasko_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE tasko TO tasko_user;
\q
```

### 3. Desplegar aplicación

#### Clonar repositorio
```bash
cd /var/www
sudo git clone https://github.com/tu-usuario/tasko.git
sudo chown -R $USER:$USER tasko
```

#### Configurar backend
```bash
cd tasko/backend
npm install
npm run build

# Crear archivo .env
cat > .env << EOF
NODE_ENV=production
PORT=3001
DB_PATH=./database/tasko.db
CORS_ORIGIN=https://tu-dominio.com
EOF
```

#### Configurar PM2
```bash
# Crear archivo ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'tasko-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Iniciar aplicación
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configurar Nginx

#### Configuración del sitio
```bash
sudo nano /etc/nginx/sites-available/tasko
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Frontend
    location / {
        root /var/www/tasko/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

#### Habilitar sitio
```bash
sudo ln -s /etc/nginx/sites-available/tasko /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Configurar SSL con Let's Encrypt

#### Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

#### Obtener certificado SSL
```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

#### Renovar automáticamente
```bash
sudo crontab -e
# Agregar línea:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configuración de Producción

### Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001
DB_PATH=./database/tasko.db
CORS_ORIGIN=https://tu-dominio.com
NOTIFICATION_INTERVAL=5
OVERDUE_CHECK_INTERVAL=10
```

#### Frontend (.env.production)
```env
REACT_APP_API_URL=https://tu-dominio.com/api
REACT_APP_ENVIRONMENT=production
```

### Optimizaciones de Rendimiento

#### Backend
```javascript
// Configuración de Express para producción
app.set('trust proxy', 1);
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
}));
```

#### Frontend
```javascript
// Optimizaciones de build
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

### Monitoreo y Logs

#### PM2 Monitoring
```bash
# Ver estadísticas
pm2 monit

# Ver logs
pm2 logs tasko-backend

# Reiniciar aplicación
pm2 restart tasko-backend
```

#### Nginx Logs
```bash
# Ver logs de acceso
sudo tail -f /var/log/nginx/access.log

# Ver logs de error
sudo tail -f /var/log/nginx/error.log
```

## 🔒 Seguridad

### Headers de Seguridad
```javascript
// backend/src/index.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP'
});

app.use('/api/', limiter);
```

### Validación de Entrada
```javascript
import { body, validationResult } from 'express-validator';

app.post('/api/tasks', [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('description').trim().isLength({ max: 500 }),
  body('dueDate').isISO8601(),
  body('priority').isIn(['low', 'medium', 'high']),
  body('status').isIn(['pending', 'in-progress', 'completed'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Procesar tarea
});
```

## 📊 Monitoreo y Analytics

### Health Check Endpoint
```javascript
// backend/src/routes/health.ts
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

### Logging
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Build
        run: |
          cd backend
          npm run build
          
      - name: Deploy to Railway
        uses: railway/deploy@v1
        with:
          service: backend
          token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 🆘 Troubleshooting

### Problemas Comunes

#### Error de CORS
```javascript
// Verificar configuración CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

#### Error de base de datos
```bash
# Verificar permisos de archivo
ls -la database/
chmod 755 database/
chmod 644 database/tasko.db
```

#### Error de puerto
```bash
# Verificar puerto en uso
sudo netstat -tulpn | grep :3001
sudo lsof -i :3001
```

#### Error de memoria
```bash
# Aumentar memoria para Node.js
export NODE_OPTIONS="--max-old-space-size=2048"
```

---

📖 **Para más información, consulta el [README principal](../README.md)** 