import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entry for gta6-clipper-01: the submission is a single video address.
// This program copies VIDEO.json from the repo root into the output dir.
const botDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

// Validate the entry before copying: VIDEO.json must name a YouTube URL.
const videoPath = join(botDir, "VIDEO.json");
const video = JSON.parse(readFileSync(videoPath, "utf8"));
if (typeof video.url !== "string" || !video.url.startsWith("https://www.youtube.com/")) {
  throw new Error("VIDEO.json must carry a https://www.youtube.com/ url");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(videoPath, join(outDir, "VIDEO.json"));
