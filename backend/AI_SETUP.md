# Configuración del Asistente AI

## Variables de Entorno

Para usar el asistente AI, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

```env
# OpenAI API Configuration (opcional - para funcionalidades AI)
OPENAI_API_KEY=your_openai_api_key_here
```

## Cómo obtener una API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a la sección "API Keys"
4. Crea una nueva API Key
5. Copia la key y agrégala a tu archivo `.env`

## Funcionalidades del Asistente

### Con API Key de OpenAI:
- Procesamiento inteligente de comandos en lenguaje natural
- Extracción automática de fechas, prioridades y categorías
- Respuestas más precisas y contextuales

### Sin API Key (modo fallback):
- Procesamiento básico de comandos
- Funcionalidad limitada pero funcional
- No requiere configuración adicional

## Ejemplos de Comandos

```
"Crea una tarea para revisar emails mañana a las 2pm"
"Agenda una reunión con el equipo el viernes"
"¿Qué tareas tengo pendientes?"
"Marca la tarea 'revisar presupuesto' como completada"
"ayuda"
```

## Costos

- OpenAI cobra por uso de la API
- El costo depende del modelo usado (gpt-3.5-turbo es económico)
- Puedes establecer límites de uso en tu cuenta de OpenAI

## Seguridad

- Nunca compartas tu API Key
- Usa variables de entorno para configurar la key
- Considera usar un proxy o rate limiting en producción 