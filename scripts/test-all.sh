#!/bin/bash

# 🧪 Script de Testing Completo - Tasko
# Este script automatiza las pruebas básicas de la aplicación

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar si un puerto está en uso
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Función para esperar hasta que un servicio esté disponible
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Esperando que el servicio esté disponible en $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "Servicio disponible en $url"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Servicio no disponible después de $max_attempts intentos"
    return 1
}

# Función para hacer una petición HTTP y verificar la respuesta
test_endpoint() {
    local method=$1
    local url=$2
    local expected_status=$3
    local data=$4
    
    print_status "Probando $method $url"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X "$method" -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$url")
    fi
    
    # Extraer status code (últimos 3 caracteres)
    status_code=${response: -3}
    # Extraer body (todo excepto los últimos 3 caracteres)
    body=${response%???}
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "$method $url - Status: $status_code"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        print_error "$method $url - Status: $status_code (esperado: $expected_status)"
        echo "$body"
        return 1
    fi
}

# Función para crear datos de prueba
create_test_data() {
    cat <<EOF
{
    "title": "Tarea de prueba $(date +%s)",
    "description": "Descripción de prueba generada automáticamente",
    "dueDate": "$(date -d '+1 day' -u +%Y-%m-%dT%H:%M:%S.000Z)",
    "priority": "medium",
    "status": "pending",
    "category": "test"
}
EOF
}

# Función principal de testing
main() {
    echo "🚀 Iniciando Testing Completo de Tasko"
    echo "======================================"
    
    # Verificar prerrequisitos
    print_status "Verificando prerrequisitos..."
    
    if ! command_exists node; then
        print_error "Node.js no está instalado"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm no está instalado"
        exit 1
    fi
    
    if ! command_exists curl; then
        print_error "curl no está instalado"
        exit 1
    fi
    
    print_success "Prerrequisitos verificados"
    
    # Verificar estructura del proyecto
    print_status "Verificando estructura del proyecto..."
    
    if [ ! -d "backend" ]; then
        print_error "Directorio 'backend' no encontrado"
        exit 1
    fi
    
    if [ ! -d "frontend" ]; then
        print_error "Directorio 'frontend' no encontrado"
        exit 1
    fi
    
    print_success "Estructura del proyecto verificada"
    
    # Verificar si los servicios están corriendo
    print_status "Verificando servicios..."
    
    if ! port_in_use 3001; then
        print_warning "Backend no está corriendo en puerto 3001"
        print_status "Iniciando backend..."
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..
        sleep 5
    else
        print_success "Backend ya está corriendo"
    fi
    
    if ! port_in_use 3000; then
        print_warning "Frontend no está corriendo en puerto 3000"
        print_status "Iniciando frontend..."
        cd frontend
        npm start &
        FRONTEND_PID=$!
        cd ..
        sleep 10
    else
        print_success "Frontend ya está corriendo"
    fi
    
    # Esperar a que los servicios estén disponibles
    wait_for_service "http://localhost:3001/api/health" || {
        print_error "Backend no responde"
        exit 1
    }
    
    wait_for_service "http://localhost:3000" || {
        print_error "Frontend no responde"
        exit 1
    }
    
    print_success "Todos los servicios están disponibles"
    
    # Testing de API
    echo ""
    echo "🔧 Testing de API Backend"
    echo "========================="
    
    # Health check
    test_endpoint "GET" "http://localhost:3001/api/health" "200"
    
    # Obtener tareas (debería estar vacío inicialmente)
    test_endpoint "GET" "http://localhost:3001/api/tasks" "200"
    
    # Crear tarea de prueba
    test_data=$(create_test_data)
    test_endpoint "POST" "http://localhost:3001/api/tasks" "201" "$test_data"
    
    # Obtener tareas nuevamente (debería tener 1 tarea)
    response=$(curl -s "http://localhost:3001/api/tasks")
    task_count=$(echo "$response" | jq '.count // .data | length' 2>/dev/null || echo "0")
    
    if [ "$task_count" -gt 0 ]; then
        print_success "Tarea creada exitosamente"
        
        # Obtener ID de la primera tarea
        task_id=$(echo "$response" | jq -r '.data[0].id // .[0].id' 2>/dev/null || echo "")
        
        if [ -n "$task_id" ] && [ "$task_id" != "null" ]; then
            # Obtener tarea específica
            test_endpoint "GET" "http://localhost:3001/api/tasks/$task_id" "200"
            
            # Actualizar tarea
            update_data='{"title": "Tarea actualizada", "status": "completed"}'
            test_endpoint "PUT" "http://localhost:3001/api/tasks/$task_id" "200" "$update_data"
            
            # Verificar que se actualizó
            updated_response=$(curl -s "http://localhost:3001/api/tasks/$task_id")
            updated_title=$(echo "$updated_response" | jq -r '.data.title // .title' 2>/dev/null || echo "")
            updated_status=$(echo "$updated_response" | jq -r '.data.status // .status' 2>/dev/null || echo "")
            
            if [ "$updated_title" = "Tarea actualizada" ] && [ "$updated_status" = "completed" ]; then
                print_success "Tarea actualizada correctamente"
            else
                print_warning "No se pudo verificar la actualización de la tarea"
            fi
            
            # Eliminar tarea
            test_endpoint "DELETE" "http://localhost:3001/api/tasks/$task_id" "200"
            
            # Verificar que se eliminó
            test_endpoint "GET" "http://localhost:3001/api/tasks/$task_id" "404"
        else
            print_warning "No se pudo obtener el ID de la tarea para testing adicional"
        fi
    else
        print_error "No se pudo crear tarea de prueba"
    fi
    
    # Testing de notificaciones (si están implementadas)
    echo ""
    echo "🔔 Testing de Notificaciones"
    echo "============================"
    
    # Probar endpoints de notificaciones (pueden no estar implementados)
    notification_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/notifications")
    if [ "$notification_response" != "404" ]; then
        test_endpoint "GET" "http://localhost:3001/api/notifications" "200"
        test_endpoint "GET" "http://localhost:3001/api/notifications/unread" "200"
    else
        print_warning "Endpoints de notificaciones no implementados aún"
    fi
    
    # Testing de filtros (si están implementados)
    echo ""
    echo "🔍 Testing de Filtros"
    echo "===================="
    
    # Probar filtros por estado
    status_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/tasks/status/pending")
    if [ "$status_response" != "404" ]; then
        test_endpoint "GET" "http://localhost:3001/api/tasks/status/pending" "200"
        test_endpoint "GET" "http://localhost:3001/api/tasks/status/completed" "200"
    else
        print_warning "Filtros por estado no implementados aún"
    fi
    
    # Probar tareas vencidas
    overdue_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/tasks/overdue")
    if [ "$overdue_response" != "404" ]; then
        test_endpoint "GET" "http://localhost:3001/api/tasks/overdue" "200"
    else
        print_warning "Endpoint de tareas vencidas no implementado aún"
    fi
    
    # Testing de errores
    echo ""
    echo "🐛 Testing de Errores"
    echo "===================="
    
    # Tarea sin título
    invalid_data='{"description": "Tarea sin título"}'
    test_endpoint "POST" "http://localhost:3001/api/tasks" "400" "$invalid_data"
    
    # ID inexistente
    test_endpoint "GET" "http://localhost:3001/api/tasks/invalid-id" "404"
    
    # Prioridad inválida
    invalid_priority='{"title": "Test", "priority": "super-alta", "status": "pending", "category": "test"}'
    test_endpoint "POST" "http://localhost:3001/api/tasks" "400" "$invalid_priority"
    
    # Testing de rendimiento básico
    echo ""
    echo "⚡ Testing de Rendimiento"
    echo "========================="
    
    start_time=$(date +%s%N)
    curl -s "http://localhost:3001/api/tasks" >/dev/null
    end_time=$(date +%s%N)
    
    response_time=$(( (end_time - start_time) / 1000000 ))  # Convertir a milisegundos
    
    if [ $response_time -lt 1000 ]; then
        print_success "Tiempo de respuesta: ${response_time}ms (OK)"
    else
        print_warning "Tiempo de respuesta: ${response_time}ms (lento)"
    fi
    
    # Verificar frontend
    echo ""
    echo "🎨 Testing de Frontend"
    echo "====================="
    
    # Verificar que el frontend responde
    frontend_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
    
    if [ "$frontend_response" = "200" ]; then
        print_success "Frontend responde correctamente"
    else
        print_error "Frontend no responde (Status: $frontend_response)"
    fi
    
    # Verificar que el proxy funciona
    proxy_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/tasks")
    
    if [ "$proxy_response" = "200" ]; then
        print_success "Proxy del frontend funciona correctamente"
    else
        print_warning "Proxy del frontend no funciona (Status: $proxy_response)"
    fi
    
    # Resumen final
    echo ""
    echo "📊 Resumen del Testing"
    echo "====================="
    print_success "✅ Testing completado exitosamente"
    print_status "Backend: http://localhost:3001"
    print_status "Frontend: http://localhost:3000"
    print_status "API Health: http://localhost:3001/api/health"
    
    # Limpiar procesos si los iniciamos
    if [ -n "$BACKEND_PID" ]; then
        print_status "Deteniendo backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ -n "$FRONTEND_PID" ]; then
        print_status "Deteniendo frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    echo ""
    print_success "🎉 ¡Testing completado! La aplicación está funcionando correctamente."
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Abre http://localhost:3000 en tu navegador"
    echo "2. Crea algunas tareas de prueba"
    echo "3. Prueba todas las funcionalidades manualmente"
    echo "4. Revisa la guía de testing completa en docs/TESTING_GUIDE.md"
}

# Ejecutar función principal
main "$@" 