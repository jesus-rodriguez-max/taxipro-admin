# TaxiPro - Panel de Control Operacional

Panel de control en tiempo real para monitorear conductores, viajes y alertas de TaxiPro.

## 🚀 Características

### Monitoreo en Tiempo Real
- ✅ Mapa interactivo con conductores online
- ✅ Visualización de viajes activos
- ✅ Ubicación en tiempo real de conductores
- ✅ Rutas de viajes en progreso

### Sistema de Alertas Automáticas
- ⚠️ Viajes aceptados que no avanzan (>5 min)
- ⚠️ Conductores con viaje activo pero offline
- ⚠️ Stripe no habilitado en conductores activos
- ⚠️ Suscripciones vencidas

### Estadísticas en Vivo
- Conductores online vs total
- Viajes solicitados (sin conductor)
- Viajes en proceso
- Viajes completados hoy
- Estado de suscripciones
- Problemas con Stripe

## 📋 Instalación

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar Firebase

Edita `src/lib/firebase.ts` con tus credenciales de Firebase Console.

### 3. Ejecutar

```bash
pnpm dev
```

Ver README completo para más detalles de configuración y despliegue.
