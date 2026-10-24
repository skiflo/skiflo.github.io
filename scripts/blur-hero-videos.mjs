/**
 * Bakes ~4px-equivalent blur into hero MP4s (replaces runtime CSS filter).
 * Requires sharp sources at public/hero/hero-ski-a.mp4 & hero-ski-b.mp4 — run after
 * swapping Pexels downloads, or point INPUT_* at unblurred copies.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ffmpeg = (await import("ffmpeg-static")).default;
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const heroDir = path.join(root, "public", "hero");

const BLUR = "gblur=sigma=2.5";
const ENCODE = [
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "27",
  "-pix_fmt",
  "yuv420p",
  "-an",
  "-movflags",
  "+faststart",
];

function blurFile(name) {
  const input = path.join(heroDir, `${name}.mp4`);
  const output = path.join(heroDir, `${name}.blurred.tmp.mp4`);
  const result = spawnSync(
    ffmpeg,
    ["-y", "-i", input, "-vf", BLUR, ...ENCODE, output],
    { stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
  spawnSync("mv", ["-f", output, input], { stdio: "inherit" });
  console.log(`Updated ${input}`);
}

for (const name of ["hero-ski-a", "hero-ski-b"]) {
  blurFile(name);
}
