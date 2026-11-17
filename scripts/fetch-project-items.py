#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Doc toan bo item cua GitHub Project V2 kem gia tri truong tu tao.

Ly do phai dung GraphQL: `gh project item-list --format json` KHONG tra ve
gia tri cua truong tu tao (SWP, Hours, Role, Epic, Iteration) — nhin vao
tuong nhu rong het.

Dung:  python3 scripts/fetch-project-items.py [duong-dan-ghi-ra.json]
Mac dinh ghi ra stdout mot dong JSON tom tat, kem file day du neu co tham so.
"""
import json
import subprocess
import sys
from collections import Counter

OWNER = "vandt-0395-01"
NUMBER = 1

QUERY = """
query($login: String!, $num: Int!, $cursor: String) {
  user(login: $login) {
    projectV2(number: $num) {
      items(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          content { ... on Issue { number title state url } }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldTextValue   { text   field { ... on ProjectV2FieldCommon { name } } }
              ... on ProjectV2ItemFieldNumberValue { number field { ... on ProjectV2FieldCommon { name } } }
              ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2FieldCommon { name } } }
              ... on ProjectV2ItemFieldIterationValue    { title field { ... on ProjectV2FieldCommon { name } } }
            }
          }
        }
      }
    }
  }
}
"""


def fetch():
    import tempfile
    import os
    fd, qpath = tempfile.mkstemp(suffix=".graphql")
    with os.fdopen(fd, "w") as f:
        f.write(QUERY)
    try:
        items = []
        cursor = None
        while True:
            # `gh api graphql -f query=<chuoi nhieu dong>` bao loi cu phap;
            # phai dua query qua file bang -F query=@file.
            cmd = ["gh", "api", "graphql", "-F", "query=@" + qpath,
                   "-F", "login=" + OWNER, "-F", "num=%d" % NUMBER]
            if cursor:
                cmd += ["-F", "cursor=" + cursor]
            out = subprocess.run(cmd, capture_output=True, text=True)
            if out.returncode != 0:
                sys.exit("gh loi: " + out.stderr[:400])
            page = json.loads(out.stdout)["data"]["user"]["projectV2"]["items"]
            for n in page["nodes"]:
                c = n["content"] or {}
                rec = {"item_id": n["id"], "issue": c.get("number"),
                       "title": c.get("title"), "state": c.get("state"),
                       "url": c.get("url")}
                for fv in n["fieldValues"]["nodes"]:
                    if not fv:
                        continue
                    name = (fv.get("field") or {}).get("name")
                    if not name:
                        continue
                    rec[name] = (fv.get("text") or fv.get("number")
                                 or fv.get("name") or fv.get("title"))
                items.append(rec)
            if not page["pageInfo"]["hasNextPage"]:
                return items
            cursor = page["pageInfo"]["endCursor"]
    finally:
        os.unlink(qpath)


if __name__ == "__main__":
    items = fetch()
    if len(sys.argv) > 1:
        json.dump(items, open(sys.argv[1], "w"), ensure_ascii=False, indent=1)
        print("da ghi %d item vao %s" % (len(items), sys.argv[1]))
    print("tong item:", len(items))
    for f in ("Status", "Iteration", "Role", "Epic"):
        print(" ", f, dict(Counter(i.get(f) for i in items)))
    print("  tong SWP (moi item, ke ca vat chua):",
          sum(i.get("SWP") or 0 for i in items))
    print("  tong Hours (moi item, ke ca vat chua):",
          round(sum(i.get("Hours") or 0 for i in items), 1))
