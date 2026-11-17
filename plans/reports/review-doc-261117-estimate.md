---
failed: true
warnings: 3
result: 1 Critical, 3 Warning — estimate.md của LAB-5 đúng toàn bộ số SWP/giờ/MD/MM, chỉ sai một con số tổng của LAB-1
---

# Review estimate.md

Cách kiểm: script Python đọc `backlog.csv` (136 dòng: 10 epic + 103 issue + 23 sub), tự xác định vật chứa = dòng `type=epic` hoặc có con (29 dòng) và dòng chấm trực tiếp = 107 dòng. Tính lại giờ từng dòng bằng công thức của file. Đối chiếu Project qua `scripts/fetch-project-items.py` (136 item). Số LAB-1 lấy từ `AIDD for PL/Output/07_estimate-wbs-cost.xlsx`, sheet Summary.

## Checklist Verdicts

Không có checklist. Kết quả theo yêu cầu riêng:

| # | Yêu cầu | Kết quả |
|---|---|---|
| 1 | Đủ 5 phần, đúng thứ tự (a)–(e) | Đạt: dòng 3 (HTML), mục 1 (Issue mẫu), mục 2 (Cách quy ra giờ), mục 3 (Tổng theo epic), mục 4 (So với LAB-1) |
| 2 | Bảng issue mẫu có cột "Bạn chốt" và "Lý do", kể cả issue giữ điểm | Đạt: 5/5 dòng đều có cả hai cột |
| 3 | Quy ước giờ nhất quán, áp dụng đúng | Đạt: tính lại 107 dòng với hệ số BE 6, FE 4, QA 5, PM 3 và buffer 1,15 cho `constraint` khác rỗng → 0 dòng lệch quá 0,05 giờ so với cột `hours` |
| 4 | Bẫy đếm hai lần | Đạt: tổng chỉ cộng 107 dòng chấm trực tiếp. SWP 428, giờ 2 471,9 (làm tròn 2 472), 309 MD, 15,45 MM đều khớp. Từng epic khớp (E1 42/242,9 … E10 61/379,3). Vai: BE 255, FE 73, QA 82, PM 18 và số item 59/23/17/8 khớp. 57 dòng có ràng buộc = 231 SWP (54%). Bình quân 5,78 giờ/SWP khớp |
| 5 | So với LAB-1 có lý do cho chỗ lệch lớn | Đạt: FN-06 +97%, FN-07 +29%, các nhóm âm đều có lý do. Ánh xạ epic→nhóm cộng đúng (E4+E10 = 81,7; E5+E6 = 50,2; tổng chín nhóm = 309,0). Xem Critical #1 cho con số tổng LAB-1 |
| 6 | Mô hình SWP | Đạt: file viết "Scope × Complexity → SWP … không bao giờ cộng hai trục". Ma trận 6×6 khớp `SWP_MATRIX` (làm tròn nửa lên: 1,25→1; 2,5→3; 7,5→8; 19,5→20). Dòng `E6-I1` có `swp_ai`=1 và `swp_final`=3, khớp phần giải thích |
| 7 | Tổng khớp `backlog.csv` và Project | Đạt: 136/136 item Project khớp `swp_rollup`/`hours_rollup` (hoặc `swp_final`/`hours`), 0 lệch. Tổng 107 dòng chấm trực tiếp trên Project = 428,0 SWP và 2 471,9 giờ |

## Critical Issues

| # | Lỗi | File | Trích dẫn 2 đầu | Mức độ | Đề xuất sửa | PM quyết định |
|---|---|---|---|---|---|---|
| 1 | Tổng LAB-1 sai 0,5 MD. 12 nhóm FN cộng 431,5 và KD-001…016 là 289,5, tổng đúng là 721,0, không phải 720,5. Số 720,5 không có trong nguồn | `estimate.md` dòng 137 | File: `309 MD so thẳng với 720,5 MD tổng của LAB-1`. Nguồn (`07_estimate-wbs-cost.xlsx`, Summary): `共通・横断＋管理（KD-001〜016）` = 289,5, và 12 dòng FN cộng 431,5 (lệnh Python `sum([...])` = 721.0) | Critical (lỗi số học) | Đổi 720,5 thành 721,0. Số 356,0 / 75,5 / 289,5 và phép so 309 với 356 vẫn đúng | |

## Warnings

| # | Lỗi | File | Trích dẫn 2 đầu | Mức độ | Đề xuất sửa | PM quyết định |
|---|---|---|---|---|---|---|
| 1 | Cột "Số item" đếm 126 dòng (gồm 19 issue vật chứa), nhưng dòng 6 nói 107 item chấm trực tiếp. Hai con số cạnh nhau không giải thích. SWP/giờ không bị đếm đôi (đã kiểm), chỉ nhãn dễ gây hiểu nhầm. Đếm lại: epic E1 có 11 dòng chấm trực tiếp, bảng ghi 12 | `estimate.md` dòng 6 và dòng 109 | `trên 107 item chấm trực tiếp` / `\| **Tổng** \| **126** \| **428** \|` | Warning | Đổi tiêu đề cột thành "Số issue (gồm vật chứa)" hoặc ghi cả hai số, vd `126 (107 chấm trực tiếp)` | |
| 2 | Khẳng định không có căn cứ: "Nếu đưa ba nhóm bị cắt vào, con số sẽ vượt LAB-1". LAB-5 không có số nào cho ba nhóm đó (0 MD), nên không tính được | `estimate.md` mục 4, đoạn "Chênh −13% …" | `Nếu đưa ba nhóm bị cắt vào, con số` / `sẽ vượt LAB-1` | Warning | Bỏ câu, hoặc ghi là phỏng đoán chưa ước | |
| 3 | Nguồn số LAB-1 (file xlsx, ô B8/B11) nằm ngoài repo công khai này nên người đọc không tự đối chiếu được 41,5 / 39,0 / 289,5 … Chỉ tên sheet được nêu, không có đường dẫn | `estimate.md` dòng ~66 và mục 4 | `ô \`B11\`, sheet Summary` / `LAB-1 ước theo 12 nhóm chức năng` | Warning | Thêm đường dẫn/tên file LAB-1 (hoặc ghi rõ "bản nội bộ, không có trong repo") | |

## Not Verified

- Ngoài ý kiến về nội dung: các lý do định tính ở mục 4 (vd `GAP-01` "3 trên 9 ngưỡng", `GAP-16` "4 issue", `GAP-20`, `GAP-24`) trỏ sang `specs/` và `docs/` chưa đối chiếu từng mã. Chỉ kiểm phần số.
- Cụm "lệch 0 dòng" so với `SWP_MATRIX` trong mã skill: không có mã nguồn skill để chạy lại. Đã kiểm độc lập trên `backlog.csv`: 106/107 dòng có `swp_ai` khớp ma trận theo `scope`/`complexity`; dòng còn lại là `E6-I1`, bị hiệu chỉnh có chủ đích (khớp mục Issue mẫu).
- Ô tổng (`総合計`) của sheet Summary LAB-1 không có giá trị đã tính (công thức chưa lưu cache), nên 721,0 là tổng tôi cộng từ các dòng nhóm, không đọc từ ô tổng.
- Nội dung nhúng của `reports/swp-lab5-backlog.html` chỉ đọc lướt (hiệu chỉnh `calibrated` xuất hiện); chưa đối chiếu toàn bộ dữ liệu kiểm toán nhúng.
- Không thấy mật khẩu, khóa bí mật hay đoạn chép nguyên văn RFP trong `estimate.md` (grep mẫu `password|ghp_|AKIA|sk-` → không khớp).
