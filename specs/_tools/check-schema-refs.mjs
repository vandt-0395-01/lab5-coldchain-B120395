#!/usr/bin/env node
/**
 * Đối chiếu mọi tên bảng / cột / enum viết trong specs với schema THẬT đang chạy.
 *
 *   npm run specs:check-schema
 *
 * Vì sao cần: viết tài liệu thiết kế từ trí nhớ là đường ngắn nhất tới một cái tên cột
 * nghe rất hợp lý nhưng không tồn tại. Lần đầu chạy bộ kiểm này nó bắt được 7 tên bịa
 * trong chính file database design — `measured_c` (thật là `measured_temp_c`),
 * `label_expiry_date` (thật là `expiry_date` + `declared_expiry_type`), `rice_origin_info`
 * (thật là `rice_origin`), và 4 cột ngưỡng giờ lái sai tên.
 *
 * Không có build nào bắt được loại lỗi này: tài liệu vẫn hiển thị đẹp, chỉ là nói sai.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;

/** Từ viết trong backtick trông giống định danh SQL. */
const IDENT = /`([a-z][a-z0-9_]{2,})`/g;

/** Bỏ qua: từ khoá SQL, tên file, lệnh npm, thứ không phải định danh schema. */
const IGNORE = new Set([
  "npm", "run", "null", "true", "false", "text", "uuid", "date", "numeric", "integer", "boolean",
  "timestamptz", "jsonb", "enum", "insert", "update", "delete", "select", "now", "gen_random_uuid",
  "public", "max", "min", "service_role", "authenticated", "anon", "draft", "confirmed",
  "available", "quarantine", "held", "scrapped", "created", "allocated", "business_review",
  "delivered", "open", "closed", "effective_from", "effective_to",
]);

/**
 * Bốn file này GHI LẠI các lỗi đã bị bắt, nên trích nguyên văn tên sai là đúng việc của
 * chúng. Bắt lỗi ở đó là dương tính giả.
 *
 * ĐÂY LÀ ĐƯỜNG MIỄN TRỪ DUY NHẤT. Nó miễn theo TÊN FILE, không theo nội dung — thêm một
 * file vào đây là tắt bộ kiểm cho cả file đó. Chỉ thêm file có việc duy nhất là ghi lại lỗi.
 */
const SKIP_FILES = new Set(["ai-log.md", "AI-report.md", "review-report.md", "PENDING.md"]);

async function mdFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "_templates" || e.name === "_tools") continue;
    if (e.isFile() && SKIP_FILES.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await mdFiles(p)));
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) { console.error("Thiếu DATABASE_URL trong .env.local."); process.exit(2); }
  const db = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await db.connect();

  const known = new Set();
  for (const q of [
    `select table_name as n from information_schema.tables where table_schema='public'`,
    `select column_name as n from information_schema.columns where table_schema='public'`,
    `select t.typname as n from pg_type t join pg_namespace s on s.oid=t.typnamespace where s.nspname='public' and t.typtype='e'`,
    `select e.enumlabel as n from pg_enum e`,
    `select p.proname as n from pg_proc p join pg_namespace s on s.oid=p.pronamespace where s.nspname='public'`,
    `select tgname as n from pg_trigger where not tgisinternal`,
    // tên tham số của hàm RPC (p_order_id, p_actor…) — specs có trích tới chúng
    `select unnest(p.proargnames) as n from pg_proc p
       join pg_namespace s on s.oid = p.pronamespace where s.nspname='public'`,
  ]) {
    for (const r of (await db.query(q)).rows) known.add(String(r.n).toLowerCase());
  }
  await db.end();

  // Nạp trước tên cột của các bảng THIẾT KẾ chưa dựng, để lớp kiểm 1 không báo sai.
  for (const file of await mdFiles("specs")) {
    const md = await readFile(file, "utf8");
    let inDesign = false;
    for (const ln of md.split("\n")) {
      if (/^###\s+\d+\.\d+\.\s+`[a-z_]+`/.test(ln)) {
        inDesign = /TH\u1ebeT K\u1ebe|ch\u01b0a d\u1ef1ng|ch\u01b0a c\u00f3/i.test(ln);
        if (inDesign) {
          const t = /`([a-z_]+)`/.exec(ln);
          if (t) known.add(t[1].toLowerCase());
        }
        continue;
      }
      if (/^##\s/.test(ln)) inDesign = false;
      if (!inDesign) continue;
      const row = /^\|\s*\d+\s*\|[^|]*\|[^|]*\|\s*`([a-z_]+)`\s*\|/.exec(ln);
      if (row) known.add(row[1].toLowerCase());
    }
  }

  const unknown = new Map(); // tên -> [file:dòng]
  let checked = 0;
  for (const file of await mdFiles("specs")) {
    const md = await readFile(file, "utf8");
    let m;
    IDENT.lastIndex = 0;
    while ((m = IDENT.exec(md))) {
      const name = m[1].toLowerCase();
      if (IGNORE.has(name) || name.includes(".") || name.endsWith("_md")) continue;
      // chỉ soi định danh có gạch dưới: tên bảng/cột ở đây đều dạng snake_case
      if (!name.includes("_")) continue;
      checked += 1;
      if (!known.has(name)) {
        const line = md.slice(0, m.index).split("\n").length;
        if (!unknown.has(name)) unknown.set(name, []);
        unknown.get(name).push(`${file}:${line}`);
      }
    }
  }

  // --- Lớp kiểm thứ hai: cột có thuộc ĐÚNG bảng không ---------------------
  // Lớp thứ nhất chỉ hỏi "tên này có tồn tại ở đâu đó không", nên nó cho qua một cột
  // có thật nhưng bị gán nhầm bảng. Đã dính đúng lỗi đó: tài liệu ghi `lots` có cột
  // `expiry_type`, trong khi cột đó nằm ở `skus` — bộ kiểm vẫn báo xanh.
  // Lớp này soi riêng các mục định nghĩa bảng của BM-50 (`### N.M. \`tên bảng\``):
  // mọi cột khai ở cột "Tên vật lý" của mục đó phải thuộc đúng bảng đó.
  const cols = new Map(); // bảng -> Set(cột)
  {
    const db2 = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await db2.connect();
    const r = await db2.query(
      `select table_name as t, column_name as c from information_schema.columns where table_schema='public'`,
    );
    await db2.end();
    for (const row of r.rows) {
      if (!cols.has(row.t)) cols.set(row.t, new Set());
      cols.get(row.t).add(row.c);
    }
  }

  let misplaced = 0;
  for (const file of await mdFiles("specs")) {
    const md = await readFile(file, "utf8");
    const lines = md.split("\n");
    let table = null;
    let designOnly = false;
    lines.forEach((ln, i) => {
      const head = /^###\s+\d+\.\d+\.\s+`([a-z_]+)`/.exec(ln);
      if (head) {
        // Mục tiêu đề có ghi "THIẾT KẾ" / "chưa dựng" = bảng mới thiết kế, CSDL chưa có.
        // Đây là trường hợp hợp lệ của bộ specs hai lớp: thân specs tả thiết kế đúng,
        // phần prototype chưa làm ghi thành gap. Bỏ qua cả hai lớp kiểm cho mục đó,
        // và nạp tên cột của nó vào tập đã biết để các file khác trích tới không bị báo sai.
        designOnly = /TH\u1ebeT K\u1ebe|ch\u01b0a d\u1ef1ng|ch\u01b0a c\u00f3/i.test(ln);
        table = designOnly ? null : (cols.has(head[1]) ? head[1] : null);
        return;
      }
      if (/^##\s/.test(ln)) table = null;
      if (!table) return;
      // dòng định nghĩa cột: | 3 | | Tên logic | `ten_cot` | kiểu | ...
      const row = /^\|\s*\d+\s*\|[^|]*\|[^|]*\|\s*`([a-z_]+)`\s*\|/.exec(ln);
      if (!row) return;
      if (!cols.get(table).has(row[1])) {
        misplaced += 1;
        console.error(`✗ \`${row[1]}\` KHÔNG thuộc bảng \`${table}\` — ${file}:${i + 1}`);
      }
    });
  }

  for (const [name, where] of [...unknown].sort()) {
    console.error(`✗ \`${name}\` không có trong schema — ${where.slice(0, 3).join(", ")}${where.length > 3 ? ` (+${where.length - 3})` : ""}`);
  }
  console.log(`\n${checked} tham chiếu schema · tên không có ${unknown.size} · gán nhầm bảng ${misplaced}`);
  if (unknown.size > 0 || misplaced > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
