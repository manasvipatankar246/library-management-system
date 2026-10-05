const assert = require("assert");
const fs = require("fs");

console.log("Running Library Management System tests...");

// Test 1: package.json exists
assert.strictEqual(fs.existsSync("package.json"), true);
console.log("✓ package.json exists");

// Test 2: backend server exists
assert.strictEqual(fs.existsSync("server/server.js"), true);
console.log("✓ Backend server exists");

// Test 3: frontend page exists
assert.strictEqual(fs.existsSync("public/index.html"), true);
console.log("✓ Frontend page exists");

// Test 4: project name is correct
const packageData = require("./package.json");
assert.strictEqual(packageData.name, "library-management-system");
console.log("✓ Project name is correct");

console.log("All tests passed successfully!");