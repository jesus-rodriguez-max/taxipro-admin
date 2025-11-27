// verify-setup.cjs
// Script para verificar que todo está listo antes de ejecutar set-admin.cjs
const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando configuración del proyecto taxipro-admin...\n");

let allGood = true;

// 1. Verificar que existe package.json
console.log("1️⃣ Verificando package.json...");
if (fs.existsSync("./package.json")) {
  const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  if (pkg.dependencies && pkg.dependencies["firebase-admin"]) {
    console.log("   ✅ package.json existe y tiene firebase-admin");
  } else {
    console.log("   ⚠️  firebase-admin no está en dependencies");
    allGood = false;
  }
} else {
  console.log("   ❌ package.json no encontrado");
  allGood = false;
}

// 2. Verificar que existe node_modules/firebase-admin
console.log("\n2️⃣ Verificando instalación de firebase-admin...");
if (fs.existsSync("./node_modules/firebase-admin")) {
  console.log("   ✅ firebase-admin está instalado");
} else {
  console.log("   ❌ firebase-admin no está instalado");
  console.log("   💡 Ejecuta: npm install");
  allGood = false;
}

// 3. Verificar que existe set-admin.cjs
console.log("\n3️⃣ Verificando script set-admin.cjs...");
if (fs.existsSync("./set-admin.cjs")) {
  const content = fs.readFileSync("./set-admin.cjs", "utf8");
  if (content.includes("admin.credential.cert")) {
    console.log("   ✅ set-admin.cjs existe y usa credencial explícita");
  } else {
    console.log("   ⚠️  set-admin.cjs no usa credencial explícita");
    allGood = false;
  }
} else {
  console.log("   ❌ set-admin.cjs no encontrado");
  allGood = false;
}

// 4. Verificar que existe service-account.json
console.log("\n4️⃣ Verificando service-account.json...");
if (fs.existsSync("./service-account.json")) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync("./service-account.json", "utf8"));
    if (serviceAccount.project_id === "taxipro-chofer") {
      console.log("   ✅ service-account.json existe y es del proyecto correcto");
      console.log(`   📧 Service Account: ${serviceAccount.client_email}`);
    } else {
      console.log(`   ⚠️  service-account.json es del proyecto: ${serviceAccount.project_id}`);
      console.log("   ⚠️  Debería ser: taxipro-chofer");
      allGood = false;
    }
  } catch (error) {
    console.log("   ❌ service-account.json existe pero no es JSON válido");
    allGood = false;
  }
} else {
  console.log("   ❌ service-account.json NO ENCONTRADO");
  console.log("\n   📋 ACCIÓN REQUERIDA:");
  console.log("   1. Lee las instrucciones en: INSTRUCCIONES_SERVICE_ACCOUNT.md");
  console.log("   2. Descarga la clave de Firebase Console");
  console.log("   3. Guárdala como: service-account.json");
  console.log("   4. Vuelve a ejecutar este script");
  allGood = false;
}

// 5. Verificar .gitignore
console.log("\n5️⃣ Verificando .gitignore...");
if (fs.existsSync("./.gitignore")) {
  const gitignore = fs.readFileSync("./.gitignore", "utf8");
  if (gitignore.includes("service-account.json")) {
    console.log("   ✅ service-account.json está en .gitignore");
  } else {
    console.log("   ⚠️  service-account.json NO está en .gitignore");
    console.log("   ⚠️  ¡PELIGRO! Podrías subir credenciales a Git");
    allGood = false;
  }
} else {
  console.log("   ⚠️  .gitignore no encontrado");
}

// Resultado final
console.log("\n" + "=".repeat(60));
if (allGood) {
  console.log("✅ TODO LISTO PARA EJECUTAR set-admin.cjs");
  console.log("\n💡 Siguiente paso:");
  console.log("   node set-admin.cjs");
} else {
  console.log("❌ HAY PROBLEMAS QUE RESOLVER");
  console.log("\n💡 Revisa los mensajes anteriores y corrige los errores");
  console.log("💡 Luego ejecuta este script nuevamente: node verify-setup.cjs");
}
console.log("=".repeat(60) + "\n");

process.exit(allGood ? 0 : 1);
