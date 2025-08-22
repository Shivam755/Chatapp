#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const name = process.argv[2];
if (!name) {
  console.error(
    "❌ Please provide a name. Example: npm run generate:module user"
  );
  process.exit(1);
}

const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
const camelName = name.charAt(0).toLowerCase() + name.slice(1);

// Base directories – adjust paths if your src structure differs
const baseDirs = {
  controller: path.join(__dirname, "..", "src", "controllers"),
  service: path.join(__dirname, "..", "src", "services"),
  repository: path.join(__dirname, "..", "src", "repositories"),
  router: path.join(__dirname, "..", "src", "router"),
};

// Ensure directories exist
Object.values(baseDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// File templates
const files = {
  controller: `
class ${pascalName}Controller {
  constructor({${pascalName}Service}) {
    this.${camelName}Service = ${pascalName}Service;
  }

  async getAll(req, res) {
    const data = await this.${camelName}Service.getAll();
    res.json(data);
  }
}

module.exports = ${pascalName}Controller;
`,

  service: `
class ${pascalName}Service {
  constructor({${pascalName}Repository}) {
    this.${camelName}Repository = ${pascalName}Repository;
  }

  async getAll() {
    return this.this.${camelName}Repository.findAll();
  }
}

module.exports = ${pascalName}Service;
`,

  repository: `
class ${pascalName}Repository {
  constructor({${pascalName}}) {
    this.${pascalName} = ${pascalName};
  }
  async findAll() {
    // DB logic here
    return [];
  }
}

module.exports = ${pascalName}Repository;
`,

  route: `
const router = require("express").Router();
const { GetContainer } = require("../container");

const Get${pascalName}Routes = async () => {
  const container = await GetContainer();
  const permissionController = container.resolve("${camelName}Controller");
  const authMiddleware = container.resolve("authMiddleware");

  // register routes here

  return router;
}

module.exports = Get${pascalName}Routes;
`,
};

// Create each file in its respective folder
Object.entries(files).forEach(([type, content]) => {
  const filePath = path.join(baseDirs[type], `${name}.${type}.js`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trimStart());
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️ Already exists: ${filePath}`);
  }
});
