#!/usr/bin/env node
/**
 * Đối chiếu mọi mã yêu cầu viết trong specs với sổ đăng ký yêu cầu của LAB-1.
 *
 *   node specs/_tools/check-req-codes.mjs
 *
 * VÌ SAO CẦN: mã bịa là loại lỗi lặp lại nhiều nhất của bài này, và nguy hiểm vì nó
 * trông y hệt mã thật. Đã bắt được:
 *   - `FR-MST-01`, `FR-MST-02` trong screen spec (mã thật: `DR-MST-01`)
 *   - `BR-EXP-03`, `FR-ALM-01`, `FR-ALM-02`, `OPS-HACCP-01` trong wireframe —
 *     bốn mã này còn được IN LÊN ẢNH và tồn tại suốt từ lúc dựng wireframe
 *
 * Ba cổng kiểm kia không bắt được: link vẫn sống, sơ đồ vẫn đúng cú pháp, và mã yêu cầu
 * không phải định danh trong CSDL nên bộ kiểm schema không soi tới.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const REGISTRY = "docs/01_requirements-extract.md";
const CODE = /\b(BR|FR|NFR|DR|IF|OPS|ACC)-[A-Z]+-\d+\b/g;

/** File chỉ ghi lại lỗi đã sửa thì được phép trích nguyên văn mã sai. */
const SKIP_FILES = new Set(["ai-log.md", "review-report.md", "AI-report.md", "PENDING.md", "check-req-codes.mjs"]);

async function walk(dir, exts) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "_templates") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, exts)));
    else if (exts.some((x) => e.name.endsWith(x)) && !SKIP_FILES.has(e.name)) out.push(p);
  }
  return out;
}

async function main() {
  const registry = await readFile(REGISTRY, "utf8");
  const known = new Set(registry.match(CODE) ?? []);
  if (known.size === 0) {
    console.error(`Không đọc được mã nào từ ${REGISTRY} — sai đường dẫn?`);
    process.exit(2);
  }

  // Soi cả .md (specs) lẫn .mjs (_tools/screens.mjs — nguồn in mã lên ảnh wireframe)
  const files = await walk("specs", [".md", ".mjs"]);
  const bad = new Map();
  let total = 0;
  for (const f of files) {
    const text = await readFile(f, "utf8");
    CODE.lastIndex = 0;
    let m;
    while ((m = CODE.exec(text))) {
      total += 1;
      if (known.has(m[0])) continue;
      const line = text.slice(0, m.index).split("\n").length;
      if (!bad.has(m[0])) bad.set(m[0], []);
      bad.get(m[0]).push(`${f}:${line}`);
    }
  }

  for (const [code, where] of [...bad].sort()) {
    console.error(`✗ \`${code}\` KHÔNG có trong sổ đăng ký yêu cầu — ${where.slice(0, 4).join(", ")}${where.length > 4 ? ` (+${where.length - 4})` : ""}`);
  }
  console.log(`\n${total} lần trích mã yêu cầu · ${known.size} mã hợp lệ trong sổ · mã bịa ${bad.size}`);
  if (bad.size > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
