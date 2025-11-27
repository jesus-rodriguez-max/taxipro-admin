# 🔑 INSTRUCCIONES: Descargar Service Account de Firebase

## Paso 1: Acceder a Firebase Console

1. Ve a: https://console.firebase.google.com/
2. Selecciona el proyecto: **taxipro-chofer**

## Paso 2: Ir a Configuración del Proyecto

1. Haz clic en el ícono de engranaje ⚙️ (arriba izquierda)
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"Cuentas de servicio"**

## Paso 3: Generar Nueva Clave Privada

1. En la sección "SDK de Admin de Firebase", verás:
   - **Cuenta de servicio**: `firebase-adminsdk-xxxxx@taxipro-chofer.iam.gserviceaccount.com`
   
2. Haz clic en el botón **"Generar nueva clave privada"**

3. Confirma en el diálogo que aparece

4. Se descargará un archivo JSON con nombre similar a:
   ```
   taxipro-chofer-firebase-adminsdk-xxxxx-xxxxxxxxxx.json
   ```

## Paso 4: Guardar el Archivo

1. **RENOMBRA** el archivo descargado a: `service-account.json`

2. **MUEVE** el archivo a la carpeta del proyecto:
   ```
   /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin/service-account.json
   ```

3. **VERIFICA** que el archivo esté en la ubicación correcta:
   ```bash
   ls -la /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin/service-account.json
   ```

## Paso 5: Verificar Permisos de la Service Account

1. Ve a: https://console.cloud.google.com/iam-admin/iam?project=taxipro-chofer

2. Busca la cuenta: `firebase-adminsdk-xxxxx@taxipro-chofer.iam.gserviceaccount.com`

3. Verifica que tenga estos roles:
   - ✅ **Firebase Admin SDK Administrator Service Agent**
   - ✅ **Editor** (o roles específicos como Firebase Authentication Admin)

4. Si no tiene los permisos necesarios, haz clic en el lápiz ✏️ para editar y agregar:
   - `roles/firebase.admin`
   - `roles/iam.serviceAccountTokenCreator`

## ⚠️ SEGURIDAD IMPORTANTE

- **NUNCA** subas `service-account.json` a Git
- El archivo ya está en `.gitignore`
- Este archivo da acceso completo a tu proyecto Firebase
- Guárdalo de forma segura y no lo compartas

## ✅ Siguiente Paso

Una vez que tengas el archivo `service-account.json` en su lugar, ejecuta:

```bash
cd /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin
node set-admin.cjs
```

Deberías ver:
```
✔ USUARIO MARCADO COMO ADMIN CORRECTAMENTE
```
