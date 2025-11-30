const fs = require("fs");

const folders = ["config", "controllers", "models", "public", "routes"];
const files = [
  "server.js",
  "public/auth.js",
  "public/index.html",
  "public/login.html",
  "public/register.html",
  "public/script.js"
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

files.forEach((file) => {
  fs.writeFileSync(file, "");
});

console.log("Estrutura criada com sucesso!");
