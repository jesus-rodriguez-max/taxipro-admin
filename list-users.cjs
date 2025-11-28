// list-users.cjs
// Script para listar usuarios de Firebase Authentication
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

console.log("🔍 Listando usuarios de Firebase Authentication...\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

admin
  .auth()
  .listUsers(100)
  .then((listUsersResult) => {
    console.log(`📊 Total de usuarios encontrados: ${listUsersResult.users.length}\n`);
    
    listUsersResult.users.forEach((userRecord) => {
      console.log("─".repeat(60));
      console.log(`📧 Email: ${userRecord.email || "N/A"}`);
      console.log(`🆔 UID: ${userRecord.uid}`);
      console.log(`📅 Creado: ${new Date(userRecord.metadata.creationTime).toLocaleString()}`);
      console.log(`✅ Verificado: ${userRecord.emailVerified ? "Sí" : "No"}`);
      
      if (userRecord.customClaims) {
        console.log(`🏷️  Custom Claims: ${JSON.stringify(userRecord.customClaims)}`);
      } else {
        console.log(`🏷️  Custom Claims: (ninguno)`);
      }
      
      if (userRecord.disabled) {
        console.log(`⚠️  Estado: DESHABILITADO`);
      }
    });
    
    console.log("─".repeat(60));
    console.log("\n✅ Listado completo");
    
    // Buscar específicamente admin@taxipro.com.mx
    const adminUser = listUsersResult.users.find(u => u.email === "admin@taxipro.com.mx");
    if (adminUser) {
      console.log("\n🎯 USUARIO ADMIN ENCONTRADO:");
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   UID: ${adminUser.uid}`);
      console.log(`   Custom Claims: ${JSON.stringify(adminUser.customClaims || {})}`);
    } else {
      console.log("\n⚠️  NO SE ENCONTRÓ admin@taxipro.com.mx");
      console.log("   Verifica que el usuario exista en Firebase Authentication");
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ ERROR al listar usuarios:", error.message);
    process.exit(1);
  });
