# 📚 Documentación de la API - Tasko

## 📋 Información General

- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **Autenticación**: No requerida (por ahora)

## 🔌 Endpoints

### Tareas (Tasks)

#### Obtener todas las tareas
```http
GET /api/tasks
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid-string",
    "title": "Completar documentación",
    "description": "Finalizar la documentación del proyecto",
    "dueDate": "2024-01-15T10:00:00.000Z",
    "priority": "high",
    "status": "pending",
    "category": "work",
    "reminderTime": "2024-01-15T09:00:00.000Z",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
]
```

#### Crear nueva tarea
```http
POST /api/tasks
```

**Cuerpo de la petición:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "dueDate": "2024-01-20T10:00:00.000Z",
  "priority": "medium",
  "status": "pending",
  "category": "personal",
  "reminderTime": "2024-01-20T09:00:00.000Z"
}
```

**Campos requeridos:**
- `title` (string): Título de la tarea
- `description` (string): Descripción de la tarea
- `dueDate` (string): Fecha de vencimiento (ISO 8601)
- `priority` (string): Prioridad ("low", "medium", "high")
- `status` (string): Estado ("pending", "in-progress", "completed")
- `category` (string): Categoría de la tarea
- `reminderTime` (string, opcional): Hora del recordatorio (ISO 8601)

**Respuesta exitosa (201):**
```json
{
  "id": "uuid-string",
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "dueDate": "2024-01-20T10:00:00.000Z",
  "priority": "medium",
  "status": "pending",
  "category": "personal",
  "reminderTime": "2024-01-20T09:00:00.000Z",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

#### Obtener tarea específica
```http
GET /api/tasks/:id
```

**Parámetros:**
- `id` (string): ID único de la tarea

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-string",
  "title": "Completar documentación",
  "description": "Finalizar la documentación del proyecto",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "priority": "high",
  "status": "pending",
  "category": "work",
  "reminderTime": "2024-01-15T09:00:00.000Z",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

**Respuesta de error (404):**
```json
{
  "error": "Tarea no encontrada"
}
```

#### Actualizar tarea
```http
PUT /api/tasks/:id
```

**Parámetros:**
- `id` (string): ID único de la tarea

**Cuerpo de la petición:**
```json
{
  "title": "Tarea actualizada",
  "status": "completed",
  "priority": "high"
}
```

**Campos opcionales:**
- `title` (string): Título de la tarea
- `description` (string): Descripción de la tarea
- `dueDate` (string): Fecha de vencimiento (ISO 8601)
- `priority` (string): Prioridad ("low", "medium", "high")
- `status` (string): Estado ("pending", "in-progress", "completed")
- `category` (string): Categoría de la tarea
- `reminderTime` (string): Hora del recordatorio (ISO 8601)

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-string",
  "title": "Tarea actualizada",
  "description": "Descripción de la tarea",
  "dueDate": "2024-01-20T10:00:00.000Z",
  "priority": "high",
  "status": "completed",
  "category": "personal",
  "reminderTime": "2024-01-20T09:00:00.000Z",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T09:00:00.000Z"
}
```

#### Eliminar tarea
```http
DELETE /api/tasks/:id
```

**Parámetros:**
- `id` (string): ID único de la tarea

**Respuesta exitosa (200):**
```json
{
  "message": "Tarea eliminada exitosamente"
}
```

#### Filtrar tareas por estado
```http
GET /api/tasks/status/:status
```

**Parámetros:**
- `status` (string): Estado de las tareas ("pending", "in-progress", "completed")

**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid-string",
    "title": "Tarea pendiente",
    "status": "pending",
    // ... otros campos
  }
]
```

#### Obtener tareas vencidas
```http
GET /api/tasks/overdue
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid-string",
    "title": "Tarea vencida",
    "dueDate": "2024-01-05T10:00:00.000Z",
    "status": "pending",
    // ... otros campos
  }
]
```

### Notificaciones (Notifications)

#### Obtener todas las notificaciones
```http
GET /api/notifications
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid-string",
    "taskId": "task-uuid",
    "type": "reminder",
    "message": "Tarea 'Completar documentación' vence en 1 hora",
    "isRead": false,
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
]
```

#### Obtener notificaciones no leídas
```http
GET /api/notifications/unread
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "uuid-string",
    "taskId": "task-uuid",
    "type": "reminder",
    "message": "Tarea 'Completar documentación' vence en 1 hora",
    "isRead": false,
    "createdAt": "2024-01-10T08:00:00.000Z"
  }
]
```

#### Marcar notificación como leída
```http
PUT /api/notifications/:id/read
```

**Parámetros:**
- `id` (string): ID único de la notificación

**Respuesta exitosa (200):**
```json
{
  "id": "uuid-string",
  "taskId": "task-uuid",
  "type": "reminder",
  "message": "Tarea 'Completar documentación' vence en 1 hora",
  "isRead": true,
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

#### Marcar todas las notificaciones como leídas
```http
PUT /api/notifications/read-all
```

**Respuesta exitosa (200):**
```json
{
  "message": "3 notificaciones marcadas como leídas"
}
```

#### Eliminar notificación
```http
DELETE /api/notifications/:id
```

**Parámetros:**
- `id` (string): ID único de la notificación

**Respuesta exitosa (200):**
```json
{
  "message": "Notificación eliminada exitosamente"
}
```

### Dashboard

#### Obtener estadísticas del dashboard
```http
GET /api/dashboard/stats
```

**Respuesta exitosa (200):**
```json
{
  "totalTasks": 25,
  "pendingTasks": 10,
  "inProgressTasks": 5,
  "completedTasks": 10,
  "overdueTasks": 3,
  "totalNotifications": 15,
  "unreadNotifications": 5,
  "completionRate": 40.0
}
```

#### Obtener actividad reciente
```http
GET /api/dashboard/recent
```

**Respuesta exitosa (200):**
```json
{
  "recentTasks": [
    {
      "id": "uuid-string",
      "title": "Tarea reciente",
      "status": "completed",
      "updatedAt": "2024-01-10T09:00:00.000Z"
    }
  ],
  "recentNotifications": [
    {
      "id": "uuid-string",
      "message": "Tarea completada",
      "createdAt": "2024-01-10T09:00:00.000Z"
    }
  ]
}
```

## 🔧 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos de entrada inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error interno del servidor |

## 📝 Ejemplos de Uso

### Crear una tarea con recordatorio
```javascript
const response = await fetch('http://localhost:3001/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Reunión de equipo',
    description: 'Revisar progreso del proyecto',
    dueDate: '2024-01-15T14:00:00.000Z',
    priority: 'high',
    status: 'pending',
    category: 'work',
    reminderTime: '2024-01-15T13:30:00.000Z'
  })
});

const task = await response.json();
console.log('Tarea creada:', task);
```

### Obtener tareas pendientes
```javascript
const response = await fetch('http://localhost:3001/api/tasks/status/pending');
const pendingTasks = await response.json();
console.log('Tareas pendientes:', pendingTasks);
```

### Marcar notificación como leída
```javascript
const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
  method: 'PUT'
});
const updatedNotification = await response.json();
console.log('Notificación actualizada:', updatedNotification);
```

## 🚨 Manejo de Errores

### Formato de Error
```json
{
  "error": "Mensaje de error descriptivo",
  "details": "Detalles adicionales del error (opcional)",
  "timestamp": "2024-01-10T08:00:00.000Z"
}
```

### Errores Comunes

#### 400 - Bad Request
- Datos de entrada faltantes o inválidos
- Formato de fecha incorrecto
- Valores de enum no válidos

#### 404 - Not Found
- ID de tarea o notificación no existe
- Endpoint no encontrado

#### 500 - Internal Server Error
- Error de base de datos
- Error interno del servidor

## 🔒 Seguridad

### Headers de Seguridad
La API incluye los siguientes headers de seguridad:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Validación de Entrada
- Todos los campos de entrada son validados
- Sanitización de datos para prevenir inyección
- Validación de tipos de datos

## 📊 Rate Limiting

Actualmente no hay límites de tasa implementados, pero se recomienda:
- Máximo 100 requests por minuto por IP
- Máximo 1000 requests por hora por IP

## 🔄 Webhooks (Futuro)

En futuras versiones se implementarán webhooks para:
- Notificaciones en tiempo real
- Sincronización con servicios externos
- Integración con calendarios

---

📖 **Para más información, consulta el [README principal](../README.md)** 