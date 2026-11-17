#!/usr/bin/env python3
"""Nối sub-issue theo quan hệ cha-con của backlog, rồi thêm vào Project V2 và điền 6 trường.

  python3 scripts/link-and-fill-project.py E9        # một epic
  python3 scripts/link-and-fill-project.py --all     # tất cả
"""
import csv, json, subprocess, sys, collections, time

REPO = "vandt-0395-01/lab5-coldchain-B120395"
OWNER, PNUM = "vandt-0395-01", "1"
PID = "PVT_kwHOEHuOgs4Br8qt"
SPRINT1 = "da735d68"   # 02–15/11/2026, đã kết thúc
SPRINT2 = "a7de9206"   # 16–29/11/2026

def sh(a, check=True):
    p = subprocess.run(a, capture_output=True, text=True)
    if check and p.returncode: raise SystemExit(f"LỖI {' '.join(a[:5])}\n{p.stderr[:500]}")
    return p.stdout.strip()

def gql(q, **kw):
    a = ["gh", "api", "graphql", "-f", f"query={q}"]
    for k, v in kw.items(): a += ["-f", f"{k}={v}"]
    return json.loads(sh(a))

def fields():
    d = json.loads(sh(["gh","project","field-list",PNUM,"--owner",OWNER,"--format","json","--limit","40"]))
    out = {}
    for f in d["fields"]:
        out[f["name"]] = {"id": f["id"], "opts": {o["name"]: o["id"] for o in f.get("options", [])}}
    return out

def node_ids(nums):
    """issue number -> node id, lấy theo lô."""
    out = {}
    for i in range(0, len(nums), 40):
        chunk = nums[i:i+40]
        parts = " ".join(f'i{n}: issue(number: {n}) {{ id number }}' for n in chunk)
        q = f'{{ repository(owner:"{OWNER}", name:"lab5-coldchain-B120395") {{ {parts} }} }}'
        d = gql(q)["data"]["repository"]
        for v in d.values():
            if v: out[str(v["number"])] = v["id"]
    return out

def main():
    args = sys.argv[1:]
    allm = "--all" in args
    tg = [a for a in args if not a.startswith("--")]
    rows = [r for r in csv.DictReader(open("backlog.csv", encoding="utf-8")) if r.get("gh_issue")]
    sel = [r for r in rows if allm or r["id"].split("-")[0] in tg]
    if not sel: raise SystemExit("không có dòng nào có gh_issue")
    F = fields()
    nid = node_ids([r["gh_issue"] for r in rows])
    byid = {r["id"]: r for r in rows}

    # 1) nối sub-issue
    linked = 0
    for r in sel:
        p = byid.get(r["parent"])
        if not p: continue
        q = ('mutation($p:ID!,$c:ID!){ addSubIssue(input:{issueId:$p, subIssueId:$c})'
             '{ issue { number } } }')
        a = ["gh","api","graphql","-f",f"query={q}","-F",f"p={nid[p['gh_issue']]}","-F",f"c={nid[r['gh_issue']]}"]
        pr = subprocess.run(a, capture_output=True, text=True)
        if pr.returncode == 0: linked += 1
        elif "already" not in pr.stderr.lower(): print(f"  ! nối {r['id']}: {pr.stderr[:150]}")
        time.sleep(0.25)
    print(f"đã nối {linked} quan hệ sub-issue")

    # 2) thêm vào Project + điền trường
    filled = 0
    for r in sel:
        url = f"https://github.com/{REPO}/issues/{r['gh_issue']}"
        item = json.loads(sh(["gh","project","item-add",PNUM,"--owner",OWNER,"--url",url,"--format","json"]))["id"]
        def setf(name, **kv):
            f = F.get(name)
            if not f: return
            a = ["gh","project","item-edit","--id",item,"--project-id",PID,"--field-id",f["id"]]
            for k,v in kv.items(): a += [f"--{k}", str(v)]
            subprocess.run(a, capture_output=True, text=True)
        swp = r["swp_final"] or r["swp_rollup"]
        hrs = r["hours"] or r["hours_rollup"]
        if swp: setf("SWP", number=swp)
        if hrs: setf("Hours", number=hrs)
        setf("Epic", text=r["id"].split("-")[0])
        if r["role"] and "Role" in F and r["role"] in F["Role"]["opts"]:
            setf("Role", **{"single-select-option-id": F["Role"]["opts"][r["role"]]})
        if r["type"] != "epic":
            it = SPRINT1 if r.get("sprint") == "1" else SPRINT2
            a = ["gh","project","item-edit","--id",item,"--project-id",PID,
                 "--field-id",F["Iteration"]["id"],"--iteration-id",it]
            subprocess.run(a, capture_output=True, text=True)
        st = F.get("Status", {}).get("opts", {})
        todo = next((v for k,v in st.items() if k.lower() in ("todo","to do","backlog")), None)
        if todo: setf("Status", **{"single-select-option-id": todo})
        filled += 1
        if filled % 10 == 0: print(f"  … {filled}/{len(sel)}")
        time.sleep(0.3)
    print(f"đã thêm và điền trường cho {filled} item")

if __name__ == "__main__":
    main()
