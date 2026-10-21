import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(here, "..", "dist", "assets");

await sharp(path.join(source, "logo.svg"), { density: 300 })
  .resize({ width: 1600 })
  .png()
  .toFile(path.join(here, "logo-primary.png"));

await sharp(path.join(source, "monogram.svg"), { density: 300 })
  .resize({ width: 900, height: 900 })
  .png()
  .toFile(path.join(here, "monogram.png"));

await sharp(path.join(source, "isilda-maria-da-costa-e-silva.webp"))
  .png()
  .toFile(path.join(here, "isilda-maria-da-costa-e-silva.png"));

