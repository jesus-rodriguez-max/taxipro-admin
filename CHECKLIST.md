# ✅ CHECKLIST: Asignación de Rol Admin en TaxiPro

## 📋 Estado Actual

### ✅ COMPLETADO (por el sistema)

- [x] Script `set-admin.cjs` corregido con credencial explícita
- [x] UID corregido: `hDgITz8dSyNKKsqso27ny8rMQCV2`
- [x] Proyecto configurado: `taxipro-chofer`
- [x] `firebase-admin` instalado en package.json
- [x] `service-account.json` agregado al .gitignore
- [x] Documentación completa creada:
  - [x] `GUIA_RAPIDA.md`
  - [x] `INSTRUCCIONES_SERVICE_ACCOUNT.md`
  - [x] `README_ADMIN_SETUP.md`
  - [x] `ESTADO_ACTUAL.md`
- [x] Script de verificación: `verify-setup.cjs`
- [x] Script de resumen: `resumen.cjs`

---

## 🔴 PENDIENTE (requiere acción del usuario)

### PASO 1: Descargar Service Account Key

- [ ] Abrir Firebase Console: https://console.firebase.google.com/project/taxipro-chofer/settings/serviceaccounts/adminsdk
- [ ] Hacer clic en "Generar nueva clave privada"
- [ ] Confirmar la descarga
- [ ] Archivo descargado: `taxipro-chofer-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

### PASO 2: Instalar el Archivo

- [ ] Renombrar el archivo a: `service-account.json`
- [ ] Mover a: `/home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin/service-account.json`
- [ ] Verificar ubicación con: `ls -la service-account.json`

### PASO 3: Verificar Configuración

- [ ] Ejecutar: `node verify-setup.cjs`
- [ ] Ver mensaje: "✅ TODO LISTO PARA EJECUTAR set-admin.cjs"

### PASO 4: Asignar Rol Admin

- [ ] Ejecutar: `node set-admin.cjs`
- [ ] Ver mensaje: "✅ USUARIO MARCADO COMO ADMIN CORRECTAMENTE"

### PASO 5: Verificar en Firebase Console

- [ ] Abrir: https://console.firebase.google.com/project/taxipro-chofer/authentication/users
- [ ] Buscar usuario: `admin@taxipro.com.mx`
- [ ] Verificar Custom Claims: `{ "role": "admin" }`

### PASO 6: Probar Login

- [ ] Iniciar servidor: `npm run dev`
- [ ] Abrir: http://localhost:5173/login
- [ ] Iniciar sesión con `admin@taxipro.com.mx`
- [ ] Verificar acceso al dashboard

---

## 🚀 COMANDOS DE EJECUCIÓN

```bash
# 1. Ir al directorio del proyecto
cd /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin

# 2. Ver resumen del estado
node resumen.cjs

# 3. Verificar configuración (después de descargar service-account.json)
node verify-setup.cjs

# 4. Asignar rol admin
node set-admin.cjs

# 5. Iniciar servidor de desarrollo
npm run dev
```

---

## 📚 DOCUMENTACIÓN DE REFERENCIA

| Archivo | Descripción | Cuándo usar |
|---------|-------------|-------------|
| `GUIA_RAPIDA.md` | Guía de 5 minutos | Inicio rápido |
| `INSTRUCCIONES_SERVICE_ACCOUNT.md` | Cómo descargar la clave | Paso 1 detallado |
| `README_ADMIN_SETUP.md` | Documentación completa | Troubleshooting |
| `ESTADO_ACTUAL.md` | Estado del proyecto | Verificar progreso |
| `CHECKLIST.md` | Este archivo | Seguimiento de tareas |

---

## ⚠️ NOTAS IMPORTANTES

### Seguridad
- ❌ **NUNCA** subas `service-account.json` a Git
- ✅ Ya está protegido en `.gitignore`
- 🔒 Guarda el archivo de forma segura

### Permisos de Service Account
La service account debe tener estos roles en Firebase:
- `Firebase Admin SDK Administrator Service Agent`
- `Editor` (o `Firebase Authentication Admin`)

Verificar en: https://console.cloud.google.com/iam-admin/iam?project=taxipro-chofer

### Custom Claims
- Los custom claims se asignan al token JWT
- El usuario **debe cerrar sesión y volver a iniciar** para que tomen efecto
- Los claims persisten hasta que se cambien o eliminen

---

## 🔍 TROUBLESHOOTING

### Error: "service-account.json NO ENCONTRADO"
👉 Completa el PASO 1 y PASO 2

### Error: "Permission denied"
👉 Verifica permisos de la service account en Cloud Console

### Error: "User not found"
👉 Verifica que el usuario existe en Firebase Authentication

### El usuario no puede acceder al dashboard
👉 Debe cerrar sesión y volver a iniciar sesión

---

## ✅ VERIFICACIÓN FINAL

Cuando hayas completado todos los pasos, deberías poder:

1. ✅ Ver el archivo `service-account.json` en el proyecto
2. ✅ Ejecutar `node verify-setup.cjs` sin errores
3. ✅ Ejecutar `node set-admin.cjs` exitosamente
4. ✅ Ver `{ "role": "admin" }` en Firebase Console
5. ✅ Iniciar sesión en el panel admin sin problemas

---

## 📞 SOPORTE

Si encuentras problemas:

1. Ejecuta: `node resumen.cjs` para ver el estado
2. Revisa: `README_ADMIN_SETUP.md` para troubleshooting
3. Verifica: Permisos de la service account en Cloud Console

---

**Última actualización:** 27 de Noviembre, 2024  
**Estado:** Esperando descarga de service-account.json
