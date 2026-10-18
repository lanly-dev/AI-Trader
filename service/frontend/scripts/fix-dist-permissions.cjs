/**
 * postbuild: make the built `dist/` output world-readable.
 *
 * The original `chmod -R a+rX dist` breaks `npm run build` on Windows
 * (no chmod.exe). This script is a no-op there — Windows ACLs already
 * grant the builder read access — and runs chmod everywhere else.
 */
const { execFileSync } = require("child_process");
const path = require("path");

if (process.platform === "win32") {
  process.exit(0);
}

const distDir = path.resolve(__dirname, "..", "dist");

try {
  const fs = require("fs");
  if (!fs.existsSync(distDir)) {
    // Nothing to fix up (e.g. a build step that was skipped).
    process.exit(0);
  }
  execFileSync("chmod", ["-R", "a+rX", distDir], { stdio: "inherit" });
} catch (err) {
  console.error("fix-dist-permissions: chmod failed:", err.message);
  process.exit(1);
}
