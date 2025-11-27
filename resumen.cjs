#!/usr/bin/env node
// resumen.cjs
// Muestra un resumen visual del estado del módulo taxipro-admin

const fs = require("fs");

console.clear();
console.log("\n" + "=".repeat(70));
console.log("  🔐 MÓDULO TAXIPRO-ADMIN - ASIGNACIÓN DE ROL ADMINISTRADOR");
console.log("=".repeat(70) + "\n");

// Estado del proyecto
console.log("📊 ESTADO DEL PROYECTO:\n");

const checks = [
  {
    name: "Script set-admin.cjs corregido",
    check: () => {
      if (!fs.existsSync("./set-admin.cjs")) return false;
      const content = fs.readFileSync("./set-admin.cjs", "utf8");
      return content.includes("admin.credential.cert") && 
             content.includes("hDgITz8dSyNKKsqso27ny8rMQCV2");
    }
  },
  {
    name: "firebase-admin instalado",
    check: () => fs.existsSync("./node_modules/firebase-admin")
  },
  {
    name: "service-account.json en .gitignore",
    check: () => {
      if (!fs.existsSync("./.gitignore")) return false;
      const content = fs.readFileSync("./.gitignore", "utf8");
      return content.includes("service-account.json");
    }
  },
  {
    name: "Documentación completa",
    check: () => {
      return fs.existsSync("./GUIA_RAPIDA.md") &&
             fs.existsSync("./INSTRUCCIONES_SERVICE_ACCOUNT.md") &&
             fs.existsSync("./README_ADMIN_SETUP.md");
    }
  },
  {
    name: "Script de verificación",
    check: () => fs.existsSync("./verify-setup.cjs")
  },
  {
    name: "service-account.json descargado",
    check: () => {
      if (!fs.existsSync("./service-account.json")) return false;
      try {
        const content = JSON.parse(fs.readFileSync("./service-account.json", "utf8"));
        return content.project_id === "taxipro-chofer";
      } catch {
        return false;
      }
    },
    critical: true
  }
];

checks.forEach(({ name, check, critical }) => {
  const passed = check();
  const icon = passed ? "✅" : (critical ? "🔴" : "⚠️ ");
  console.log(`   ${icon} ${name}`);
});

console.log("\n" + "-".repeat(70) + "\n");

// Verificar si falta el service account
const hasServiceAccount = fs.existsSync("./service-account.json");

if (!hasServiceAccount) {
  console.log("🔴 ACCIÓN REQUERIDA: Descargar service-account.json\n");
  console.log("   El archivo service-account.json es necesario para ejecutar el script.");
  console.log("   Este archivo contiene las credenciales de Firebase Admin SDK.\n");
  console.log("📋 PASOS RÁPIDOS:\n");
  console.log("   1. Abre Firebase Console:");
  console.log("      https://console.firebase.google.com/project/taxipro-chofer/settings/serviceaccounts/adminsdk\n");
  console.log("   2. Haz clic en 'Generar nueva clave privada'\n");
  console.log("   3. Renombra el archivo descargado a: service-account.json\n");
  console.log("   4. Muévelo a esta carpeta:\n");
  console.log("      /home/jesus-rodriguez/ecosistema-taxipro/taxipro-admin/\n");
  console.log("📚 DOCUMENTACIÓN DETALLADA:\n");
  console.log("   • Guía rápida (5 min):  cat GUIA_RAPIDA.md");
  console.log("   • Instrucciones paso a paso:  cat INSTRUCCIONES_SERVICE_ACCOUNT.md");
  console.log("   • Documentación completa:  cat README_ADMIN_SETUP.md\n");
} else {
  console.log("✅ TODO LISTO PARA ASIGNAR ROL DE ADMIN\n");
  console.log("🚀 SIGUIENTE PASO:\n");
  console.log("   node set-admin.cjs\n");
  console.log("   Esto asignará el rol 'admin' al usuario admin@taxipro.com.mx\n");
}

console.log("-".repeat(70) + "\n");

// Información del usuario
console.log("👤 USUARIO ADMINISTRADOR:\n");
console.log("   Email:  admin@taxipro.com.mx");
console.log("   UID:    hDgITz8dSyNKKsqso27ny8rMQCV2");
console.log("   Claim:  { role: 'admin' }\n");

// Proyecto Firebase
console.log("🔥 PROYECTO FIREBASE:\n");
console.log("   ID:     taxipro-chofer");
console.log("   Region: us-central1\n");

console.log("=".repeat(70) + "\n");

// Comandos útiles
console.log("💡 COMANDOS ÚTILES:\n");
console.log("   node verify-setup.cjs    # Verificar configuración");
console.log("   node set-admin.cjs       # Asignar rol admin");
console.log("   npm run dev              # Iniciar servidor de desarrollo\n");

console.log("=".repeat(70) + "\n");
