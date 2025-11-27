# ⚡ GUÍA RÁPIDA: Asignar Rol de Admin

## 🎯 Objetivo
Asignar el rol de administrador al usuario `admin@taxipro.com.mx` en Firebase Authentication.

## 📋 Pasos (5 minutos)

### PASO 1: Descargar Service Account Key

1. **Abre Firebase Console:**
   ```
   https://console.firebase.google.com/project/taxipro-chofer/settings/serviceaccounts/adminsdk
   ```

2. **Genera la clave:**
   - Haz clic en **"Generar nueva clave privada"**
   - Confirma la descarga
   - Se descargará: `taxipro-chofer-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

3. **Renombra y mueve el archivo:**
   ```bash
   # Renombra el archivo descargado
   mv ~/Downloads/taxipro-chofer-firebase-adminsdk-*.json \
      /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin/service-account.json
   ```

### PASO 2: Verificar Setup

```bash
cd /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin
node verify-setup.cjs
```

**Debes ver:**
```
✅ TODO LISTO PARA EJECUTAR set-admin.cjs
```

### PASO 3: Ejecutar Script de Asignación

```bash
node set-admin.cjs
```

**Debes ver:**
```
✅ USUARIO MARCADO COMO ADMIN CORRECTAMENTE
```

### PASO 4: Verificar en Firebase Console

1. **Abre:**
   ```
   https://console.firebase.google.com/project/taxipro-chofer/authentication/users
   ```

2. **Busca:** `admin@taxipro.com.mx`

3. **Verifica Custom Claims:**
   ```json
   {
     "role": "admin"
   }
   ```

### PASO 5: Probar Login

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abre el navegador:**
   ```
   http://localhost:5173/login
   ```

3. **Inicia sesión:**
   - Email: `admin@taxipro.com.mx`
   - Password: (tu contraseña)

4. **Debe redirigir al dashboard** ✅

---

## 🔧 Comandos de Referencia Rápida

```bash
# Directorio del proyecto
cd /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin

# Verificar setup
node verify-setup.cjs

# Asignar rol admin
node set-admin.cjs

# Iniciar servidor de desarrollo
npm run dev
```

---

## ❓ Problemas Comunes

### "service-account.json NO ENCONTRADO"
👉 Descarga el archivo de Firebase Console (PASO 1)

### "Permission denied"
👉 La service account necesita permisos. Ve a:
```
https://console.cloud.google.com/iam-admin/iam?project=taxipro-chofer
```
Busca: `firebase-adminsdk-xxxxx@taxipro-chofer.iam.gserviceaccount.com`  
Debe tener rol: **Firebase Admin SDK Administrator Service Agent**

### "User not found"
👉 Verifica que el usuario existe en Firebase Authentication:
```
https://console.firebase.google.com/project/taxipro-chofer/authentication/users
```

### El usuario no puede acceder al dashboard
👉 **Debe cerrar sesión y volver a iniciar** para que los nuevos claims tomen efecto.

---

## 📚 Documentación Completa

- **Instrucciones detalladas:** `INSTRUCCIONES_SERVICE_ACCOUNT.md`
- **Setup completo:** `README_ADMIN_SETUP.md`
- **Verificación:** `verify-setup.cjs`
- **Script principal:** `set-admin.cjs`

---

## ⚠️ SEGURIDAD

- ❌ **NUNCA** subas `service-account.json` a Git
- ✅ Ya está en `.gitignore`
- 🔒 Guarda el archivo de forma segura

---

**¿Listo? ¡Comienza con el PASO 1! 🚀**
