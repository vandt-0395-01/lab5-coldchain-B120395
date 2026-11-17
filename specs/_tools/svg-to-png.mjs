#!/usr/bin/env node
/**
 * Xuất mọi file .svg trong specs/{feature}/assets/ ra .png cùng tên.
 *
 *   node specs/_tools/svg-to-png.mjs
 *
 * Dùng Chrome có sẵn trên máy qua DevTools Protocol. Không chọn ImageMagick vì bộ dựng
 * SVG của nó xử lý chữ kém — bài này có cả tiếng Việt có dấu lẫn tiếng Nhật trên một ảnh.
 */
import { spawn } from "node:child_process";
import { readdir, readFile, writeFile, rm } from "node:fs/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const PROFILE = `${process.env.TMPDIR ?? "/tmp"}svg-to-png-profile`;
const FEATURES = ["receiving", "inventory", "outbound", "routing", "alarms", "traceability", "master"];
const SCALE = 2;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cdp(ws) {
  let id = 0;
  const waiting = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && waiting.has(m.id)) {
      const { resolve, reject } = waiting.get(m.id);
      waiting.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  });
  return (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      waiting.set(n, { resolve, reject });
      ws.send(JSON.stringify({ id: n, method, params }));
      setTimeout(() => waiting.has(n) && (waiting.delete(n), reject(new Error(`${method} quá hạn`))), 30_000);
    });
}

async function main() {
  const jobs = [];
  for (const f of FEATURES) {
    const dir = `specs/${f}/assets`;
    let names = [];
    try { names = await readdir(dir); } catch { continue; }
    for (const n of names.filter((x) => x.endsWith(".svg"))) {
      jobs.push({ svg: `${dir}/${n}`, png: `${dir}/${n.replace(/\.svg$/, ".png")}` });
    }
  }
  if (jobs.length === 0) { console.error("Không thấy file .svg nào — chạy render-wireframes.mjs trước."); process.exit(1); }

  await rm(PROFILE, { recursive: true, force: true });
  const chrome = spawn(CHROME, [
    "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`,
    "--hide-scrollbars", "--no-first-run", "--disable-gpu", "--force-device-scale-factor=1",
  ], { stdio: "ignore" });

  try {
    for (let i = 0; i < 60; i += 1) {
      try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch { await sleep(250); }
    }

    for (const job of jobs) {
      const svg = await readFile(job.svg, "utf8");
      const w = Number(/width="(\d+)"/.exec(svg)?.[1] ?? 1440);
      const h = Number(/height="(\d+)"/.exec(svg)?.[1] ?? 900);

      const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
      const ws = new WebSocket(target.webSocketDebuggerUrl);
      await new Promise((r, j) => { ws.addEventListener("open", r); ws.addEventListener("error", j); });
      const send = cdp(ws);
      try {
        await send("Page.enable");
        await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: SCALE, mobile: false });
        const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0}</style>${svg}`;
        await send("Page.navigate", { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });
        await sleep(700);
        const { data } = await send("Page.captureScreenshot", {
          format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 },
        });
        await writeFile(job.png, Buffer.from(data, "base64"));
        console.log(`✓ ${job.png}  (${w}x${h} @${SCALE}x)`);
      } catch (e) {
        console.error(`✗ ${job.png} — ${e.message}`);
        process.exitCode = 1;
      } finally {
        ws.close();
        await fetch(`http://127.0.0.1:${PORT}/json/close/${target.id}`).catch(() => {});
      }
    }
  } finally {
    chrome.kill();
    await rm(PROFILE, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
