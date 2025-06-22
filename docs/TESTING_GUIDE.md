# 🧪 Guía de Testing - Tasko

## 📋 Información General

Esta guía te ayudará a probar todas las funcionalidades de Tasko de manera sistemática y completa.

## 🚀 Configuración Inicial

### 1. Preparar el Entorno

```bash
# Clonar y configurar el proyecto
git clone https://github.com/tu-usuario/tasko.git
cd tasko

# Instalar dependencias del backend
cd backend
npm install
cp .env.example .env

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 2. Configurar Variables de Entorno

```bash
# backend/.env
PORT=3001
NODE_ENV=development
DB_PATH=./database/tasko.db
CORS_ORIGIN=http://localhost:3000
NOTIFICATION_INTERVAL=5
OVERDUE_CHECK_INTERVAL=10
```

### 3. Iniciar Servicios

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔍 Testing Manual - Frontend

### 1. Dashboard

#### ✅ Probar Carga Inicial
1. **Acceder al dashboard**
   - URL: `http://localhost:3000`
   - Verificar que carga sin errores
   - Confirmar que muestra estadísticas (0 tareas inicialmente)

2. **Verificar elementos visuales**
   - [ ] Header con navegación
   - [ ] Cards de estadísticas
   - [ ] Lista de tareas recientes (vacía inicialmente)
   - [ ] Contador de notificaciones

#### ✅ Probar Navegación
1. **Menú lateral**
   - [ ] Dashboard (activo por defecto)
   - [ ] Tareas
   - [ ] Notificaciones
   - [ ] Responsive en móvil

### 2. Gestión de Tareas

#### ✅ Crear Tarea
1. **Acceder a la página de tareas**
   - URL: `http://localhost:3000/tasks`
   - Verificar que muestra lista vacía

2. **Crear primera tarea**
   - [ ] Hacer clic en "Nueva Tarea"
   - [ ] Llenar formulario:
     - Título: "Completar documentación"
     - Descripción: "Finalizar la documentación del proyecto Tasko"
     - Fecha de vencimiento: Mañana
     - Prioridad: Alta
     - Categoría: Trabajo
     - Recordatorio: 1 hora antes
   - [ ] Hacer clic en "Guardar"
   - [ ] Verificar que aparece en la lista

3. **Crear múltiples tareas**
   - [ ] Tarea 2: "Reunión de equipo" (Media prioridad, Personal)
   - [ ] Tarea 3: "Comprar víveres" (Baja prioridad, Personal)
   - [ ] Tarea 4: "Ejercicio diario" (Alta prioridad, Salud)

#### ✅ Editar Tarea
1. **Modificar tarea existente**
   - [ ] Hacer clic en "Editar" en cualquier tarea
   - [ ] Cambiar título a "Documentación actualizada"
   - [ ] Cambiar prioridad a Media
   - [ ] Guardar cambios
   - [ ] Verificar que se actualiza en la lista

#### ✅ Cambiar Estado de Tarea
1. **Marcar como en progreso**
   - [ ] Hacer clic en el dropdown de estado
   - [ ] Seleccionar "En Progreso"
   - [ ] Verificar que cambia visualmente

2. **Marcar como completada**
   - [ ] Cambiar estado a "Completada"
   - [ ] Verificar que se tacha y cambia de color
   - [ ] Confirmar que se actualiza en estadísticas

#### ✅ Eliminar Tarea
1. **Eliminar tarea**
   - [ ] Hacer clic en "Eliminar"
   - [ ] Confirmar en el modal
   - [ ] Verificar que desaparece de la lista
   - [ ] Confirmar que se actualiza contador

#### ✅ Filtros y Búsqueda
1. **Filtrar por estado**
   - [ ] Seleccionar "Pendientes" - ver solo tareas pendientes
   - [ ] Seleccionar "En Progreso" - ver solo tareas en progreso
   - [ ] Seleccionar "Completadas" - ver solo tareas completadas

2. **Filtrar por prioridad**
   - [ ] Seleccionar "Alta" - ver solo tareas de alta prioridad
   - [ ] Seleccionar "Media" - ver solo tareas de media prioridad
   - [ ] Seleccionar "Baja" - ver solo tareas de baja prioridad

3. **Búsqueda por texto**
   - [ ] Escribir "documentación" - ver tareas que contengan esa palabra
   - [ ] Escribir "reunión" - ver tareas relacionadas
   - [ ] Limpiar búsqueda - ver todas las tareas

### 3. Sistema de Notificaciones

#### ✅ Ver Notificaciones
1. **Acceder a notificaciones**
   - URL: `http://localhost:3000/notifications`
   - [ ] Verificar que muestra lista de notificaciones
   - [ ] Confirmar contador en header

2. **Crear notificaciones automáticas**
   - [ ] Crear tarea con recordatorio para 1 minuto después
   - [ ] Esperar 1 minuto
   - [ ] Verificar que aparece notificación

#### ✅ Marcar como Leída
1. **Marcar notificación individual**
   - [ ] Hacer clic en notificación no leída
   - [ ] Verificar que cambia de estilo
   - [ ] Confirmar que se actualiza contador

2. **Marcar todas como leídas**
   - [ ] Hacer clic en "Marcar todas como leídas"
   - [ ] Verificar que todas cambian de estilo
   - [ ] Confirmar que contador llega a 0

#### ✅ Eliminar Notificaciones
1. **Eliminar notificación**
   - [ ] Hacer clic en "Eliminar" en una notificación
   - [ ] Confirmar eliminación
   - [ ] Verificar que desaparece de la lista

### 4. Responsive Design

#### ✅ Probar en Diferentes Tamaños
1. **Desktop (1920x1080)**
   - [ ] Navegación lateral visible
   - [ ] Grid de tareas en 3-4 columnas
   - [ ] Formularios completos

2. **Tablet (768x1024)**
   - [ ] Navegación se adapta
   - [ ] Grid en 2 columnas
   - [ ] Formularios responsivos

3. **Mobile (375x667)**
   - [ ] Menú hamburguesa
   - [ ] Grid en 1 columna
   - [ ] Formularios optimizados para touch

## 🔧 Testing Manual - Backend API

### 1. Endpoints de Tareas

#### ✅ GET /api/tasks
```bash
curl -X GET http://localhost:3001/api/tasks
```
**Verificar:**
- [ ] Status 200
- [ ] Array de tareas en respuesta
- [ ] Estructura correcta de datos

#### ✅ POST /api/tasks
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea de prueba",
    "description": "Descripción de prueba",
    "dueDate": "2024-12-25T10:00:00.000Z",
    "priority": "high",
    "status": "pending",
    "category": "work"
  }'
```
**Verificar:**
- [ ] Status 201
- [ ] Tarea creada con ID único
- [ ] Timestamps generados automáticamente

#### ✅ GET /api/tasks/:id
```bash
# Primero obtener ID de una tarea
curl -X GET http://localhost:3001/api/tasks
# Luego usar el ID en la respuesta
curl -X GET http://localhost:3001/api/tasks/{ID_DE_TAREA}
```
**Verificar:**
- [ ] Status 200
- [ ] Tarea específica retornada
- [ ] Error 404 para ID inexistente

#### ✅ PUT /api/tasks/:id
```bash
curl -X PUT http://localhost:3001/api/tasks/{ID_DE_TAREA} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea actualizada",
    "status": "completed"
  }'
```
**Verificar:**
- [ ] Status 200
- [ ] Solo campos especificados actualizados
- [ ] updatedAt actualizado

#### ✅ DELETE /api/tasks/:id
```bash
curl -X DELETE http://localhost:3001/api/tasks/{ID_DE_TAREA}
```
**Verificar:**
- [ ] Status 200
- [ ] Mensaje de confirmación
- [ ] Tarea eliminada de base de datos

#### ✅ GET /api/tasks/status/:status
```bash
curl -X GET http://localhost:3001/api/tasks/status/pending
curl -X GET http://localhost:3001/api/tasks/status/completed
```
**Verificar:**
- [ ] Status 200
- [ ] Solo tareas con estado especificado
- [ ] Array vacío si no hay tareas

#### ✅ GET /api/tasks/overdue
```bash
curl -X GET http://localhost:3001/api/tasks/overdue
```
**Verificar:**
- [ ] Status 200
- [ ] Solo tareas vencidas y no completadas
- [ ] Ordenadas por fecha de vencimiento

### 2. Endpoints de Notificaciones

#### ✅ GET /api/notifications
```bash
curl -X GET http://localhost:3001/api/notifications
```
**Verificar:**
- [ ] Status 200
- [ ] Array de notificaciones
- [ ] Ordenadas por fecha de creación

#### ✅ GET /api/notifications/unread
```bash
curl -X GET http://localhost:3001/api/notifications/unread
```
**Verificar:**
- [ ] Status 200
- [ ] Solo notificaciones no leídas
- [ ] Contador correcto

#### ✅ PUT /api/notifications/:id/read
```bash
curl -X PUT http://localhost:3001/api/notifications/{ID_DE_NOTIFICACION}/read
```
**Verificar:**
- [ ] Status 200
- [ ] isRead cambiado a true
- [ ] updatedAt actualizado

#### ✅ PUT /api/notifications/read-all
```bash
curl -X PUT http://localhost:3001/api/notifications/read-all
```
**Verificar:**
- [ ] Status 200
- [ ] Mensaje con número de notificaciones marcadas
- [ ] Todas las notificaciones marcadas como leídas

### 3. Endpoints del Dashboard

#### ✅ GET /api/dashboard/stats
```bash
curl -X GET http://localhost:3001/api/dashboard/stats
```
**Verificar:**
- [ ] Status 200
- [ ] Estadísticas correctas:
  - totalTasks
  - pendingTasks
  - completedTasks
  - overdueTasks
  - completionRate

#### ✅ GET /api/dashboard/recent
```bash
curl -X GET http://localhost:3001/api/dashboard/recent
```
**Verificar:**
- [ ] Status 200
- [ ] Actividad reciente
- [ ] Tareas y notificaciones recientes

## 🧪 Testing Automatizado

### 1. Configurar Tests

```bash
# Backend
cd backend
npm install --save-dev jest @types/jest supertest @types/supertest

# Frontend
cd ../frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 2. Tests del Backend

#### ✅ Crear archivo de test
```typescript
// backend/__tests__/tasks.test.ts
import request from 'supertest';
import { app } from '../src/index';

describe('Tasks API', () => {
  let taskId: string;

  test('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Test Task',
        description: 'Test Description',
        dueDate: '2024-12-25T10:00:00.000Z',
        priority: 'high',
        status: 'pending',
        category: 'work'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Task');
    
    taskId = response.body.id;
  });

  test('should get all tasks', async () => {
    const response = await request(app).get('/api/tasks');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should get task by id', async () => {
    const response = await request(app).get(`/api/tasks/${taskId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(taskId);
  });

  test('should update task', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        status: 'completed'
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Task');
    expect(response.body.status).toBe('completed');
  });

  test('should delete task', async () => {
    const response = await request(app).delete(`/api/tasks/${taskId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('eliminada');
  });
});
```

### 3. Tests del Frontend

#### ✅ Crear archivo de test
```tsx
// frontend/src/__tests__/TaskForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../components/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render form fields', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de vencimiento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prioridad/i)).toBeInTheDocument();
  });

  test('should submit form with valid data', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Nueva tarea' }
    });

    fireEvent.change(screen.getByLabelText(/descripción/i), {
      target: { value: 'Descripción de prueba' }
    });

    fireEvent.click(screen.getByText(/guardar/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Nueva tarea',
          description: 'Descripción de prueba'
        })
      );
    });
  });

  test('should call onCancel when cancel button is clicked', () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText(/cancelar/i));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
```

### 4. Ejecutar Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd ../frontend
npm test
```

## 🔄 Testing de Integración

### 1. Flujo Completo de Usuario

#### ✅ Escenario: Usuario Completo
1. **Crear cuenta y login** (cuando implementes autenticación)
2. **Crear múltiples tareas**
3. **Organizar por prioridad**
4. **Marcar algunas como completadas**
5. **Recibir notificaciones**
6. **Revisar estadísticas**

#### ✅ Escenario: Gestión de Tareas
1. Crear 5 tareas con diferentes prioridades
2. Filtrar por estado y prioridad
3. Editar 2 tareas
4. Completar 3 tareas
5. Eliminar 1 tarea
6. Verificar estadísticas actualizadas

#### ✅ Escenario: Notificaciones
1. Crear tarea con recordatorio para 1 minuto
2. Esperar notificación
3. Marcar como leída
4. Crear múltiples notificaciones
5. Marcar todas como leídas
6. Eliminar algunas notificaciones

## 🐛 Testing de Errores

### 1. Errores de Validación

#### ✅ Frontend - Formularios
- [ ] Enviar formulario vacío
- [ ] Título muy largo (>100 caracteres)
- [ ] Fecha de vencimiento en el pasado
- [ ] Prioridad inválida
- [ ] Caracteres especiales en campos

#### ✅ Backend - API
```bash
# Tarea sin título
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "Sin título"}'

# Fecha inválida
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "dueDate": "fecha-invalida"}'

# Prioridad inválida
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "priority": "super-alta"}'
```

### 2. Errores de Red

#### ✅ Simular desconexión
1. Detener backend
2. Intentar crear tarea
3. Verificar mensaje de error
4. Reiniciar backend
5. Verificar que funciona nuevamente

#### ✅ Timeout de requests
1. Simular request lento
2. Verificar loading states
3. Verificar timeout handling

## 📊 Testing de Rendimiento

### 1. Carga de Datos

#### ✅ Muchas tareas
1. Crear 100+ tareas
2. Verificar tiempo de carga
3. Verificar paginación (si implementas)
4. Verificar filtros funcionan

#### ✅ Muchas notificaciones
1. Crear 50+ notificaciones
2. Verificar tiempo de carga
3. Verificar scroll y paginación

### 2. Responsive Performance

#### ✅ Diferentes dispositivos
1. Probar en Chrome DevTools
2. Verificar tiempos de carga
3. Verificar animaciones suaves
4. Verificar sin lag en interacciones

## 🔒 Testing de Seguridad

### 1. Validación de Entrada

#### ✅ XSS Prevention
```bash
# Intentar inyectar script
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "<script>alert(\"xss\")</script>"}'
```

#### ✅ SQL Injection (cuando uses SQL)
```bash
# Intentar inyección SQL
curl -X GET "http://localhost:3001/api/tasks?search='; DROP TABLE tasks; --"
```

### 2. CORS

#### ✅ Origen no permitido
```bash
# Desde origen no autorizado
curl -X GET http://localhost:3001/api/tasks \
  -H "Origin: http://malicious-site.com"
```

## 📋 Checklist de Testing

### ✅ Funcionalidades Básicas
- [ ] Crear tarea
- [ ] Editar tarea
- [ ] Eliminar tarea
- [ ] Cambiar estado
- [ ] Filtrar tareas
- [ ] Buscar tareas

### ✅ Notificaciones
- [ ] Crear notificación automática
- [ ] Marcar como leída
- [ ] Marcar todas como leídas
- [ ] Eliminar notificación
- [ ] Contador de no leídas

### ✅ Dashboard
- [ ] Estadísticas correctas
- [ ] Actividad reciente
- [ ] Navegación funcional
- [ ] Responsive design

### ✅ API Endpoints
- [ ] GET /api/tasks
- [ ] POST /api/tasks
- [ ] PUT /api/tasks/:id
- [ ] DELETE /api/tasks/:id
- [ ] GET /api/notifications
- [ ] PUT /api/notifications/:id/read

### ✅ Errores y Edge Cases
- [ ] Validación de formularios
- [ ] Manejo de errores de red
- [ ] Datos inválidos
- [ ] Estados de carga

### ✅ Rendimiento
- [ ] Tiempo de carga < 2s
- [ ] Animaciones suaves
- [ ] Sin lag en interacciones
- [ ] Responsive en todos los dispositivos

## 🚀 Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testNamePattern="TaskForm"

# Ejecutar tests de integración
npm run test:integration
```

---

📖 **Para más información, consulta la [documentación de la API](API_DOCUMENTATION.md)** 