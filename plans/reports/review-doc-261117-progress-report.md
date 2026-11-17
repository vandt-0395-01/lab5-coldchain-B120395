---
failed: 4
warnings: 4
result: FAIL
---

# Review progress-report.md

Cách đếm: `python3 scripts/fetch-project-items.py /tmp/rv_pr.json` (136 item), nối với `backlog.csv` (136 dòng). Vật chứa = `type=epic` hoặc id có dòng con (cột `parent`) hoặc không có trong backlog. Kết quả script: Sprint 1 = 33 item, 22 item có điểm riêng, 69,0 SWP, 346,4 giờ.

## Checklist Verdicts

Không có checklist; kiểm theo 7 yêu cầu riêng của đề.

| # | Yêu cầu | Kết quả |
|---|---|---|
| 1 | Đủ 4 phần, đúng thứ tự (Iteration · thời gian / Trạng thái / Burndown / Rủi ro trễ) | Đạt. Dòng 3 `**Iteration:** Sprint 1 · **Khoảng thời gian giả lập:** 02/11/2026 – 15/11/2026`, rồi mục 1, 2, 3. |
| 2 | Số trạng thái đếm lại được từ Project | Đạt. Bảng 1.1 (16/4/1/1 issue; 45,0/17,0/4,0/3,0 SWP; 226,5/80,3/27,6/12,0 giờ; tỷ lệ 65,2/24,6/5,8/4,3 %), bảng 1.2 (21/6/1/5), bảng 1.3 (SWP và giờ nhận theo vai: 158,4/72,8/67,2/48,0) khớp script từng ô. Trạng thái 10 epic (1.4) khớp trường `Status` của epic trên Project. |
| 3 | Bảng rủi ro có người chịu trách nhiệm + hạn mỗi dòng | Đạt về hình thức (R1–R6 đều có cột "Ai làm, khi nào"). Chỉ có vai trò, không tên người; PREMISE ghi vai là giả định nên chấp nhận được. |
| 4 | Bẫy đếm hai lần | Đạt. 33 / 22 / 69 / 346,4 đều đúng; 11 vật chứa = 33 − 22. Sprint 1 + Sprint 2 = 428 SWP / 2 471,9 giờ, khớp `estimate.md` dòng tổng (428 / 2 472). |
| 5 | Burndown khớp CSV, thực tế = tích luỹ SWP đóng, khớp Done | Đạt phần số. Mọi ô bảng khớp `images/burndown.csv`. Tổng SWP đóng trong ngày trong CSV = 45 = SWP Done của 16 item có điểm riêng; 69 − 45 = 24 khớp ô cuối. Cộng SWP theo từng issue trong cột `issue_dong` ra đúng từng ngày. `images/burndown.png` tồn tại (115 249 byte). Riêng câu diễn giải sai, xem Critical 1. |
| 6 | Tô hồng | Không tô hồng. #71 Blocked nêu rõ; cả 4 item In Progress có điểm riêng (#134, #133, #82, #108) đều nêu; #104, #105 là vật chứa nên không cần dòng riêng; kết luận "Sprint 1 không đạt" khớp 24/69 còn lại. Chỉ có điểm tự nhận lỗi không có số liệu đỡ, xem Warning 2. |
| 7 | Liên kết | Đạt. `images/burndown.png`, `.svg`, `.csv` đều có. URL #71, #82, #108, #133, #134, #136 trùng đúng `url` trong Project. Link board `projects/1` không kiểm được (Not Verified). |

## Critical Issues

| Lỗi | File | Trích dẫn 2 đầu | Mức độ | Đề xuất sửa | PM quyết định |
|---|---|---|---|---|---|
| 1. Số liệu diễn giải burndown tự mâu thuẫn: "50 → 24" là 26 SWP trong 3 ngày (11, 12, 13/11), không phải "hai ngày cuối đóng 18". 18 SWP chỉ đúng với 42 → 24. Cột "Đóng trong ngày" cùng file: 8 + 12 + 6 = 26. | progress-report.md | File: `**Hai ngày cuối dốc đứng (50 → 24, đóng 18 SWP).**` · Nguồn: `images/burndown.csv` dòng `8,2026-11-11,13.8,42.0,8,` (và `10/11` còn 50,0) | Critical | Sửa thành "ba ngày cuối (50 → 24, đóng 26 SWP)" hoặc "hai ngày cuối (42 → 24, đóng 18 SWP)". | |
| 2. Khẳng định về luật lao động không có nguồn và đối nghịch với specs: file nói 改善基準告示 "không quy định cứng số phút tối thiểu mỗi đoạn" và gọi 30 phút liền mạch là "mức an toàn nhất của 改善基準告示". specs/RFP chỉ nói RFP không ghi số và việc đối chiếu 告示 chính thức còn **chưa làm** (DoD của #82). Specs cũng có chỗ coi 10 phút là mức nghỉ không reset. Đây là ràng buộc cứng giờ lái, đọc sai là chốt sai luật. | progress-report.md | File: `nhưng **không quy định cứng số phút tối thiểu mỗi đoạn**` · Nguồn: `specs/routing/detail-design/RTE_ROUTE_PUBLISH_DETAIL.md` `**RFP không ghi số**, CẦN XÁC NHẬN 9`; `backlog.csv` E10-I13 `cả chín ngưỡng được đối chiếu lại với nguồn 改善基準告示 chính thức` | Critical | Bỏ vế khẳng định về nội dung 告示 và vế "mức an toàn nhất". Viết: RFP không ghi số phút nghỉ tối thiểu (CẦN XÁC NHẬN 9), việc đối chiếu 告示 chính thức nằm trong DoD của #82 và chưa xong. Nếu giữ mức tạm 30 phút thì ghi là giả định của đội (cần thêm vào PREMISE), không gán cho 告示. | |
| 3. Mẫu số "năng lực sprint" (160/80/80/60 = 380 giờ) và đội 5 người (có PM) không có trong Project, backlog hay sibling. PREMISE ghi đội **4 người (2 BE, 1 FE, 1 QA)**, tức 320 giờ. Từ đó mức nạp 99 / 91 / 84 / 80 %, R4 ("≈136 giờ", 85 %) và "khoảng 5,6 sprint" (2 125,5 / 380) đều dựa trên số lệch với PREMISE. | progress-report.md | File: `Đội giả lập: 2 BE · 1 FE · 1 QA · 1 PM (kiêm BrSE)` · PREMISE.md: `đội 4 người (2 BE, 1 FE, 1 QA)` | Critical | Thống nhất một cấu hình đội giữa PREMISE và progress-report (sửa PREMISE hoặc bỏ cột PM/380 giờ), ghi nguồn của 160/80/80/60 và tính lại 99 %, 136 giờ, 5,6 sprint theo cấu hình chốt. | |
| 4. Mức độ nặng của R1 bị thổi phồng so với Project: "cả epic E10 (61 SWP) đứng". Trên Project, E10 có 17 item, chỉ 1 Blocked (#71) và 1 PM chờ khách (#82); 1 item E10 đã Done. Số 61 đúng là tổng epic nhưng không phải phần bị chặn. | progress-report.md | File: `cả epic E10 (61 SWP) đứng` · Project: epic #14 `E10` 61 SWP; Sprint 1 E10 = `{'Done': 1, 'Blocked': 1, 'In Progress': 1}` (script) | Critical | Nêu đúng phần bị chặn: #71 (4 SWP) và các issue phụ thuộc `min_break_minutes`; tách "chặn trực tiếp" khỏi "rủi ro lan sang cả epic". | |

## Warnings

| Lỗi | File | Trích dẫn 2 đầu | Mức độ | Đề xuất sửa | PM quyết định |
|---|---|---|---|---|---|
| 1. Số "PM" không nhất quán: burndown nói "Năm issue vai PM đều là soạn câu hỏi rồi chờ khách", R2 nói "5/7 issue PM". Project: vai PM Sprint 1 có 7 item (5 Done, 2 In Progress), thêm #76 ở Sprint 2 = 8 item. "5" không chỉ ra được issue nào. | progress-report.md | File: `5/7 issue PM phải chờ khách` · Project: Role PM = #54 #82 #97 #106 #107 #108 #118 (Sprint 1) và #76 (Sprint 2) | Warning | Liệt kê số issue PM phải chờ khách hoặc bỏ phân số. | |
| 2. Nguyên nhân/giờ thực không có trong dữ liệu: "`#4` ... mất **24 giờ** so với 13,8 giờ ước — vượt 74 %", "Giờ cứu `#4` lấy từ đúng chỗ đáng lẽ dành cho `#136`", "dừng ở ngày 3 sau ~8 giờ", "~85 %", "~15 giờ còn lại". Project chỉ có giờ kế hoạch (#4 = 13,8). `backlog.csv` và Project không có cột giờ thực. | progress-report.md | File: `phải làm gấp mất **24 giờ** so với 13,8 giờ ước` · Project: item #4 `"Hours": 13.8` | Warning | Gắn nguồn cho giờ thực (log công, ghi chú PM) hoặc đánh dấu "ước lượng của PM". Các tỷ lệ % hoàn thành cũng cần nguồn. | |
| 3. "Khoảng 5,6 sprint nữa" chỉ lấy 2 125,5 giờ Sprint 2, trong khi câu trước nói "cộng 24 SWP tồn từ Sprint 1". Giờ tồn Sprint 1 là 346,4 − 226,5 = 119,9; cộng vào còn (2 125,5 + 119,9) / 380 ≈ 5,9. Số mô tả và số tính không cùng phạm vi. | progress-report.md | File: `cộng 24 SWP tồn từ Sprint 1` · File: `khoảng 5,6 sprint nữa` | Warning | Nói rõ 5,6 đã gồm hay chưa gồm phần tồn, rồi tính lại cho nhất quán. | |
| 4. Trường `Iteration` trên Project chỉ có tên `Sprint 1` / `Sprint 2`, không mang ngày. Câu "đếm trực tiếp từ trường `Status`, `SWP`, `Hours`, `Role`, `Iteration`" đúng, nhưng khoảng 02–15/11 và ngày đóng từng issue (burndown theo ngày) chỉ có ở `images/burndown.csv`, không có ở Project. Không nên để người đọc hiểu mọi số đều từ Project. | progress-report.md | File: `Mọi con số dưới đây đếm trực tiếp từ trường` · Project JSON: khoá `Iteration` chỉ có `"Sprint 1"` | Warning | Ghi thêm "số theo ngày lấy từ images/burndown.csv; khoảng thời gian là giả lập theo PREMISE". | |

## Not Verified

- Ngày đóng từng issue (cột `issue_dong` trong `images/burndown.csv`): Project không lưu ngày đóng; chỉ kiểm được tổng và SWP từng issue, không kiểm được ngày.
- Năng lực 160/80/80/60 giờ: không tìm thấy ở nguồn nào (`grep -n "160\|380" PREMISE.md README.md estimate.md task-breakdown.md` → chỉ ra dòng không liên quan).
- Link board `https://github.com/users/vandt-0395-01/projects/1`: không có nguồn trong repo để đối chiếu, không gọi mạng.
- Các chi tiết "tình trạng thật" (~85 %, ~80 %, "khách trả lời 3/8", "đã gửi khách") không có trong Project hay backlog.
- Ngày lễ 文化の日 03/11 và 勤労感謝の日 23/11: không đối chiếu với nguồn trong repo (ngoài phạm vi specs).
