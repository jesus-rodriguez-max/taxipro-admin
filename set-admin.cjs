// set-admin.cjs
// Script para asignar rol de administrador en Firebase Authentication
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Verificar que existe el archivo service-account.json
const serviceAccountPath = path.join(__dirname, "service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ ERROR: No se encontró el archivo service-account.json");
  console.error("📋 Por favor, sigue las instrucciones en INSTRUCCIONES_SERVICE_ACCOUNT.md");
  console.error("📍 El archivo debe estar en:", serviceAccountPath);
  process.exit(1);
}

console.log("✓ Archivo service-account.json encontrado");
console.log("⚙️  Inicializando Firebase Admin SDK...");

// Inicializar Firebase Admin con la credencial explícita
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: "taxipro-chofer",
  });
  console.log("✓ Firebase Admin SDK inicializado correctamente");
} catch (error) {
  console.error("❌ ERROR al inicializar Firebase Admin SDK:", error.message);
  process.exit(1);
}

// UID del usuario admin@taxipro.com.mx
const uid = "hDgITz8dSyNKKsqso27ny8rMQCV2";
const email = "admin@taxipro.com.mx";

console.log(`\n🔄 Asignando rol de admin a: ${email}`);
console.log(`   UID: ${uid}`);

admin
  .auth()
  .setCustomUserClaims(uid, { role: "admin" })
  .then(() => {
    console.log("\n✅ USUARIO MARCADO COMO ADMIN CORRECTAMENTE");
    console.log("📝 Custom Claims asignados: { role: 'admin' }");
    console.log("\n⚠️  IMPORTANTE: El usuario debe cerrar sesión y volver a iniciar");
    console.log("   para que los nuevos claims tomen efecto.");
    console.log("\n🔍 Verifica en Firebase Console:");
    console.log("   Authentication → Users → admin@taxipro.com.mx → Custom Claims");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ ERROR al asignar custom claims:", err.message);
    console.error("\n🔍 Posibles causas:");
    console.error("   1. El UID no existe en Firebase Authentication");
    console.error("   2. La service account no tiene permisos suficientes");
    console.error("   3. El proyecto Firebase no es el correcto");
    console.error("\n📋 Verifica:");
    console.error("   - Que el usuario existe en Firebase Authentication");
    console.error("   - Que la service account tenga rol 'Firebase Admin'");
    process.exit(1);
  });
