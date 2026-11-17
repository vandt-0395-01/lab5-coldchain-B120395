#!/usr/bin/env node
/**
 * Kiểm cú pháp mọi khối ```mermaid trong specs/**\/*.md.
 *
 *   node specs/_tools/check-mermaid.mjs
 *
 * Sơ đồ sai cú pháp không làm hỏng build — nó chỉ hiện ra một ô báo lỗi đỏ giữa tài liệu
 * khi người chấm mở trên GitHub. Nên phải có bước kiểm riêng.
 *
 * Nạp mermaid từ CDN vào Chrome và gọi mermaid.parse() cho từng khối.
 */
import { spawn } from "node:child_process";
import { readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9335;
const PROFILE = `${process.env.TMPDIR ?? "/tmp"}check-mermaid-profile`;
const MERMAID = "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function mdFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "_templates") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await mdFiles(p)));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function blocks(md) {
  const out = [];
  const re = /```mermaid\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(md))) {
    out.push({ code: m[1], line: md.slice(0, m.index).split("\n").length });
  }
  return out;
}

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
      setTimeout(() => waiting.has(n) && (waiting.delete(n), reject(new Error(`${method} quá hạn`))), 40_000);
    });
}

async function main() {
  const files = await mdFiles("specs");
  const jobs = [];
  for (const f of files) {
    for (const b of blocks(await readFile(f, "utf8"))) jobs.push({ file: f, ...b });
  }
  if (jobs.length === 0) { console.log("Không có khối mermaid nào."); return; }

  await rm(PROFILE, { recursive: true, force: true });
  const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`, "--no-first-run", "--disable-gpu"], { stdio: "ignore" });

  let bad = 0;
  try {
    for (let i = 0; i < 60; i += 1) {
      try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch { await sleep(250); }
    }
    const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: "PUT" })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.addEventListener("open", r); ws.addEventListener("error", j); });
    const send = cdp(ws);

    await send("Page.enable");
    await send("Runtime.enable");
    const html = `<!doctype html><meta charset="utf-8"><body><script type="module">
import mermaid from "${MERMAID}";
mermaid.initialize({ startOnLoad: false });
window.__check = async (code) => { try { await mermaid.parse(code); return "ok"; } catch (e) { return String(e.message ?? e); } };
window.__ready = true;
</script></body>`;
    await send("Page.navigate", { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });

    let ready = false;
    for (let i = 0; i < 60 && !ready; i += 1) {
      await sleep(400);
      const r = await send("Runtime.evaluate", { expression: "window.__ready === true", returnByValue: true });
      ready = r.result.value === true;
    }
    if (!ready) throw new Error("không nạp được mermaid từ CDN (cần mạng)");

    for (const job of jobs) {
      const expr = `window.__check(${JSON.stringify(job.code)})`;
      const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
      const v = r.result.value;
      if (v === "ok") {
        console.log(`✓ ${job.file}:${job.line}`);
      } else {
        bad += 1;
        console.error(`✗ ${job.file}:${job.line}\n  ${String(v).split("\n")[0]}`);
      }
    }
    ws.close();
  } finally {
    chrome.kill();
    await rm(PROFILE, { recursive: true, force: true }).catch(() => {});
  }

  console.log(`\n${jobs.length} sơ đồ · lỗi ${bad}`);
  if (bad > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
