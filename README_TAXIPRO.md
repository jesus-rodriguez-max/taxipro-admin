# TaxiPro Admin Panel

Panel administrativo oficial del ecosistema TaxiPro.

## 🚀 Tecnologías

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Firebase** - Backend (Auth, Firestore, Storage)
- **Tailwind CSS** - Styling
- **React Router** - Routing

## 📦 Instalación

```bash
npm install
```

## 🔧 Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

## 🔐 Acceso

Solo usuarios con rol `admin` en Firebase Auth pueden acceder al panel.

### Estructura de Claims requerida:
```json
{
  "role": "admin"
}
```

## 📁 Estructura del Proyecto

```
src/
├── auth/
│   ├── login.tsx           # Pantalla de login
│   └── requireAdmin.tsx    # HOC de protección de rutas
├── dashboard/
│   ├── index.tsx           # Dashboard principal
│   ├── drivers/            # Gestión de choferes
│   ├── passengers/         # Gestión de pasajeros
│   ├── trips/              # Gestión de viajes
│   ├── safety/             # Alertas y grabaciones
│   └── settings/           # Configuración del sistema
├── firebase/
│   ├── app.ts              # Configuración Firebase
│   ├── auth.ts             # Auth service
│   ├── firestore.ts        # Firestore instance
│   └── storage.ts          # Storage instance
├── components/
│   └── Layout.tsx          # Layout principal con sidebar
└── main.tsx                # Entry point con rutas
```

## 🛣️ Rutas

- `/login` - Login de administradores
- `/dashboard` - Dashboard principal
- `/dashboard/drivers` - Lista de choferes
- `/dashboard/passengers` - Lista de pasajeros
- `/dashboard/trips` - Lista de viajes
- `/dashboard/safety` - Alertas de seguridad
- `/dashboard/settings` - Configuración

## 🔒 Seguridad

- Autenticación obligatoria con Firebase Auth
- Verificación de rol `admin` en cada carga
- Logout automático si el usuario no tiene permisos
- Rutas protegidas con `RequireAdmin` HOC

## 📝 Notas

- El proyecto está configurado para conectarse al proyecto Firebase `taxipro-chofer`
- Todas las pantallas están creadas con estructura base lista para implementar
- El sidebar incluye navegación completa del sistema
