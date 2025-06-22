# ⚡ Guía de Inicio Rápido - Tasko

## 🚀 Configuración en 5 Minutos

### 1. Instalar Dependencias
```bash
# Instalar todas las dependencias
npm run install:all
```

### 2. Configurar Variables de Entorno
```bash
# Backend
cd backend
cp .env.example .env
# Editar .env si es necesario
cd ..
```

### 3. Iniciar la Aplicación
```bash
# Iniciar backend y frontend simultáneamente
npm run dev
```

### 4. Verificar que Todo Funciona
```bash
# Ejecutar tests automatizados
npm run test:all
```

## 🧪 Testing Rápido de Funcionalidades

### Opción 1: Testing Automatizado (Recomendado)
```bash
# Ejecutar script de testing completo
./scripts/test-all.sh
```

Este script verificará automáticamente:
- ✅ Servicios corriendo
- ✅ API endpoints funcionando
- ✅ Crear/editar/eliminar tareas
- ✅ Sistema de notificaciones
- ✅ Filtros y búsqueda
- ✅ Manejo de errores
- ✅ Rendimiento básico

### Opción 2: Testing Manual Rápido

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

#### 3. Verificar Tarea Creada
```bash
curl http://localhost:3001/api/tasks
```

#### 4. Probar Frontend
1. Abrir http://localhost:3000
2. Crear una tarea desde la interfaz
3. Editar la tarea
4. Cambiar su estado
5. Eliminar la tarea

## 🎯 Checklist de Funcionalidades Básicas

### ✅ Gestión de Tareas
- [ ] Crear nueva tarea
- [ ] Editar tarea existente
- [ ] Cambiar estado (pendiente → en progreso → completada)
- [ ] Eliminar tarea
- [ ] Ver lista de tareas

### ✅ Filtros y Búsqueda
- [ ] Filtrar por estado
- [ ] Filtrar por prioridad
- [ ] Buscar por texto
- [ ] Limpiar filtros

### ✅ Dashboard
- [ ] Ver estadísticas
- [ ] Ver tareas recientes
- [ ] Navegar entre secciones

### ✅ Notificaciones
- [ ] Ver notificaciones
- [ ] Marcar como leída
- [ ] Marcar todas como leídas
- [ ] Eliminar notificación

### ✅ Responsive Design
- [ ] Funciona en desktop
- [ ] Funciona en tablet
- [ ] Funciona en móvil

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Iniciar solo backend
npm run dev:backend

# Iniciar solo frontend
npm run dev:frontend

# Iniciar ambos
npm run dev
```

### Testing
```bash
# Tests del backend
npm run test:backend

# Tests del frontend
npm run test:frontend

# Todos los tests
npm run test

# Testing completo automatizado
npm run test:all
```

### Build y Producción
```bash
# Construir para producción
npm run build

# Iniciar en producción
npm start
```

### Mantenimiento
```bash
# Limpiar node_modules
npm run clean

# Reinstalar todo
npm run reset
```

## 🐛 Solución de Problemas Comunes

### Error: Puerto en uso
```bash
# Verificar puertos
lsof -i :3000
lsof -i :3001

# Matar proceso si es necesario
kill -9 <PID>
```

### Error: Dependencias
```bash
# Reinstalar todo
npm run reset
```

### Error: Base de datos
```bash
# Eliminar base de datos y reiniciar
rm backend/database/tasko.db
cd backend && npm run dev
```

### Error: CORS
```bash
# Verificar configuración en backend/.env
CORS_ORIGIN=http://localhost:3000
```

## 📊 Verificación de Rendimiento

### Tiempo de Respuesta
```bash
# Medir tiempo de respuesta de la API
time curl http://localhost:3001/api/tasks
```

### Memoria y CPU
```bash
# Verificar uso de recursos
top -p $(pgrep -f "node.*backend")
top -p $(pgrep -f "node.*frontend")
```

## 🎉 ¡Listo!

Una vez que hayas completado el checklist, tu aplicación Tasko está funcionando correctamente.

### Próximos Pasos:
1. **Explorar la interfaz**: Prueba todas las funcionalidades manualmente
2. **Crear tareas reales**: Usa la aplicación para gestionar tus tareas
3. **Personalizar**: Modifica estilos o funcionalidades según tus necesidades
4. **Desplegar**: Sigue la guía de despliegue en `docs/DEPLOYMENT.md`

### Recursos Adicionales:
- 📖 [Documentación Completa](README.md)
- 🔌 [API Documentation](docs/API_DOCUMENTATION.md)
- 🎨 [Frontend Guide](docs/FRONTEND_GUIDE.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT.md)
- 🧪 [Testing Guide](docs/TESTING_GUIDE.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)

---

**¡Disfruta usando Tasko! 🚀** 