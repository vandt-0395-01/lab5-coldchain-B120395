# Báo cáo review chéo — 17/11/2026

**Kết quả: FAIL — 12 lỗi Critical, 14 Warning.**

Bốn người review chạy song song, **ngữ cảnh sạch**, mỗi người một file, không ai biết phiên viết tài
liệu đã nghĩ gì. Mỗi phát hiện bắt buộc có trích dẫn nguyên văn **cả hai đầu** — câu trong tài liệu và
câu trong nguồn sự thật — rồi chạy lại bằng bộ kiểm trích dẫn:

```
node ~/.claude/skills/tkm/skills/_shared/lib/doc-review-citation-check.cjs --report <file> --root .
```

Cả 4 báo cáo **exit 0, không dòng REJECT nào** — nghĩa là mọi trích dẫn tra lại được, không có phát
hiện nào dựng trên trí nhớ. Báo cáo gốc từng file nằm ở `plans/reports/review-doc-261117-*.md`.

Sau đó tôi **tự kiểm lại từng lỗi Critical** trên nguồn gốc thay vì nhận ở mặt chữ. Cột "Đã kiểm lại"
ghi rõ tôi đã xác nhận bằng cách nào.

---

## Lỗi Critical

| # | Lỗi | File | Trích dẫn 2 đầu | Mức độ | Đề xuất sửa | Đã kiểm lại | PM quyết định |
|---|---|---|---|---|---|---|---|
| C1 | Nói `NFR-SEC-03` có mức P0 ghi rõ, nhưng sổ yêu cầu để trống cột ưu tiên. Lý do làm ngoại lệ cho mã này đổ theo | `PREMISE.md` | **Tài liệu:** "`NFR-SEC-03` … có mức P0 ghi rõ ở dòng 183" · **Nguồn** `docs/01_requirements-extract.md:183`: `\| NFR-SEC-03 \| Mã hoá transit, DB, file đính kèm… \| — \| S3-04, tr.60 \|` | Critical | Bỏ câu "P0 ghi rõ". Giữ `NFR-SEC-03` trong phạm vi thì phải nêu lý do khác (mã hoá dữ liệu cá nhân là nghĩa vụ pháp định), hoặc đưa nó vào nhóm chờ khách xếp ưu tiên | ✔ Đọc trực tiếp dòng 183 — cột ưu tiên là `—` | |
| C2 | **Chạm điều cấm của đề.** Giả định "ngưỡng khoá theo dải" ghi đè một khối RFP đã nêu rõ | `PREMISE.md` | **Tài liệu:** "**(a) Theo dải**, kèm một issue hỏi khách" · **Nguồn** `docs/01_requirements-extract.md:97`: "`FR-TEMP-02` \| Đánh giá từng reading theo **chính sách SKU/zone hiệu lực**… \| P0" | Critical | RFP **tự mâu thuẫn**: `BR-TEMP-01` nói theo dải, `FR-TEMP-02` (P0) nói theo SKU/zone. Chọn một vế **không phải lấp chỗ trống** — phải khai đúng như vậy. Sửa mục 2 của PREMISE: bỏ câu "không dòng nào ghi đè khối RFP đã nêu rõ", thay bằng khai báo chọn tạm vế `BR-TEMP-01` để chạy, kèm issue hỏi khách và ghi là **rủi ro đổi mô hình dữ liệu** | ✔ Đọc dòng 97 — RFP nêu rõ SKU/zone, mức P0 | |
| C3 | Khai "không sửa gì khác" nhưng commit `df6b647` có sửa một detail design không được liệt kê; và `M_77` mới chỉ vào nửa đường | `PREMISE.md` | **Tài liệu:** "không sửa gì khác … giữ nguyên nội dung" · **Nguồn** `git show --name-only df6b647` → `specs/outbound/detail-design/OUT_ALLOCATION_DETAIL.md`; `grep -c M_77 specs/alarms/detail-design/ALM_EXCURSION_EVAL_DETAIL.md` → `0` | Critical | Thêm dòng `OUT_ALLOCATION_DETAIL.md` vào bảng "Spec thêm/bỏ/sửa" (luật bẫy ④: chọn lần giao gần nhất, cùng mốc thì hạn nhỏ nhất). Và **áp `M_77` vào `ALM_EXCURSION_EVAL_DETAIL.md`** — hiện mã mới có trong sổ mã nhưng detail design vẫn viết `422` trần, người làm đọc detail design sẽ dùng lại mã cũ | ✔ `git show --name-only df6b647` liệt kê đúng 3 file; `grep -c M_77` ra 0 | |
| C4 | Số yêu cầu phi chức năng lệch nhau giữa ba chỗ | `PREMISE.md`, `task-breakdown.md`, `backlog.csv` | **Tài liệu:** PREMISE mục 2 "8 … trừ SEC-03", mục 3 "7 mã còn lại"; `E7-I6` "tám … ngoài `NFR-SEC-03`" · **Nguồn** `grep -oE "NFR-[A-Z]+-[0-9]+" docs/01_requirements-extract.md \| sort -u` → **12 mã** | Critical | Đếm lại trên 12 mã thật rồi thống nhất một con số ở cả ba chỗ. Nêu rõ 12 mã đó là gì và mã nào vào backlog, mã nào không | ✔ Đếm bằng lệnh: 12 mã NFR duy nhất | |
| C5 | Nhãn "9 yêu cầu P0 vắng mặt" không khớp danh sách đi kèm, và danh sách có lẫn mã P1 | `PREMISE.md` | **Tài liệu** (dòng 58): "**5. `BR-HACCP-01` và 9 yêu cầu P0 vắng mặt**" rồi liệt kê 6 mã vào + 10 mã để ngoài · **Nguồn:** chính dòng đó — 6 + 10 = **16**, không phải 9; trong 10 mã để ngoài có `FR-INV-01`, `FR-INV-02`, `FR-OUT-03` là **P1** theo sổ yêu cầu | Critical | Tách hai việc đang bị gộp: (a) đúng 9 mã P0 vắng mặt theo `GAP-25` là những mã nào, (b) các mã P1 để ngoài là chuyện khác, liệt kê riêng. Danh sách gốc nằm ở `plans/reports/review-lab4-traceability.md` của repo LAB-2, **không có trong repo này** — phải chép sang hoặc trích đủ vào PREMISE | ✔ Đếm trên dòng 58: 6 + 10 = 16 | |
| C6 | **Lỗi nặng nhất của cả bộ.** Đề bắt 1 issue ≤ 2 ngày công; 72/107 issue được chấm trực tiếp vượt trần đó theo chính số giờ của mình | `task-breakdown.md` | **Tài liệu:** "1 issue làm xong trong ≤ 2 ngày công (16 giờ); lớn hơn thì tách sub-issue" · **Nguồn** `backlog.csv`, lọc dòng không phải epic, không có sub-issue, `hours > 16` → **72 dòng** (53 BE · 16 QA · 3 FE), lớn nhất `E10-I9` = **69,0 giờ** | Critical | Xem bảng quyết định ở cuối báo cáo — đây là điểm cần PM chọn hướng, không sửa một dòng là xong | ✔ Tự chạy lại script lọc: 72 dòng, max 69,0 giờ | |
| C7 | Nói 8 dòng gap mức Thấp đã khai *Chấp nhận*; sổ gap chỉ có 3 | `task-breakdown.md` | **Tài liệu** (dòng 79): "8 dòng gap mức Thấp đã khai *Chấp nhận*" · **Nguồn** `grep -oE '\| *(Chấp nhận)[^\|]*' specs/database/gap-list.md \| wc -l` → **3** (`GAP-10`, `GAP-11`, `GAP-12`) | Critical | Sửa thành 3, và bổ sung hai nhóm đang bị bỏ quên khỏi bảng: 3 dòng *Chờ khách* (`GAP-09`, `GAP-18`, `GAP-26`) và 2 dòng *Chờ PM ký* (`GAP-24`, `GAP-25`) | ✔ Đếm bằng lệnh: đúng 3 | |
| C8 | Tổng estimate LAB-1 ghi sai 0,5 MD | `estimate.md:137` | **Tài liệu:** "Không được đem 309 MD so thẳng với **720,5 MD** tổng của LAB-1" · **Nguồn** `Output/07_estimate-wbs-cost.xlsx`, tab `サマリー Summary`: 12 nhóm `FN-01…12` = 431,5 + `共通・横断＋管理（KD-001〜016）` = 289,5 → **721,0** | Critical | Sửa 720,5 → **721,0**. Các số 356,0 · 75,5 · 289,5 và phép so 309 với 356 vẫn đúng, không phải sửa | ✔ Mở workbook bằng `openpyxl`, cộng lại 13 dòng: 721,0 | |
| C9 | Câu giải thích burndown sai cả số ngày lẫn số điểm | `progress-report.md` | **Tài liệu:** "**Hai ngày cuối dốc đứng (50 → 24, đóng 18 SWP)**" · **Nguồn** `images/burndown.csv`: 50 ở ngày 10/11, 24 ở ngày 13/11 → **3 ngày, đóng 26 SWP**. Hai ngày cuối là 42 → 24 = 18 SWP | Critical | Sửa thành "**Ba ngày cuối dốc đứng (50 → 24, đóng 26 SWP)**" | ✔ Đọc lại `images/burndown.csv`: 50 → 42 → 30 → 24 | |
| C10 | Khẳng định về nội dung 改善基準告示 không có nguồn — đúng kiểu lấp chỗ trống bằng kiến thức phổ thông mà quy ước dự án cấm | `progress-report.md` | **Tài liệu:** "改善基準告示 cho phép chia nhỏ 休憩 nhưng **không quy định cứng số phút tối thiểu mỗi đoạn**" và "chốt tạm **30 phút liền mạch** (mức an toàn nhất của 改善基準告示)" · **Nguồn:** không có. `docs/01_requirements-extract.md` chỉ nói RFP có `FR-SCH-03` "chèn nghỉ trước 4h lái liên tục", không nói gì về số phút tối thiểu mỗi đoạn | Critical | **Không được phát biểu thay văn bản luật.** Viết lại lý do chặn thành: *"RFP không nêu số phút tối thiểu mỗi đoạn nghỉ; đối chiếu bản 告示 chính thức là một phần định nghĩa xong của #82 → cần hỏi khách."* Bỏ cụm "mức an toàn nhất", hoặc giữ con số 30 phút nhưng ghi rõ **[CẦN XÁC NHẬN]**. Sửa cả bình luận đã đăng trên issue #71 | ✔ `grep` toàn bộ `specs/` và `docs/` — không có nguồn nào nói về số phút tối thiểu | |
| C11 | Dựng ra người thứ 5 và năng lực 380 giờ mà không nguồn nào có; PREMISE ghi đội 4 người | `progress-report.md` | **Tài liệu:** "Đội giả lập: 2 BE · 1 FE · 1 QA · 1 PM" và bảng năng lực `PM 60 giờ` · **Nguồn** `PREMISE.md:43`: "Sprint 2 tuần = **10 ngày công**, đội 4 người (2 BE, 1 FE, 1 QA)" | Critical | PM/BrSE **là chính người làm bài**, không phải đầu người thứ 5 của đội phát triển. Sửa: năng lực đội phát triển = 160 + 80 + 80 = **320 giờ**; 48 giờ việc PM tách riêng, ghi rõ là thời gian của PL. Tính lại mức nạp, R4 và con số "5,6 sprint" theo 320 giờ | ✔ Đọc `PREMISE.md:43` — đúng là 4 người, không có PM | |
| C12 | Nói issue bị chặn làm đứng cả epic 61 SWP; dây phụ thuộc chỉ ra 3 SWP | `progress-report.md` | **Tài liệu** (R1): "cả epic E10 (**61 SWP**) đứng" · **Nguồn** `backlog.csv` cột `depends_on`: lan truyền từ `E10-I2` chỉ tới `E10-I11` (**3 SWP**). 14 issue E10 còn lại phụ thuộc `E10-I1` (đã xong), `E10-I4`, `E10-I6`, `E10-I7` — không phụ thuộc `E10-I2` | Critical | Sửa R1 cho đúng mức: `#71` chặn trực tiếp `#80` (`E10-I11`, 3 SWP). Nói riêng phần đúng: câu hỏi khách `#82` phủ "hai điểm CẦN XÁC NHẬN của bộ ngưỡng" nên ảnh hưởng rộng hơn — nhưng phải nêu đúng những issue nào, không quơ cả epic | ✔ Tự lan truyền `depends_on`: chỉ ra `E10-I11` | |

---

## Warning

| # | Vấn đề | File | Trích dẫn 2 đầu | Đề xuất sửa | PM quyết định |
|---|---|---|---|---|---|
| W1 | Điểm P-10 chốt "HACCP không chặn lập lịch", nhưng backlog không có issue nào hỏi khách việc này, trong khi `PENDING.md` nói phải hỏi trước vì ảnh hưởng báo giá | `PREMISE.md` | **Tài liệu:** chốt giữ nguyên hướng LAB-4 · **Nguồn** `docs/01_requirements-extract.md:275` mang nhãn **`[SUY LUẬN]`** — là suy luận của người trích LAB-1, không phải câu RFP; chính dòng đó ghi "chưa có trong RFP → cần hỏi khách" | Thêm một issue vai PM hỏi khách điểm này. Sửa chữ "RFP nói thẳng" thành "suy ra từ sổ yêu cầu, **[CẦN XÁC NHẬN]**" | |
| W2 | Số issue phát sinh ghi "~" không khớp backlog | `PREMISE.md` | **Tài liệu:** tổng "~20" · **Nguồn** `backlog.csv`: 18 | Thay số ước bằng số đếm được | |
| W3 | Giả định đội 4 người bỏ hẳn vai PM, trong khi Project có 8 item `Role = PM` | `PREMISE.md` | **Tài liệu** dòng 43: "đội 4 người (2 BE, 1 FE, 1 QA)" · **Nguồn:** Project có 8 item `Role = PM` | Cùng gốc với C11 — khai rõ PM là PL, không nằm trong 4 người | |
| W4 | Giả định cho sửa chéo phiếu nhập chỉ trích nửa `GAP-09`, bỏ vế hệ quả | `PREMISE.md` | **Tài liệu:** trích vế "có thể là thiết kế đúng" · **Nguồn** `GAP-09` còn vế ghi đè được cột người kiểm trong hồ sơ HACCP; `NFR-SEC-02` đòi tách người lập – người duyệt | Trích đủ cả hai vế, nêu rủi ro với hồ sơ HACCP | |
| W5 | Số NFR còn lại ghi 7 ở file này, 8 ở `backlog.csv` | `task-breakdown.md` | **Tài liệu:** "7" · **Nguồn** `E7-I6`: "tám" | Cùng gốc với C4 | |
| W6 | Nhãn `constraint-2024` ghi 17 issue, nhưng 17 dòng gồm cả epic `E10` | `task-breakdown.md` | **Tài liệu:** "17 issue" · **Nguồn** `backlog.csv`: 17 dòng, 1 là `type=epic` → 16 issue | Sửa thành 16 issue + 1 epic | |
| W7 | Ví dụ sub-issue của `E4-I9` nêu ở phần 1 cũng vượt 16 giờ | `task-breakdown.md` | **Tài liệu:** `E4-I9-S2` 36 giờ, `E4-I9-S3` 24 giờ · **Nguồn:** chính `backlog.csv` | Cùng gốc với C6; ghi riêng để lần sửa không bỏ sót ví dụ | |
| W8 | Cột "Số item" tổng 126 gồm cả 19 vật chứa, đứng cạnh con số 107 mà không giải thích | `estimate.md` | **Tài liệu:** "126" ở bảng và "107 item chấm trực tiếp" ở dòng 6 · **Nguồn** `backlog.csv`: 107 dòng không có con | Thêm một câu nói rõ 126 = 107 chấm trực tiếp + 19 vật chứa. SWP và giờ **không** bị đếm đôi | |
| W9 | Câu suy đoán không có căn cứ | `estimate.md` | **Tài liệu:** "đưa ba nhóm bị cắt vào, con số sẽ vượt LAB-1" · **Nguồn:** LAB-5 không ước ba nhóm đó | Bỏ câu, hoặc đổi thành "chưa ước nên chưa so được" | |
| W10 | Số LAB-1 nằm ngoài repo public, không nêu đường dẫn | `estimate.md` | **Tài liệu:** trích số LAB-1 · **Nguồn:** `07_estimate-wbs-cost.xlsx` không có trong repo | Ghi rõ nguồn là workbook LAB-1 và nó không công khai, để người đọc biết không tự đối chiếu được | |
| W11 | "5/7 issue PM phải chờ khách" không khớp Project | `progress-report.md` | **Tài liệu:** "5/7 issue PM" · **Nguồn:** Project có 8 item `Role = PM` | Đếm lại từ Project | |
| W12 | Các tỷ lệ "~80 %", "~85 %" và giờ thực không có nguồn trên Project | `progress-report.md` | **Tài liệu:** "~85 %, chờ đổi gói hạ tầng" · **Nguồn:** Project không có trường tiến độ | Ghi rõ đây là ước của tổ trưởng trong buổi điểm tin, không phải số đo | |
| W13 | "5,6 sprint" không rõ đã tính phần tồn Sprint 1 chưa | `progress-report.md` | **Tài liệu:** "khoảng 5,6 sprint nữa" · **Nguồn:** 2 125,5 giờ là riêng Sprint 2 | Nói rõ đã/chưa cộng 24 SWP tồn; tính lại theo 320 giờ (C11) | |
| W14 | Câu "mọi con số đếm trực tiếp từ Project" dễ gây hiểu nhầm — Project không lưu ngày | `progress-report.md` | **Tài liệu:** "đếm trực tiếp từ trường `Status`, `SWP`, `Hours`, `Role`, `Iteration`" · **Nguồn:** ngày đóng từng issue lấy từ kịch bản mô phỏng, không từ Project | Thêm một câu tách bạch: số đếm được lấy từ Project; ngày đóng và tỷ lệ tiến độ là kịch bản mô phỏng | |

---

## Chỗ review không kiểm được

| Việc | Vì sao |
|---|---|
| Danh sách gốc "9 mã P0 vắng" | Nằm ở `plans/reports/review-lab4-traceability.md` của repo LAB-2, không chép sang repo này |
| Các trang RFP mà sổ yêu cầu dẫn (D6 tr.38, S3-04 tr.60…) | Không có bản RFP gốc trong repo |
| Nhãn GitHub của từng issue | Dữ liệu Project qua GraphQL không mang trường nhãn |
| Phân loại "45 · 10 · 6 · 6" ở phần 4 `task-breakdown.md` | Đếm bằng `grep` ra 44 · 12 · 5 · 7; chưa phân định được cách phân loại |
| Câu "xanh cả bốn cổng kiểm" ở phần 4 `task-breakdown.md` | Không có bản ghi chạy cổng kiểm trong repo |

---

## C6 cần PM chọn hướng — không sửa một dòng là xong

Đây là mâu thuẫn **giữa hai quy ước do chính mình đặt ra**, không phải lỗi đánh máy:

- Lúc **bẻ task**, trần "≤ 2 ngày công" được áp bằng cảm nhận về *phạm vi* một issue.
- Lúc **quy ra giờ**, công thức `SWP × hệ_số[vai] × buffer` cho ra thời lượng. Hệ số BE khoảng
  5 giờ/SWP, nên một issue 5 SWP đã ra ~28,75 giờ — vượt trần ngay, dù phạm vi của nó vẫn gọn.

Hai thước đo không bao giờ được đối chiếu với nhau. Kết quả: **72/107 issue vượt trần theo chính số
giờ của mình**, trong đó `E10-I9` lên tới 69 giờ — gần 9 ngày công cho một issue.

| Hướng | Việc phải làm | Đổi lại |
|---|---|---|
| **(a) Khai thật, sửa tài liệu, không bẻ lại backlog** | Sửa `task-breakdown.md`: nêu trần, nêu số đo 72/107, nêu nguyên nhân hai thước đo, và ghi thành việc phải làm trước khi chạy thật | Nhanh, trung thực, giữ nguyên Project và mô phỏng Sprint 1 đã chốt. Nhưng backlog nộp đi vẫn còn 72 issue quá to |
| **(b) Bẻ lại 72 issue thành sub-issue** | Bẻ, chấm lại SWP, đẩy lại Project, xếp lại Sprint 1, dựng lại burndown và báo cáo tiến độ | Backlog đúng luật đề bài. Nhưng phải làm lại gần hết Bước 2→6, và mô phỏng Sprint 1 bạn vừa duyệt sẽ mất |
| **(c) Bẻ lại phần nặng nhất, khai thật phần còn lại** | Bẻ ~10 issue vượt 36 giờ (nặng nhất), phần 17–36 giờ khai thật như (a) | Cân bằng. Vẫn phải chấm lại và đẩy lại một phần Project |

Tôi nghiêng về **(a)**: đề bài chấm năng lực *phát hiện và nói thật*, mà một backlog khai đúng chỗ
sai của mình đáng tin hơn một backlog trông sạch. Nhưng đây là quyết định của bạn, không phải của tôi.

---

## Đã kiểm và ĐẠT

| Việc | Bằng chứng |
|---|---|
| Đủ phần, đúng thứ tự | Cả 4 file đạt |
| Bảng "Hướng đã chốt" đủ 4 cột, 6 điểm đều chốt một phương án | PREMISE đạt |
| 7 màn `SC4-01`…`SC4-07` đều có issue | Đếm bằng lệnh trên `backlog.csv` |
| Epic giờ lái xe 2024 tách độc lập | `E10` (#14) tách khỏi `E4` (#13) trên cả `backlog.csv` lẫn Project |
| 21 gap phân LAB-5 đều có issue | Đếm bằng lệnh: 21/21 |
| Không có issue kiểu "Làm màn X" | Đạt |
| Số SWP/giờ khớp giữa `.md`, `backlog.csv` và Project | 428 SWP · 2 471,9 giờ · 309 MD · 15,45 MM — khớp 100%, không đếm hai lần |
| Công thức quy giờ áp đúng | Tính lại 107 dòng, 0 dòng lệch |
| Mô hình SWP đúng (nhân hai trục, không cộng) | Khớp `SWP_MATRIX`; 106/107 dòng khớp ma trận, dòng lệch là `E6-I1` đã hiệu chỉnh có chủ đích |
| Mọi ô bảng trạng thái khớp Project | 33 item · 22 có điểm riêng · 69 SWP · 346,4 giờ · 10 epic — khớp |
| Burndown khớp số liệu | SWP đóng cộng lại = 45 = SWP Done trên Project |
| Báo cáo tiến độ **không tô hồng** | `#71 Blocked` và mọi issue `In Progress` đều được nêu |
| Phần 4 `task-breakdown.md` là chỗ hở mới | 67 dòng, không chép lại sổ gap |
| Không bí mật, không dữ liệu cá nhân, không chép nguyên văn RFP | `grep` không khớp; lịch sử commit sạch — xem `plans/reports/history-secret-scan-261117.md` |
