#!/usr/bin/env node
// verificar-admin.cjs
// Script para verificar que el usuario admin tiene el rol asignado correctamente

const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

console.log("\n" + "=".repeat(70));
console.log("  🔍 VERIFICACIÓN DE ROL ADMINISTRADOR - TaxiPro");
console.log("=".repeat(70) + "\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const targetEmail = "admin@taxipro.com";
const targetUID = "hDglTz8dSyNKKSqso27ny8rMQCV2";

console.log("📋 Buscando usuario administrador...\n");

admin
  .auth()
  .getUser(targetUID)
  .then((userRecord) => {
    console.log("✅ USUARIO ENCONTRADO\n");
    console.log("📧 Email:", userRecord.email);
    console.log("🆔 UID:", userRecord.uid);
    console.log("📅 Creado:", new Date(userRecord.metadata.creationTime).toLocaleString());
    console.log("✉️  Verificado:", userRecord.emailVerified ? "Sí" : "No");
    console.log("🚫 Deshabilitado:", userRecord.disabled ? "Sí" : "No");
    
    console.log("\n" + "-".repeat(70) + "\n");
    
    if (userRecord.customClaims && userRecord.customClaims.role === "admin") {
      console.log("✅ ROL ADMIN ASIGNADO CORRECTAMENTE");
      console.log("\n🏷️  Custom Claims:");
      console.log(JSON.stringify(userRecord.customClaims, null, 2));
      
      console.log("\n" + "-".repeat(70) + "\n");
      console.log("🎉 TODO ESTÁ CORRECTO");
      console.log("\n📝 Próximos pasos:");
      console.log("   1. Inicia el servidor: npm run dev");
      console.log("   2. Abre: http://localhost:5173/login");
      console.log("   3. Inicia sesión con:");
      console.log(`      Email: ${userRecord.email}`);
      console.log("      Password: (tu contraseña)");
      console.log("\n⚠️  Si ya estabas logueado, cierra sesión primero");
      console.log("   para que los nuevos claims tomen efecto.\n");
      
      process.exit(0);
    } else {
      console.log("❌ ROL ADMIN NO ASIGNADO");
      console.log("\n🏷️  Custom Claims actuales:");
      console.log(JSON.stringify(userRecord.customClaims || {}, null, 2));
      console.log("\n💡 Ejecuta: node set-admin.cjs");
      console.log("   para asignar el rol admin.\n");
      
      process.exit(1);
    }
  })
  .catch((error) => {
    console.log("❌ ERROR AL BUSCAR USUARIO\n");
    console.log("Código:", error.code);
    console.log("Mensaje:", error.message);
    
    if (error.code === "auth/user-not-found") {
      console.log("\n💡 El usuario no existe en Firebase Authentication");
      console.log("   Verifica el UID:", targetUID);
      console.log("   Ejecuta: node list-users.cjs");
      console.log("   para ver todos los usuarios disponibles.\n");
    }
    
    process.exit(1);
  });
