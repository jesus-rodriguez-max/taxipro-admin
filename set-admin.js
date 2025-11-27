// set-admin.js (versión ESM)

// IMPORTAR firebase-admin correctamente
import admin from "firebase-admin";

// Inicializar usando las credenciales que ya tienes en Firebase CLI
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "taxipro-chofer",
});

// UID del admin que quieres marcar
const uid = "hDglTz8dSyNKKSqso27ny8rMQCV2";

admin
  .auth()
  .setCustomUserClaims(uid, { role: "admin" })
  .then(() => {
    console.log("✓ USUARIO MARCADO COMO ADMIN CORRECTAMENTE");
    process.exit(0);
  })
  .catch((err) => {
    console.error("✘ ERROR:", err);
    process.exit(1);
  });

