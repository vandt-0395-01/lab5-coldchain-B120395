#!/usr/bin/env python3
"""Đẩy backlog.csv lên GitHub Issues và GitHub Project V2.

Chạy một epic:   python3 scripts/push-backlog-to-github.py E9
Chạy tất cả:     python3 scripts/push-backlog-to-github.py --all
Chỉ in, không ghi: thêm --dry-run

Ghi số issue thật ngược vào backlog.csv (cột `gh_issue`) để chạy lại không tạo trùng.
"""
import csv, json, subprocess, sys, collections, time

REPO = "vandt-0395-01/lab5-coldchain-B120395"
PROJECT = "1"; OWNER = "vandt-0395-01"
CSV = "backlog.csv"
ROLE_ASSIGNEE = {"BE": "Kỹ sư backend", "FE": "Kỹ sư frontend",
                 "QA": "Kỹ sư kiểm thử", "PM": "Quản lý dự án / BrSE"}

def sh(args, check=True):
    p = subprocess.run(args, capture_output=True, text=True)
    if check and p.returncode != 0:
        raise SystemExit(f"LỖI: {' '.join(args[:4])}…\n{p.stderr.strip()[:600]}")
    return p.stdout.strip()

def gql(query, **vars):
    args = ["gh", "api", "graphql", "-f", f"query={query}"]
    for k, v in vars.items():
        args += ["-f", f"{k}={v}"]
    return json.loads(sh(args))

def body_of(r, kids):
    L = []
    if r["type"] == "epic":
        L.append(f"**Epic.** Vật chứa — không ước lượng riêng, điểm là tổng của các issue con.\n")
        L.append(f"- Tổng: **{r['swp_rollup']} SWP · {r['hours_rollup']} giờ**")
        L.append(f"- Số issue con: {len(kids)}")
    else:
        L.append(f"**Spec nguồn:** {r['spec']}\n")
        L.append(f"**Định nghĩa xong:** {r['dod']}\n")
        L.append("| Trường | Giá trị |")
        L.append("|---|---|")
        L.append(f"| Vai phụ trách (giả định) | {ROLE_ASSIGNEE.get(r['role'], r['role'])} |")
        if r["scope"]:
            L.append(f"| Scope × Complexity | {r['scope']} × {r['complexity']} |")
            L.append(f"| SWP (đã review) | **{r['swp_final']}** |")
        else:
            L.append(f"| Scope × Complexity | — (vật chứa, điểm là tổng của sub-issue) |")
            L.append(f"| SWP (đã review) | **{r['swp_rollup']}** — tổng của {len(kids)} sub-issue |")
        L.append(f"| Giờ ước lượng | {r['hours'] or r['hours_rollup']} |")
        if r["constraint"]:
            L.append(f"| Ràng buộc nghiệp vụ | **{r['constraint']}** |")
        if r["depends_on"]:
            L.append(f"| Phụ thuộc | {r['depends_on']} |")
        if r.get("sprint"):
            L.append(f"| Sprint dự kiến | Sprint {r['sprint']} |")
    L.append(f"\n<!-- backlog-id: {r['id']} -->")
    return "\n".join(L)

def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    targets = [a for a in args if not a.startswith("--")]
    allmode = "--all" in args
    rows = list(csv.DictReader(open(CSV, encoding="utf-8")))
    kids = collections.defaultdict(list)
    for r in rows:
        if r["parent"]:
            kids[r["parent"]].append(r["id"])
    sel = [r for r in rows if allmode or r["id"].split("-")[0] in targets]
    sel.sort(key=lambda r: (0 if r["type"] == "epic" else 1 if r["type"] == "issue" else 2))
    print(f"sẽ xử lý {len(sel)} dòng" + (" (chỉ in thử)" if dry else ""))
    num = {r["id"]: r.get("gh_issue", "") for r in rows}
    for r in sel:
        if num.get(r["id"]):
            print(f"  bỏ qua {r['id']} — đã có #{num[r['id']]}")
            continue
        labels = [r["id"].split("-")[0]]
        if r["type"] == "epic": labels.append("epic")
        if r["constraint"] == "giờ lái 2024": labels.append("constraint-2024")
        elif r["constraint"]: labels.append("trap")
        if r["role"]: labels.append(r["role"].lower())
        title = f"[{r['id']}] {r['title']}"
        if dry:
            print(f"  {title[:95]}\n      nhãn: {labels}")
            continue
        out = sh(["gh", "issue", "create", "--repo", REPO, "--title", title,
                  "--body", body_of(r, kids[r["id"]])] +
                 sum([["--label", l] for l in labels], []))
        n = out.rstrip("/").split("/")[-1]
        num[r["id"]] = n
        print(f"  #{n:4} {r['id']:10} {r['title'][:60]}")
        time.sleep(0.4)
    if not dry:
        for r in rows: r["gh_issue"] = num.get(r["id"], "")
        cols = list(rows[0].keys())
        if "gh_issue" not in cols: cols.append("gh_issue")
        with open(CSV, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=cols, quoting=csv.QUOTE_ALL); w.writeheader()
            for r in rows: w.writerow({k: r.get(k, "") for k in cols})
        print("đã ghi cột gh_issue vào", CSV)

if __name__ == "__main__":
    main()
