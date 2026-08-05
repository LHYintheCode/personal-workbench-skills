#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const selfPath = fileURLToPath(import.meta.url);
const excludedDirectories = new Set([".git", "__pycache__", "node_modules", ".venv"]);
const textExtensions = new Set([
  ".bash",
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".py",
  ".sh",
  ".txt",
  ".yaml",
  ".yml",
]);

const blocked = [
  { label: "macOS home-directory path", pattern: /\/Users\/[A-Za-z0-9._-]+\// },
  { label: "Windows home-directory path", pattern: /[A-Za-z]:\\Users\\[^\\\r\n]+\\/i },
  { label: "private Vault identifier", pattern: /MediaContentVault|\/OBSIDIAN\//i },
  { label: "likely platform work id", pattern: /\b\d{16,20}\b/ },
  {
    label: "credential assignment",
    pattern: /\b(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][^"']{6,}["']/i,
  },
];

async function collect(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(target)));
    else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) files.push(target);
  }
  return files;
}

const failures = [];
for (const file of await collect(repositoryRoot)) {
  if (file === selfPath) continue;
  const text = await fs.readFile(file, "utf8");
  for (const rule of blocked) {
    if (rule.pattern.test(text)) {
      failures.push(`${path.relative(repositoryRoot, file)}: ${rule.label}`);
    }
  }
}

if (failures.length) {
  console.error("Privacy scan failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Privacy scan passed.");
}
