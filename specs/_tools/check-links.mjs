#!/usr/bin/env node
/**
 * Kiểm mọi link tương đối trong specs/**\/*.md có trỏ tới file có thật không.
 *
 *   node specs/_tools/check-links.mjs
 *
 * Bộ specs này nối chéo nhau nhiều (screen spec → wireframe → ADR → gap-list → _common),
 * nên một lần đổi tên file là gãy hàng loạt link mà không có gì báo. Link gãy trong hồ sơ
 * gửi khách trông rất tệ, và không có build nào bắt được.
 */
import { readdir, readFile, access } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";

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

const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

async function main() {
  let bad = 0;
  let total = 0;
  for (const file of await mdFiles("specs")) {
    const md = await readFile(file, "utf8");
    const re = /\]\(([^)#\s]+)(#[^)\s]*)?\)/g;
    let m;
    while ((m = re.exec(md))) {
      const href = m[1];
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      total += 1;
      const target = resolve(dirname(file), href);
      if (!(await exists(target))) {
        bad += 1;
        const line = md.slice(0, m.index).split("\n").length;
        console.error(`✗ ${file}:${line} → ${href}`);
      }
    }
  }
  console.log(`${total} link nội bộ · gãy ${bad}`);
  if (bad > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
