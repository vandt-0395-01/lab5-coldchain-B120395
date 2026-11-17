#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dung images/burndown.csv va images/burndown.svg tu ket qua mo phong Sprint 1.

Duong ke hoach: tieu deu 69 SWP tren 10 ngay cong.
Duong thuc te: cong don SWP cua cac issue dat dinh nghia xong trong ngay do.
PNG sinh tu SVG bang ImageMagick (xem lenh cuoi file).
"""
import csv
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "images")

TOTAL = 69.0
DAYS = [
    # (ngay, [(so issue, SWP, ma backlog)])
    ("2026-11-02", []),
    ("2026-11-03", [(54, 1, "E3-I17"), (107, 1, "E7-I5")]),
    ("2026-11-04", [(106, 1, "E7-I4")]),
    ("2026-11-05", [(70, 3, "E10-I1")]),
    ("2026-11-06", [(118, 3, "E4-I9-S1"), (131, 2, "E6-I2-S1")]),
    ("2026-11-09", [(97, 3, "E6-I1")]),
    ("2026-11-10", [(93, 3, "E5-I11"), (7, 2, "E9-I6")]),
    ("2026-11-11", [(3, 5, "E9-I2"), (8, 3, "E9-I1-S1")]),
    ("2026-11-12", [(9, 4, "E9-I4-S1"), (132, 5, "E7-I1-S1"), (6, 3, "E9-I5")]),
    ("2026-11-13", [(4, 3, "E9-I3"), (135, 3, "E8-I1-S1")]),
]


def build_rows():
    rows = [{
        "ngay_thu": 0, "ngay": "2026-11-02 (bat dau)",
        "ke_hoach_con_lai": "%.1f" % TOTAL,
        "thuc_te_con_lai": "%.1f" % TOTAL,
        "swp_dong_trong_ngay": "0",
        "issue_dong": "",
    }]
    remaining = TOTAL
    step = TOTAL / len(DAYS)
    for n, (date, closed) in enumerate(DAYS, start=1):
        got = sum(c[1] for c in closed)
        remaining -= got
        rows.append({
            "ngay_thu": n,
            "ngay": date,
            "ke_hoach_con_lai": "%.1f" % (TOTAL - step * n),
            "thuc_te_con_lai": "%.1f" % remaining,
            "swp_dong_trong_ngay": "%d" % got,
            "issue_dong": " ".join("#%d %s" % (c[0], c[2]) for c in closed),
        })
    return rows, remaining


def write_csv(rows):
    path = os.path.join(OUT, "burndown.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    return path


# --- ve SVG ------------------------------------------------------------------
W, H = 960, 540
L, R, T, B = 78, 40, 86, 84          # le trai/phai/tren/duoi
PW, PH = W - L - R, H - T - B
YMAX = 72.0


def px(n):
    return L + PW * n / 10.0


def py(v):
    return T + PH * (1 - v / YMAX)


def write_svg(rows):
    plan = [(px(int(r["ngay_thu"])), py(float(r["ke_hoach_con_lai"]))) for r in rows]
    act = [(px(int(r["ngay_thu"])), py(float(r["thuc_te_con_lai"]))) for r in rows]

    s = []
    a = s.append
    a('<?xml version="1.0" encoding="UTF-8"?>')
    a('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" '
      'viewBox="0 0 %d %d" '
      'font-family="Helvetica Neue,Helvetica,Arial,sans-serif">' % (W, H, W, H))
    a('<rect width="%d" height="%d" fill="#ffffff"/>' % (W, H))
    a('<text x="%d" y="32" font-size="19" font-weight="bold" fill="#111">'
      'Burndown Sprint 1 — Yuki Cold Chain (02/11 – 13/11/2026)</text>' % L)
    a('<text x="%d" y="54" font-size="13" fill="#666">'
      'Trục dọc: SWP còn lại của 22 issue có điểm riêng (69 SWP) '
      'trên 10 ngày công.</text>' % L)

    # luoi ngang
    v = 0
    while v <= 70:
        y = py(v)
        a('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#e8e8e8" stroke-width="1"/>'
          % (L, y, L + PW, y))
        a('<text x="%d" y="%.1f" font-size="12" fill="#777" text-anchor="end">%d</text>'
          % (L - 10, y + 4, v))
        v += 10

    # truc
    a('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#333" stroke-width="1.5"/>'
      % (L, T, L, T + PH))
    a('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#333" stroke-width="1.5"/>'
      % (L, T + PH, L + PW, T + PH))

    # nhan truc ngang
    labels = ["BĐ"] + [r["ngay"][5:].replace("-", "/") for r in rows[1:]]
    for n, lab in enumerate(labels):
        x = px(n)
        a('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#333" stroke-width="1"/>'
          % (x, T + PH, x, T + PH + 5))
        a('<text x="%.1f" y="%d" font-size="11" fill="#555" text-anchor="middle">%s</text>'
          % (x, T + PH + 20, lab))
    a('<text x="%.1f" y="%d" font-size="12" fill="#555" text-anchor="middle">'
      'Ngày công</text>' % (L + PW / 2.0, T + PH + 42))
    a('<text x="%d" y="%d" font-size="12" fill="#555" text-anchor="end">'
      'SWP còn lại</text>' % (L + 10, T - 14))

    # Duong noi phai ve bang tung doan <line>: bo chuyen SVG cua ImageMagick
    # bo qua <polyline fill="none"> nen ca hai duong burndown bien mat.
    def polyline(points, color, width, dash=""):
        for (x1, y1), (x2, y2) in zip(points, points[1:]):
            a('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" '
              'stroke-width="%s" %s stroke-linecap="round"/>'
              % (x1, y1, x2, y2, color, width,
                 'stroke-dasharray="%s"' % dash if dash else ""))

    polyline(plan, "#8e9196", "2.5", "8 6")   # ke hoach
    polyline(act, "#c0392b", "3.4")           # thuc te
    for x, y in act:
        a('<circle cx="%.1f" cy="%.1f" r="4" fill="#c0392b"/>' % (x, y))

    # khoang lech cuoi sprint
    xe, ye = act[-1]
    a('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#c0392b" '
      'stroke-width="1.5" stroke-dasharray="3 3"/>' % (xe, ye, xe, py(0)))
    a('<text x="%.1f" y="%.1f" font-size="13" font-weight="bold" fill="#c0392b" '
      'text-anchor="end">còn 24 SWP — 35%% khối lượng</text>' % (xe - 12, ye + 30))

    # moc bi chan
    xb = px(3)
    a('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#e67e22" stroke-width="2" '
      'stroke-dasharray="4 4"/>' % (xb, T + 6, xb, T + PH))
    a('<text x="%.1f" y="%d" font-size="12" fill="#e67e22">'
      '#71 bị chặn — chờ khách chốt phút nghỉ tối thiểu</text>' % (xb + 8, T + 20))

    # chu thich
    a('<rect x="%d" y="%d" width="252" height="52" fill="#fff" stroke="#ddd"/>'
      % (L + PW - 252, T + 8))
    a('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#8e9196" stroke-width="2.5" '
      'stroke-dasharray="8 6"/>' % (L + PW - 240, T + 26, L + PW - 204, T + 26))
    a('<text x="%d" y="%d" font-size="12" fill="#333">Kế hoạch (6,9 SWP/ngày)</text>'
      % (L + PW - 196, T + 30))
    a('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#c0392b" stroke-width="3.4"/>'
      % (L + PW - 240, T + 46, L + PW - 204, T + 46))
    a('<text x="%d" y="%d" font-size="12" fill="#333">Thực tế</text>'
      % (L + PW - 196, T + 50))

    a('</svg>')
    path = os.path.join(OUT, "burndown.svg")
    open(path, "w", encoding="utf-8").write("\n".join(s))
    return path


if __name__ == "__main__":
    rows, remaining = build_rows()
    assert abs(remaining - 24.0) < 1e-9, remaining
    print("csv:", write_csv(rows))
    print("svg:", write_svg(rows))
    print("SWP con lai cuoi sprint:", remaining)
