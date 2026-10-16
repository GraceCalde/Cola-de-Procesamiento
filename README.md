# BullMQ: Cola de trabajos

## Descripción

Este proyecto demuestra cómo desacoplar una tarea lenta del ciclo de vida de una petición HTTP utilizando BullMQ y Redis.

La API Express recibe una solicitud, agrega un trabajo a la cola y responde con el estado `202 Accepted` junto con el identificador del trabajo. Un Worker independiente consume la cola y procesa el trabajo de forma asíncrona.

## Tecnologías

- Node.js
- Express
- BullMQ
- ioredis
- Redis mediante Docker

## Requisitos

- Node.js y npm.
- Docker Desktop.
- Una instancia de Redis disponible en el puerto `6379`.

## Instalación

```bash
npm install
```

## Ejecución

Iniciar el productor:

```bash
npm start
```

Iniciar el Worker en otra terminal:

```bash
npm run worker
```

## Endpoint

**Método:** `POST`

**URL:** `http://localhost:3001/jobs/email`

Ejemplo de petición:

```json
{
  "email": "email1@example.com"
}
```

Para probar los reintentos automáticos:

```json
{
  "email": "prueba-reintentos@example.com",
  "failFirstAttempts": true
}
```

## Comportamiento esperado

El endpoint devuelve `202 Accepted` y un identificador generado por BullMQ. El Worker simula el envío de un correo durante cinco segundos y registra el resultado en la consola.

Cuando se activa `failFirstAttempts`, el Worker provoca dos fallos controlados. BullMQ reintenta el trabajo hasta tres veces en total, con un segundo de espera entre intentos fallidos.