#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ghi Status cuoi Sprint 1 len GitHub Project V2.

Trang thai cua 22 issue co diem rieng duoc khai bao tay (ket qua mo phong sprint).
Trang thai cua issue vat chua va epic SUY RA tu con, khong khai bao tay —
cha khong the xong truoc con.
"""
import csv
import json
import os
import subprocess
import sys

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ID = "PVT_kwHOEHuOgs4Br8qtzhqM_Ms"  # ghi de ben duoi
PROJECT_ID = "PVT_kwHOEHuOgs4Br8qt"
STATUS_FIELD = "PVTSSF_lAHOEHuOgs4Br8qtzhqM_Ms"
OPTION = {
    "Todo": "7bd6adaa",
    "In Progress": "ec201ad8",
    "Blocked": "311cd95d",
    "Done": "31106584",
}

# --- ket qua mo phong Sprint 1: 22 issue co diem rieng -----------------------
LEAF_STATUS = {
    3: "Done",          # E9-I2
    4: "Done",          # E9-I3
    6: "Done",          # E9-I5
    7: "Done",          # E9-I6
    8: "Done",          # E9-I1-S1
    9: "Done",          # E9-I4-S1
    54: "Done",         # E3-I17
    70: "Done",         # E10-I1
    93: "Done",         # E5-I11
    97: "Done",         # E6-I1
    106: "Done",        # E7-I4
    107: "Done",        # E7-I5
    118: "Done",        # E4-I9-S1
    131: "Done",        # E6-I2-S1
    132: "Done",        # E7-I1-S1
    135: "Done",        # E8-I1-S1
    71: "Blocked",      # E10-I2 — cho khach chot so phut toi thieu moi doan 休憩
    82: "In Progress",  # E10-I13
    108: "In Progress", # E7-I6
    133: "In Progress", # E7-I2-S1
    134: "In Progress", # E7-I3-S1
    136: "Todo",        # E8-I2-S1
}

RANK = {"Todo": 0, "Blocked": 1, "In Progress": 2, "Done": 3}


def rollup(statuses):
    """Trang thai cua vat chua suy tu con.

    - moi con Done            -> Done
    - moi con Todo            -> Todo
    - co con Blocked, chua ai Done -> Blocked
    - con lai                 -> In Progress
    """
    if not statuses:
        return "Todo"
    uniq = set(statuses)
    if uniq == {"Done"}:
        return "Done"
    if uniq == {"Todo"}:
        return "Todo"
    if "Done" not in uniq and "Blocked" in uniq:
        return "Blocked"
    return "In Progress"


def main():
    rows = list(csv.DictReader(open(os.path.join(REPO_DIR, "backlog.csv"))))
    by_id = {r["id"]: r for r in rows}
    kids = {}
    for r in rows:
        kids.setdefault(r["parent"], []).append(r["id"])

    items = json.load(open("/tmp/project_items.json"))
    item_by_issue = {str(i["issue"]): i for i in items}

    status = {}

    def resolve(node_id):
        if node_id in status:
            return status[node_id]
        children = kids.get(node_id, [])
        if children:
            st = rollup([resolve(c) for c in children])
        else:
            gh = by_id[node_id]["gh_issue"]
            st = LEAF_STATUS.get(int(gh), "Todo") if gh else "Todo"
        status[node_id] = st
        return st

    for r in rows:
        resolve(r["id"])

    # kiem tra: moi issue trong LEAF_STATUS phai la la that
    for num in LEAF_STATUS:
        matches = [r for r in rows if r["gh_issue"] == str(num)]
        if not matches:
            sys.exit("khong tim thay issue #%s trong backlog.csv" % num)
        if kids.get(matches[0]["id"]):
            sys.exit("#%s la vat chua, khong duoc khai bao tay" % num)

    ok = err = 0
    for r in rows:
        gh = r["gh_issue"]
        if not gh or gh not in item_by_issue:
            continue
        st = status[r["id"]]
        item = item_by_issue[gh]
        q = (
            'mutation { updateProjectV2ItemFieldValue(input: {'
            'projectId: "%s", itemId: "%s", fieldId: "%s", '
            'value: {singleSelectOptionId: "%s"}}) { projectV2Item { id } } }'
            % (PROJECT_ID, item["item_id"], STATUS_FIELD, OPTION[st])
        )
        p = subprocess.run(
            ["gh", "api", "graphql", "-f", "query=" + q],
            capture_output=True, text=True,
        )
        if p.returncode == 0 and '"errors"' not in p.stdout:
            ok += 1
        else:
            err += 1
            print("  ! #%s %s: %s" % (gh, r["id"], (p.stderr or p.stdout)[:160]))

    print("da ghi: %d, loi: %d" % (ok, err))

    from collections import Counter
    print("phan bo:", dict(Counter(status.values())))
    print("epic:")
    for r in rows:
        if r["type"] == "epic":
            print("  %-4s %s" % (r["id"], status[r["id"]]))


if __name__ == "__main__":
    main()
