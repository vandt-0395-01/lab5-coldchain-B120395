#!/usr/bin/env python3
"""Thay mã tạm (E3-I5, E10-I6-S2…) trong các file .md bằng số issue thật trên GitHub.

  python3 scripts/replace-temp-ids-with-issue-numbers.py --dry-run
  python3 scripts/replace-temp-ids-with-issue-numbers.py

Thay dạng `E3-I5` -> `E3-I5 (#42)`, giữ lại mã tạm để còn tra được trong backlog.csv.
Mã epic trần (E3, E10) KHÔNG đụng tới vì chúng vừa là mã epic vừa là tiền tố.
"""
import csv, re, sys, pathlib

FILES = ["PREMISE.md", "task-breakdown.md", "estimate.md", "progress-report.md", "README.md"]

def main():
    dry = "--dry-run" in sys.argv
    num = {r["id"]: r["gh_issue"] for r in csv.DictReader(open("backlog.csv", encoding="utf-8"))
           if r.get("gh_issue")}
    # chỉ mã có phần -I: tránh đụng mã epic trần
    ids = sorted((k for k in num if "-I" in k), key=len, reverse=True)
    pat = re.compile(r"`(" + "|".join(re.escape(i) for i in ids) + r")`(?!\s*\(#)")
    total = 0
    for f in FILES:
        p = pathlib.Path(f)
        if not p.exists(): continue
        t = p.read_text(encoding="utf-8")
        new, n = pat.subn(lambda m: f"`{m.group(1)}` (#{num[m.group(1)]})", t)
        if n:
            total += n
            print(f"  {f}: {n} chỗ")
            if not dry: p.write_text(new, encoding="utf-8")
    print(f"tổng {total} chỗ" + (" (chỉ in thử)" if dry else " — đã ghi"))

if __name__ == "__main__":
    main()
