# Tasko - Aplicación de Gestión de Tareas

Tasko es una aplicación completa de manejo de tiempo y notificaciones de tareas, construida con tecnologías modernas para ofrecer una experiencia de usuario excepcional.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Gestión de Tareas**: Crear, editar, eliminar y organizar tareas
- **Sistema de Prioridades**: Clasificar tareas por prioridad (baja, media, alta)
- **Estados de Tareas**: Seguimiento del progreso (pendiente, en progreso, completada)
- **Fechas Límite**: Establecer fechas de vencimiento para las tareas
- **Categorización**: Organizar tareas por categorías
- **Recordatorios**: Configurar notificaciones automáticas
- **Dashboard Interactivo**: Vista general con estadísticas y resumen

### 🔔 Sistema de Notificaciones
- **Notificaciones Automáticas**: Recordatorios de tareas próximas a vencer
- **Alertas de Vencimiento**: Notificaciones para tareas vencidas
- **Gestión de Notificaciones**: Marcar como leídas, eliminar, filtrar
- **Notificaciones en Tiempo Real**: Sistema de cron jobs para verificación automática

### 📱 Interfaz de Usuario
- **Diseño Responsivo**: Funciona perfectamente en desktop, tablet y móvil
- **Interfaz Moderna**: Diseño limpio y profesional con Tailwind CSS
- **Navegación Intuitiva**: Menú lateral y navegación clara
- **Filtros Avanzados**: Búsqueda y filtrado por múltiples criterios

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **TypeScript**
- **Express.js** para el servidor web
- **SQLite** como base de datos
- **node-cron** para tareas programadas
- **Helmet** para seguridad
- **CORS** para comunicación entre frontend y backend

### Frontend
- **React** con **TypeScript**
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones
- **Axios** para comunicación con la API

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd tasko
   ```

2. **Instalar dependencias**
   ```bash
   npm run install:all
   ```

3. **Configurar variables de entorno**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Editar el archivo `.env` según tus necesidades:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Ejecutar la aplicación**
   ```bash
   # Desde la raíz del proyecto
   npm run dev
   ```

## 🚀 Uso

### Comandos Disponibles

```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar en modo desarrollo (backend + frontend)
npm run dev

# Ejecutar solo el backend
npm run dev:backend

# Ejecutar solo el frontend
npm run dev:frontend

# Construir para producción
npm run build

# Construir solo el backend
npm run build:backend

# Construir solo el frontend
npm run build:frontend

# Ejecutar en producción
npm start
```

### Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📚 API Endpoints

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/status/:status` - Filtrar por estado
- `GET /api/tasks/overdue` - Obtener tareas vencidas
- `GET /api/tasks/reminders` - Obtener tareas con recordatorios

### Notificaciones
- `GET /api/notifications` - Obtener todas las notificaciones
- `GET /api/notifications/unread` - Obtener notificaciones no leídas
- `PUT /api/notifications/:id/read` - Marcar como leída
- `PUT /api/notifications/read-all` - Marcar todas como leídas
- `DELETE /api/notifications/:id` - Eliminar notificación
- `GET /api/notifications/count` - Obtener conteo de notificaciones

## 🏗️ Estructura del Proyecto

```
tasko/
├── backend/                 # Servidor Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Rutas de la API
│   │   ├── services/        # Servicios de negocio
│   │   ├── utils/           # Utilidades y configuración
│   │   └── index.ts         # Punto de entrada del servidor
│   ├── data/                # Base de datos SQLite
│   └── package.json
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios de API
│   │   ├── types/           # Definiciones de TypeScript
│   │   ├── utils/           # Utilidades del frontend
│   │   ├── App.tsx          # Componente principal
│   │   └── index.tsx        # Punto de entrada
│   └── package.json
└── package.json             # Scripts del proyecto
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_PATH=./data/tasko.db
NOTIFICATION_CHECK_INTERVAL=60000
NOTIFICATION_CLEANUP_DAYS=30
```

### Base de Datos

La aplicación utiliza SQLite como base de datos, que se crea automáticamente en `backend/data/tasko.db`. Las tablas se crean automáticamente al iniciar el servidor.

## 🎨 Personalización

### Colores y Temas

Los colores se pueden personalizar editando el archivo `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  },
  // ...
}
```

### Estilos CSS

Los estilos personalizados se encuentran en `frontend/src/index.css` y utilizan las clases de utilidad de Tailwind CSS.

## 🚀 Despliegue

### Producción

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Configurar variables de entorno de producción**
   ```bash
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://tu-dominio.com
   ```

3. **Ejecutar el servidor**
   ```bash
   npm start
   ```

### Docker (Opcional)

```dockerfile
# Dockerfile para el backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o necesitas ayuda:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

- [ ] Autenticación de usuarios
- [ ] Sincronización en tiempo real
- [ ] Aplicación móvil nativa
- [ ] Integración con calendarios
- [ ] Reportes y analytics
- [ ] Exportación de datos
- [ ] Temas personalizables
- [ ] Integración con servicios externos

---

**Tasko** - Organiza tu tiempo, maximiza tu productividad 🚀 