#!/usr/bin/env node
/**
 * Sinh wireframe từ định nghĩa màn trong screens.mjs.
 *
 *   node specs/_tools/render-wireframes.mjs
 *
 * Mỗi màn ra 5 file trong specs/{feature}/assets/:
 *   SC4-xx_layout.svg       wireframe trơn (nguồn)
 *   SC4-xx_layout.png       bản ảnh để nhúng vào spec
 *   SC4-xx_annotated.svg    bản đánh số callout (nguồn)
 *   SC4-xx_annotated.png    bản ảnh
 *   SC4-xx_items.md         bảng item mục 4.1 của BM-2-901-51
 *
 * VÌ SAO SINH THAY VÌ VẼ TAY: biểu mẫu BM-51 bắt mục 4.2 (validation), 4.3 (data mapping)
 * và mục 5 (event) trỏ tới item bằng ID dạng `A-2`, và ảnh annotated phải mang đúng số đó.
 * Vẽ tay trước rồi viết spec sau thì hai bên chắc chắn lệch, nhất là khi thêm bớt item.
 * Ở đây một định nghĩa sinh ra cả ảnh lẫn bảng item, nên không có đường nào để chúng lệch.
 * File nguồn thật sự để sửa là `screens.mjs`, không phải file .svg.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { SCREENS } from "./screens.mjs";

const W = 1440;
const NAV_W = 232;
const PAD = 28;
const TOPBAR_H = 60;
const C = {
  ink: "#1f2933", mute: "#7b8794", line: "#cbd2d9", soft: "#f5f7fa",
  nav: "#323f4b", navInk: "#e4e7eb", accent: "#2b6cb0", warn: "#b7791f",
  danger: "#c53030", callout: "#c2410c", white: "#ffffff",
};
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Cắt chữ cho vừa bề ngang, ước lượng 7.1px mỗi ký tự ở cỡ 13. */
function fit(text, width, size = 13) {
  const max = Math.floor(width / (size * 0.55));
  const s = String(text);
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

/** Chiều cao mỗi loại item. */
const H = {
  label: 26, text: 46, select: 46, date: 46, number: 46, textarea: 74,
  button: 40, banner: 56, badge: 28, link: 26, checkbox: 28, image: 92,
  table: 0, note: 0,
};

/** Bề ngang dành cho cột số callout bên trái mỗi item, để số không đè lên chữ. */
const GUTTER = 46;

function itemHeight(it) {
  if (it.t === "table") return 34 + (it.rows ?? 3) * 30 + 10;
  if (it.t === "note") return Math.ceil(String(it.name).length / 110) * 17 + 6;
  return H[it.t] ?? 40;
}

function drawItem(it, x, y, w) {
  const p = [];
  const lab = esc(it.name);
  const req = it.req === "Có" ? ` <tspan fill="${C.danger}">*</tspan>` : "";
  switch (it.t) {
    case "label":
      p.push(`<text x="${x}" y="${y + 17}" font-size="13" fill="${C.ink}">${lab}</text>`);
      break;
    case "link":
      p.push(`<text x="${x}" y="${y + 17}" font-size="13" fill="${C.accent}" text-decoration="underline">${lab}</text>`);
      break;
    case "badge": {
      const bw = Math.max(70, lab.length * 7 + 20);
      p.push(`<rect x="${x}" y="${y + 2}" width="${bw}" height="22" rx="11" fill="${C.soft}" stroke="${C.line}"/>`,
        `<text x="${x + bw / 2}" y="${y + 17}" font-size="12" fill="${C.ink}" text-anchor="middle">${lab}</text>`);
      break;
    }
    case "checkbox":
      p.push(`<rect x="${x}" y="${y + 5}" width="16" height="16" rx="3" fill="${C.white}" stroke="${C.line}"/>`,
        `<text x="${x + 24}" y="${y + 18}" font-size="13" fill="${C.ink}">${lab}</text>`);
      break;
    case "button": {
      const bw = Math.max(120, lab.length * 8 + 36);
      const fill = it.variant === "ghost" ? C.white : C.accent;
      const ink = it.variant === "ghost" ? C.ink : C.white;
      p.push(`<rect x="${x}" y="${y + 2}" width="${bw}" height="34" rx="5" fill="${fill}" stroke="${it.variant === "ghost" ? C.line : "none"}"/>`,
        `<text x="${x + bw / 2}" y="${y + 24}" font-size="13" fill="${ink}" text-anchor="middle" font-weight="600">${lab}</text>`);
      break;
    }
    case "banner": {
      const tone = it.tone === "warn" ? C.warn : it.tone === "danger" ? C.danger : C.accent;
      p.push(`<rect x="${x}" y="${y}" width="${w}" height="50" rx="5" fill="${C.soft}" stroke="${tone}"/>`,
        `<rect x="${x}" y="${y}" width="4" height="50" rx="2" fill="${tone}"/>`,
        `<text x="${x + 16}" y="${y + 21}" font-size="12.5" font-weight="600" fill="${tone}">${esc(it.head ?? "")}</text>`,
        `<text x="${x + 16}" y="${y + 39}" font-size="12" fill="${C.ink}">${esc(fit(it.name, w - 40, 12))}</text>`);
      break;
    }
    case "image":
      p.push(`<rect x="${x}" y="${y}" width="${w}" height="86" rx="5" fill="${C.soft}" stroke="${C.line}" stroke-dasharray="5 4"/>`,
        `<text x="${x + w / 2}" y="${y + 48}" font-size="12.5" fill="${C.mute}" text-anchor="middle">${lab}</text>`);
      break;
    case "note":
      p.push(`<text x="${x}" y="${y + 14}" font-size="11.5" fill="${C.mute}" font-style="italic">${esc(fit(it.name, w, 11.5))}</text>`);
      break;
    case "textarea":
      p.push(`<text x="${x}" y="${y + 13}" font-size="12" fill="${C.mute}">${lab}${req}</text>`,
        `<rect x="${x}" y="${y + 20}" width="${w}" height="52" rx="4" fill="${C.white}" stroke="${C.line}"/>`);
      break;
    case "table": {
      const cols = it.cols ?? ["Cột 1", "Cột 2", "Cột 3"];
      const rows = it.rows ?? 3;
      const cw = w / cols.length;
      p.push(`<rect x="${x}" y="${y}" width="${w}" height="${34 + rows * 30}" rx="5" fill="${C.white}" stroke="${C.line}"/>`,
        `<rect x="${x}" y="${y}" width="${w}" height="34" fill="${C.soft}"/>`);
      cols.forEach((c, i) => {
        p.push(`<text x="${x + i * cw + 12}" y="${y + 22}" font-size="11.5" font-weight="600" fill="${C.mute}">${esc(fit(c, cw - 20, 11.5))}</text>`);
        if (i) p.push(`<line x1="${x + i * cw}" y1="${y}" x2="${x + i * cw}" y2="${y + 34 + rows * 30}" stroke="${C.line}"/>`);
      });
      for (let r = 0; r < rows; r += 1) {
        const ry = y + 34 + r * 30;
        p.push(`<line x1="${x}" y1="${ry}" x2="${x + w}" y2="${ry}" stroke="${C.line}"/>`);
        cols.forEach((_, i) => {
          const sample = it.sample?.[r]?.[i];
          const txt = sample ?? "————";
          const fillCol = sample ? C.ink : C.line;
          p.push(`<text x="${x + i * cw + 12}" y="${ry + 20}" font-size="12" fill="${fillCol}">${esc(fit(txt, cw - 20, 12))}</text>`);
        });
      }
      break;
    }
    default: // text / select / date / number
      p.push(`<text x="${x}" y="${y + 13}" font-size="12" fill="${C.mute}">${lab}${req}</text>`,
        `<rect x="${x}" y="${y + 20}" width="${w}" height="26" rx="4" fill="${C.white}" stroke="${C.line}"/>`);
      if (it.t === "select") {
        p.push(`<path d="M ${x + w - 20} ${y + 31} l 5 6 l 5 -6" fill="none" stroke="${C.mute}" stroke-width="1.6"/>`);
      }
      if (it.ph) p.push(`<text x="${x + 10}" y="${y + 38}" font-size="12" fill="${C.line}">${esc(fit(it.ph, w - 40, 12))}</text>`);
  }
  return p.join("\n");
}

function render(screen, annotated) {
  const bodyX = NAV_W + PAD;
  const bodyW = W - NAV_W - PAD * 2;
  const parts = [];
  let y = TOPBAR_H + 24;

  // tiêu đề màn
  parts.push(`<text x="${bodyX}" y="${y + 8}" font-size="21" font-weight="700" fill="${C.ink}">${esc(screen.title)}</text>`);
  y += 26;
  parts.push(`<text x="${bodyX}" y="${y + 8}" font-size="12.5" fill="${C.mute}">${esc(screen.lead)}</text>`);
  y += 20;
  parts.push(`<text x="${bodyX}" y="${y + 8}" font-size="11.5" fill="${C.accent}">Vai dùng: ${esc(screen.roles)}  ·  Yêu cầu: ${esc(screen.reqs.join(" · "))}</text>`);
  y += 30;

  for (const sec of screen.sections) {
    const inner = sec.items.reduce((a, it) => a + itemHeight(it) + 14, 0);
    const secH = 34 + inner + 10;
    parts.push(`<rect x="${bodyX}" y="${y}" width="${bodyW}" height="${secH}" rx="7" fill="${C.white}" stroke="${C.line}"/>`,
      `<text x="${bodyX + GUTTER}" y="${y + 23}" font-size="13" font-weight="700" fill="${C.ink}">${esc(sec.name)}</text>`);
    if (annotated) {
      parts.push(`<rect x="${bodyX + 12}" y="${y + 6}" width="26" height="22" rx="5" fill="${C.callout}"/>`,
        `<text x="${bodyX + 25}" y="${y + 21}" font-size="12.5" font-weight="700" fill="${C.white}" text-anchor="middle">${esc(sec.id)}</text>`);
    }
    let iy = y + 34;
    let n = 0; // dòng ghi chú không phải item, không chiếm số thứ tự
    for (const it of sec.items) {
      const ix = bodyX + GUTTER;
      const iw = bodyW - GUTTER - 16;
      parts.push(drawItem(it, ix, iy, iw));
      if (it.t !== "note") {
        n += 1;
        if (annotated) {
          const code = `${sec.id}-${n}`;
          parts.push(`<rect x="${bodyX + 10}" y="${iy + 1}" width="30" height="20" rx="5" fill="${C.callout}"/>`,
            `<text x="${bodyX + 25}" y="${iy + 15}" font-size="10.5" font-weight="700" fill="${C.white}" text-anchor="middle">${esc(code)}</text>`);
        }
      }
      iy += itemHeight(it) + 14;
    }
    y += secH + 18;
  }

  const height = y + 24;
  const nav = [
    `<rect x="0" y="0" width="${NAV_W}" height="${height}" fill="${C.nav}"/>`,
    `<text x="20" y="34" font-size="14" font-weight="700" fill="${C.white}">Kho lạnh 3 dải nhiệt</text>`,
    `<text x="20" y="52" font-size="11" fill="${C.mute}">三温度帯 · Product B</text>`,
  ];
  screen.nav.forEach((n, i) => {
    const ny = 86 + i * 34;
    const on = n === screen.navActive;
    if (on) nav.push(`<rect x="10" y="${ny - 18}" width="${NAV_W - 20}" height="30" rx="5" fill="${C.accent}"/>`);
    nav.push(`<text x="22" y="${ny + 2}" font-size="12.5" fill="${on ? C.white : C.navInk}">${esc(fit(n, NAV_W - 44, 12.5))}</text>`);
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" font-family="Helvetica Neue, Hiragino Sans, Arial, sans-serif">
<rect width="${W}" height="${height}" fill="${C.soft}"/>
${nav.join("\n")}
<rect x="${NAV_W}" y="0" width="${W - NAV_W}" height="${TOPBAR_H}" fill="${C.white}"/>
<line x1="${NAV_W}" y1="${TOPBAR_H}" x2="${W}" y2="${TOPBAR_H}" stroke="${C.line}"/>
<text x="${W - PAD}" y="30" font-size="13" font-weight="600" fill="${C.ink}" text-anchor="end">${esc(screen.user)}</text>
<text x="${W - PAD}" y="47" font-size="11.5" fill="${C.mute}" text-anchor="end">${esc(screen.userRole)}</text>
${parts.join("\n")}
<text x="${bodyX}" y="${height - 8}" font-size="10.5" fill="${C.mute}">${esc(screen.id)} · ${annotated ? "bản đánh số item (khớp mục 4.1 screen spec)" : "wireframe"} · sinh từ specs/_tools/screens.mjs</text>
</svg>`;
}

function itemTable(screen) {
  const lines = [
    `<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->`,
    ``, `### 4.1 Danh sách item — ${screen.id}`, ``,
    `| ID | Item Name | Item Type | Required | Note |`, `|---|---|---|---|---|`,
  ];
  const TYPE = {
    label: "Label", text: "Text box", select: "Text box", date: "Text box", number: "Text box",
    textarea: "Text box", button: "Button", table: "Label", banner: "Label", badge: "Label",
    link: "Button", checkbox: "Text box", image: "Image", note: "Label",
  };
  for (const sec of screen.sections) {
    lines.push(`| **${sec.id}** | **${sec.name}** | | | |`);
    let n = 0;
    for (const it of sec.items) {
      if (it.t === "note") continue; // ghi chú thiết kế, không phải item trên màn
      n += 1;
      // Banner: tên item là dòng tiêu đề, phần thân dồn vào cột Note cho bảng dễ đọc.
      const name = it.t === "banner" ? it.head : it.name;
      const extra = it.t === "banner" ? [it.name, it.note].filter(Boolean).join(" ") : (it.note ?? "");
      lines.push(`| ${n}.0 | ${name} | ${TYPE[it.t] ?? "Label"} | ${it.req ?? "-"} | ${extra} |`);
    }
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  for (const s of SCREENS) {
    const dir = `specs/${s.feature}/assets`;
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/${s.id}_layout.svg`, render(s, false));
    await writeFile(`${dir}/${s.id}_annotated.svg`, render(s, true));
    await writeFile(`${dir}/${s.id}_items.md`, itemTable(s));
    console.log(`✓ ${s.id} ${s.title}`);
  }
  console.log(`\n${SCREENS.length} màn. Chạy tiếp: node specs/_tools/svg-to-png.mjs`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
