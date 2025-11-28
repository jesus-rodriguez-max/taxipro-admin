// set-admin.cjs
// Script para asignar rol de administrador en Firebase Authentication
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

console.log("✓ Archivo service-account.json cargado");
console.log("⚙️  Inicializando Firebase Admin SDK...");
console.log(`📦 Proyecto: ${serviceAccount.project_id}`);

// Inicializar Firebase Admin con la credencial explícita
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✓ Firebase Admin SDK inicializado correctamente");
  console.log(`✓ Proyecto confirmado: ${admin.app().options.projectId}`);
} catch (error) {
  console.error("❌ ERROR al inicializar Firebase Admin SDK:", error.message);
  process.exit(1);
}

// UID del usuario admin@taxipro.com (verificado en Firebase Authentication)
const uid = "hDglTz8dSyNKKSqso27ny8rMQCV2";
const email = "admin@taxipro.com";

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
    console.log("   Authentication → Users → admin@taxipro.com → Custom Claims");
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
