# 🔐 Configuración de Administrador Firebase - TaxiPro

Este documento explica cómo configurar y asignar el rol de administrador en Firebase Authentication para el panel TaxiPro Admin.

## 📋 Requisitos Previos

- Acceso a Firebase Console del proyecto `taxipro-chofer`
- Node.js instalado
- Permisos de propietario o editor en el proyecto Firebase

## 🚀 Proceso Completo

### 1️⃣ Descargar Service Account

Sigue las instrucciones detalladas en: **`INSTRUCCIONES_SERVICE_ACCOUNT.md`**

**Resumen rápido:**
1. Ve a Firebase Console → taxipro-chofer
2. Configuración del proyecto → Cuentas de servicio
3. Generar nueva clave privada
4. Renombrar a `service-account.json`
5. Colocar en la raíz del proyecto taxipro-admin

### 2️⃣ Verificar Estructura del Proyecto

```
taxipro-admin/
├── service-account.json          ← Debe estar aquí (NO SUBIR A GIT)
├── set-admin.cjs                 ← Script corregido
├── INSTRUCCIONES_SERVICE_ACCOUNT.md
├── README_ADMIN_SETUP.md         ← Este archivo
└── ...
```

### 3️⃣ Ejecutar el Script

```bash
cd /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin
node set-admin.cjs
```

**Salida esperada:**
```
✓ Archivo service-account.json encontrado
⚙️  Inicializando Firebase Admin SDK...
✓ Firebase Admin SDK inicializado correctamente

🔄 Asignando rol de admin a: admin@taxipro.com.mx
   UID: hDgITz8dSyNKKsqso27ny8rMQCV2

✅ USUARIO MARCADO COMO ADMIN CORRECTAMENTE
📝 Custom Claims asignados: { role: 'admin' }

⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar
   para que los nuevos claims tomen efecto.

🔍 Verifica en Firebase Console:
   Authentication → Users → admin@taxipro.com.mx → Custom Claims
```

### 4️⃣ Verificar en Firebase Console

1. Ve a: https://console.firebase.google.com/project/taxipro-chofer/authentication/users
2. Busca el usuario: `admin@taxipro.com.mx`
3. Haz clic en el usuario
4. En la sección **"Custom Claims"** debe aparecer:
   ```json
   {
     "role": "admin"
   }
   ```

### 5️⃣ Probar el Login

1. Si el usuario ya estaba logueado, **debe cerrar sesión**
2. Ir a: http://localhost:5173/login
3. Iniciar sesión con:
   - Email: `admin@taxipro.com.mx`
   - Password: (la contraseña configurada)
4. Debe redirigir al dashboard sin problemas

## 🔧 Solución de Problemas

### Error: "No se encontró el archivo service-account.json"

**Causa:** El archivo no está en la ubicación correcta.

**Solución:**
```bash
ls -la /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin/service-account.json
```
Si no existe, sigue las instrucciones en `INSTRUCCIONES_SERVICE_ACCOUNT.md`

### Error: "Permission denied" o "Insufficient permissions"

**Causa:** La service account no tiene los permisos necesarios.

**Solución:**
1. Ve a: https://console.cloud.google.com/iam-admin/iam?project=taxipro-chofer
2. Busca: `firebase-adminsdk-xxxxx@taxipro-chofer.iam.gserviceaccount.com`
3. Verifica que tenga estos roles:
   - `Firebase Admin SDK Administrator Service Agent`
   - `Editor` o `Firebase Authentication Admin`

### Error: "User not found"

**Causa:** El UID no existe en Firebase Authentication.

**Solución:**
1. Ve a Firebase Console → Authentication → Users
2. Verifica que existe el usuario `admin@taxipro.com.mx`
3. Copia el UID exacto
4. Actualiza el UID en `set-admin.cjs` si es diferente

### El usuario no puede acceder al dashboard

**Causa:** Los custom claims no se han actualizado en el token.

**Solución:**
1. El usuario debe **cerrar sesión completamente**
2. Volver a iniciar sesión
3. Los nuevos claims se cargarán en el nuevo token

## 📝 Información Técnica

### Usuario Administrador
- **Email:** admin@taxipro.com.mx
- **UID:** hDgITz8dSyNKKsqso27ny8rMQCV2
- **Custom Claim:** `{ role: "admin" }`

### Service Account
- **Proyecto:** taxipro-chofer
- **Email:** firebase-adminsdk-xxxxx@taxipro-chofer.iam.gserviceaccount.com
- **Archivo:** service-account.json (en .gitignore)

### Script
- **Archivo:** set-admin.cjs
- **Función:** Asigna custom claims usando Firebase Admin SDK
- **Método:** `admin.auth().setCustomUserClaims(uid, { role: "admin" })`

## ⚠️ Seguridad

### ¡IMPORTANTE!

- ❌ **NUNCA** subas `service-account.json` a Git
- ❌ **NUNCA** compartas el archivo service-account.json
- ❌ **NUNCA** hagas commit del archivo
- ✅ El archivo ya está en `.gitignore`
- ✅ Guarda el archivo en un lugar seguro
- ✅ Rota las credenciales si se comprometen

### Si el archivo se expone:

1. Ve a Firebase Console → Configuración → Cuentas de servicio
2. Elimina la clave comprometida
3. Genera una nueva clave privada
4. Reemplaza el archivo `service-account.json`
5. Ejecuta el script nuevamente

## 📚 Referencias

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

## ✅ Checklist

- [ ] Descargué el archivo service-account.json
- [ ] Lo renombré correctamente
- [ ] Lo coloqué en la raíz de taxipro-admin
- [ ] Verifiqué que está en .gitignore
- [ ] Ejecuté `node set-admin.cjs`
- [ ] Vi el mensaje de éxito
- [ ] Verifiqué los custom claims en Firebase Console
- [ ] El usuario cerró sesión y volvió a iniciar
- [ ] El usuario puede acceder al dashboard

---

**Última actualización:** Noviembre 2024  
**Mantenedor:** Equipo TaxiPro
