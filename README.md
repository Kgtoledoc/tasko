# 🚀 Tasko - Aplicación de Gestión de Tiempo

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-gray.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-5.1.6-green.svg)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Tasko** es una aplicación web moderna y completa para la gestión eficiente de tareas y tiempo, diseñada para ayudar a usuarios a organizar sus actividades diarias, establecer prioridades y recibir notificaciones inteligentes.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Testing](#-testing)
- [API Endpoints](#-api-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap y Mejoras](#-roadmap-y-mejoras)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 🎯 Gestión de Tareas
- **Crear, editar y eliminar tareas** con interfaz intuitiva
- **Categorización** de tareas por prioridad y tipo
- **Estados de tareas**: pendiente, en progreso, completada
- **Fechas de vencimiento** con alertas visuales
- **Descripciones detalladas** para cada tarea

### 🔔 Sistema de Notificaciones
- **Notificaciones en tiempo real** para tareas próximas a vencer
- **Alertas de tareas vencidas** con recordatorios automáticos
- **Configuración personalizable** de horarios de notificación
- **Historial de notificaciones** con estado de lectura

### 📊 Dashboard Intuitivo
- **Vista general** de tareas pendientes y completadas
- **Estadísticas visuales** de productividad
- **Filtros avanzados** por estado, prioridad y fecha
- **Búsqueda rápida** de tareas

### 🎨 Interfaz Moderna
- **Diseño responsive** que funciona en todos los dispositivos
- **Tema claro/oscuro** (próximamente)
- **Animaciones suaves** y transiciones
- **Iconografía intuitiva** con Lucide React

## 🛠 Tecnologías

### Frontend
- **React 18.2.0** - Biblioteca de interfaz de usuario
- **TypeScript 4.9.5** - Tipado estático
- **React Router 6.20.0** - Enrutamiento
- **Tailwind CSS 3.3.0** - Framework de estilos
- **Axios 1.6.0** - Cliente HTTP
- **React Hot Toast 2.4.1** - Notificaciones
- **Lucide React 0.294.0** - Iconos
- **Date-fns 2.30.0** - Manipulación de fechas

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express 4.18.2** - Framework web
- **TypeScript 5.3.2** - Tipado estático
- **SQLite 5.1.6** - Base de datos
- **Node-cron 3.0.3** - Programación de tareas
- **UUID 9.0.1** - Generación de IDs únicos
- **Helmet 7.1.0** - Seguridad
- **CORS 2.8.5** - Cross-origin resource sharing

### Herramientas de Desarrollo
- **Nodemon** - Reinicio automático del servidor
- **TypeScript Compiler** - Compilación de TypeScript
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## 📸 Capturas de Pantalla

> *Las capturas de pantalla se agregarán próximamente*

## 🚀 Instalación

### Prerrequisitos
- **Node.js 18+** y npm
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Kgtoledoc/tasko.git
   cd tasko
   ```

2. **Instalar dependencias**
   ```bash
   # Instalar todas las dependencias (backend + frontend)
   npm run install:all
   ```

3. **Configurar variables de entorno**
   ```bash
   cd backend
   cp .env.example .env
   # Editar .env con tus configuraciones
   cd ..
   ```

## ⚙️ Configuración

### Variables de Entorno (Backend)

Crea un archivo `.env` en el directorio `backend/`:

```env
# Configuración del servidor
PORT=3001
NODE_ENV=development

# Configuración de la base de datos
DB_PATH=./database/tasko.db

# Configuración de notificaciones
NOTIFICATION_INTERVAL=5 # minutos
OVERDUE_CHECK_INTERVAL=10 # minutos

# Configuración de seguridad
CORS_ORIGIN=http://localhost:3000
```

### Configuración del Frontend

El frontend está configurado para conectarse al backend en `http://localhost:3001` por defecto. Puedes modificar esto en `frontend/package.json`:

```json
{
  "proxy": "http://localhost:3001"
}
```

## 🎯 Uso

### Desarrollo

1. **Iniciar la aplicación completa**
   ```bash
   # Iniciar backend y frontend simultáneamente
   npm run dev
   ```
   
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:3000`

2. **Iniciar servicios por separado**
   ```bash
   # Solo backend
   npm run dev:backend
   
   # Solo frontend
   npm run dev:frontend
   ```

### Producción

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Iniciar en producción**
   ```bash
   npm start
   ```

## 🧪 Testing

### Testing Rápido (Recomendado)

Para verificar que todo funciona correctamente:

```bash
# Ejecutar tests automatizados completos
npm run test:all
```

Este comando ejecutará:
- ✅ Verificación de servicios
- ✅ Tests de API endpoints
- ✅ Crear/editar/eliminar tareas
- ✅ Sistema de notificaciones
- ✅ Manejo de errores
- ✅ Rendimiento básico

### Testing Manual

#### 1. Verificar Servicios
```bash
# Backend
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3000
```

#### 2. Crear Tarea de Prueba
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera tarea",
    "description": "Descripción de prueba",
    "dueDate": "2024-12-25T10:00:00.000Z",
    "priority": "high",
    "status": "pending",
    "category": "work"
  }'
```

#### 3. Probar Interfaz Web
1. Abrir http://localhost:3000
2. Crear una tarea desde la interfaz
3. Editar la tarea
4. Cambiar su estado
5. Eliminar la tarea

### Testing Avanzado

```bash
# Tests del backend
npm run test:backend

# Tests del frontend
npm run test:frontend

# Todos los tests
npm run test
```

### Checklist de Funcionalidades

- [ ] **Gestión de Tareas**: Crear, editar, eliminar, cambiar estado
- [ ] **Filtros y Búsqueda**: Por estado, prioridad, texto
- [ ] **Dashboard**: Estadísticas y tareas recientes
- [ ] **Notificaciones**: Ver, marcar como leída, eliminar
- [ ] **Responsive Design**: Desktop, tablet, móvil

> 📖 **Para testing detallado, consulta [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md)**
> 
> ⚡ **Para inicio rápido, consulta [docs/QUICK_START.md](docs/QUICK_START.md)**

## 🔌 API Endpoints

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear nueva tarea
- `GET /api/tasks/:id` - Obtener tarea específica
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/status/:status` - Filtrar por estado
- `GET /api/tasks/overdue` - Obtener tareas vencidas

### Notificaciones
- `GET /api/notifications` - Obtener todas las notificaciones
- `GET /api/notifications/unread` - Obtener no leídas
- `PUT /api/notifications/:id/read` - Marcar como leída
- `PUT /api/notifications/read-all` - Marcar todas como leídas
- `DELETE /api/notifications/:id` - Eliminar notificación

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/recent` - Actividad reciente

> 📖 **Documentación completa de la API**: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

## 📁 Estructura del Proyecto

```
tasko/
├── backend/                 # Servidor API
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Lógica de negocio
│   │   ├── utils/          # Utilidades y configuración
│   │   └── index.ts        # Punto de entrada
│   ├── database/           # Archivos de base de datos
│   └── package.json
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios de API
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # Definiciones de tipos
│   │   ├── utils/         # Utilidades
│   │   └── App.tsx        # Componente principal
│   └── package.json
├── docs/                  # Documentación
├── scripts/               # Scripts de utilidad
├── .gitignore
└── README.md
```

## 🗺️ Roadmap y Mejoras

### 🚀 Próximas Funcionalidades

Tasko tiene un roadmap ambicioso con muchas mejoras planificadas:

#### Fase 1: Mejoras Críticas (Prioridad Alta)
- 🔐 **Sistema de autenticación** - Registro/login con JWT
- 🎨 **Tema oscuro/claro** - Mejora visual inmediata
- ⌨️ **Atajos de teclado** - Productividad instantánea
- 🔔 **Notificaciones push** - Engagement mejorado

#### Fase 2: Funcionalidades Avanzadas (Prioridad Media)
- 🏷️ **Sistema de etiquetas** - Organización mejorada
- ⏰ **Pomodoro Timer** - Productividad personal
- 📱 **PWA** - Experiencia móvil nativa
- 🔄 **Tareas recurrentes** - Automatización

#### Fase 3: Funcionalidades Premium (Prioridad Baja)
- 👥 **Colaboración** - Compartir tareas y equipos
- 📅 **Integración de calendario** - Google Calendar, Outlook
- 🔗 **Integraciones externas** - Slack, Discord, Zapier
- 📊 **Analytics avanzados** - Reportes y métricas

### ⚡ Quick Wins - Mejoras Rápidas

¿Quieres implementar mejoras rápidas de alto impacto? Consulta:

> 🎯 **[Quick Wins](docs/QUICK_WINS.md)** - Funcionalidades que puedes implementar en 1-5 días

**Recomendaciones para empezar:**
1. **Tema oscuro/claro** (1 día) - Impacto visual inmediato
2. **Atajos de teclado** (1 día) - Productividad instantánea
3. **Sistema de etiquetas** (3 días) - Organización escalable

### 📋 Roadmap Completo

Para ver todas las funcionalidades planificadas y el plan de implementación:

> 🗺️ **[Roadmap Completo](docs/ROADMAP.md)** - Todas las mejoras y nuevas funcionalidades

### 🎯 Contribuir a las Mejoras

¿Tienes ideas para nuevas funcionalidades? ¡Nos encantaría escucharlas!

- 📝 **Crear un issue** con tu propuesta
- 🔧 **Implementar una mejora** y hacer pull request
- 💡 **Sugerir mejoras** en las discusiones

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, lee nuestra [guía de contribución](CONTRIBUTING.md) antes de enviar un pull request.

### Cómo Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Reportar Bugs

Si encuentras un bug, por favor crea un issue con:
- Descripción detallada del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Información del sistema

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de interfaz de usuario
- [Express](https://expressjs.com/) - Framework web
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Lucide](https://lucide.dev/) - Iconos
- [SQLite](https://www.sqlite.org/) - Base de datos

## 📞 Contacto

- **Desarrollador**: Kevin Toledo
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [@Kgtoledoc](https://github.com/Kgtoledoc)

---

⭐ **Si este proyecto te ayuda, ¡dale una estrella en GitHub!** 