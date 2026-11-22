import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entry for gta6-clipper-01: the submission is a single video address.
// This program copies VIDEO.json from the repo root into the output dir.
const botDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

// Validate the entry before copying: VIDEO.json must name a YouTube URL
// (www.youtube.com, youtube.com, or youtu.be) carrying an 11-char video id.
// The sealed scorer refuses VIDEO.json files over 16,384 bytes, so fail
// loudly here instead of shipping an oversize file.
const videoPath = join(botDir, "VIDEO.json");
const rawVideo = readFileSync(videoPath, "utf8");
if (rawVideo.length > 16384) {
  throw new Error(`VIDEO.json is ${rawVideo.length} bytes, over the 16,384-byte limit`);
}
const video = JSON.parse(rawVideo);
const urlPattern = /^https:\/\/(www\.youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}([?&#].*)?$/;
if (typeof video.url !== "string" || !urlPattern.test(video.url)) {
  throw new Error(
    `VIDEO.json url ${JSON.stringify(video.url)} is not a YouTube video url: use https://www.youtube.com/shorts/<11-char id>, watch?v=<id>, or https://youtu.be/<id>`
  );
}

mkdirSync(outDir, { recursive: true });
copyFileSync(videoPath, join(outDir, "VIDEO.json"));
