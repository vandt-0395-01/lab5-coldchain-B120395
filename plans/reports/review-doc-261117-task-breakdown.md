---
failed: 2
warnings: 3
result: FAIL
---

# Review task-breakdown.md

Nguồn đối chiếu: `backlog.csv`, `specs/database/gap-list.md`, `PREMISE.md`, `findings/*.md`, `/tmp/rv_tb.json` (Project, 136 item, chạy `python3 scripts/fetch-project-items.py /tmp/rv_tb.json`).

## Checklist Verdicts

Không có checklist. Các yêu cầu riêng của đề, đối chiếu theo từng mục:

1. Đủ 4 phần, đúng thứ tự: ĐẠT. Các tiêu đề `## 1. Nguyên tắc chia task`, `## 2. Spec → issue`, `## 3. Hạng mục chịu ràng buộc đặc thù của đề`, `## 4. Chỗ hở hoặc mâu thuẫn của spec LAB-4 phát hiện khi break` có đủ và đúng thứ tự.
2. Mọi `SC4-01`…`SC4-07` có issue: ĐẠT. Quét cột `spec` của `backlog.csv` bằng python: SC4-01 12 dòng, SC4-02 8, SC4-03 14, SC4-04 17, SC4-05 19, SC4-06 10, SC4-07 6. Không mã nào rỗng.
3. Epic giờ lái độc lập: ĐẠT. `backlog.csv` có `"E10","","epic","Áp đủ bộ giới hạn giờ lái 改善基準告示 từ 2024…` với parent rỗng, tách khỏi `E4`. Project có `[E10]` là issue #14 với `Epic=E10`, tách khỏi `[E4]` là #13. Cả hai nơi đều tách riêng.
4. Mỗi issue ≤ 16 giờ: KHÔNG ĐẠT. Xem Critical 1.
5. Không có issue kiểu "Làm màn X": ĐẠT. 6 tiêu đề bắt đầu bằng "Dựng màn" (E1-I9, E3-I10, E3-I16, E5-I12-S1, E6-I4, E6-I5) đều có thêm phạm vi cụ thể và cột `dod` kiểm được. Không tiêu đề nào chỉ nói "Dựng màn X".
6. 21 dòng gap LAB-5 đều có issue: ĐẠT. Lệnh `grep -E '^\| \*\*GAP-' specs/database/gap-list.md | awk -F'|' '{print $2,"→",$(NF-1)}' | grep -c "LAB-5"` ra 21. Cột `spec` của `backlog.csv` chứa đủ 21 mã GAP-01…09, 13…17, 19…23, 27…29. Phép trừ tập hợp `lab5 missing: []`.
7. Phần 4 không chép lại gap-list: ĐẠT. `findings/*.md` có đúng 67 dòng bảng, bằng con số "67" trong phần 4. Các dòng ghi `GAP-xx` chỉ dùng mã để dẫn chiếu, nội dung là chỗ hở mới (ví dụ `exception_events` không có cột nào ở §4).

Các bẫy nghiệp vụ trong phạm vi file này:
- ⑥ HACCP và giờ lái là ràng buộc cứng: giữ đúng. Phần 3 và PREMISE mục 3 điểm 1 đều ghi HACCP vẫn cứng, chặn ở xác nhận nhập/xuất. `E10` chặn công bố tuyến.
- ①–⑤: file không phát biểu trái bẫy nào.
- Không thấy mật khẩu, khoá bí mật, dữ liệu cá nhân hay đoạn chép nguyên văn RFP.

## Critical Issues

1. **Trần "≤ 2 ngày công (16 giờ)" bị vi phạm hàng loạt, không có sub-issue.**
   - File nói: `Một issue làm xong trong **≤ 2 ngày công**. Vượt thì tách sub-issue`.
   - Nguồn nói: cột `hours` của `backlog.csv`, ví dụ `"E10-I9"` có `69.0`, `"E3-I5"` có `62.1`, `"E3-I9"` có `54`. Ví dụ ở mức sub là `"E1-I8-S1"` có `36`.
   - Số liệu: chạy python lọc dòng `type != epic`, `hours > 16` và `id` không nằm trong tập `parent`. Ra **72** dòng, gồm 60 issue và 12 sub-issue. Lớn nhất 69,0 giờ.
   - Project khớp `backlog.csv`: `E10-I9` có `Hours=69.0`.
   - Hậu quả: cột `Hours` quy từ SWP, nhưng quy tắc nói 16 giờ. Một dev nhận "2 ngày công" sẽ gặp việc 4 ngày rưỡi.
   - Đề xuất: tách hoặc sửa số cho 72 dòng, hoặc đổi quy tắc ở §1 thành điều thực sự đang áp dụng.

2. **Phần 2 nói sai số dòng gap "Chấp nhận".**
   - File nói: `8 dòng gap mức Thấp đã khai *Chấp nhận*` (bảng "Phần spec chưa thành issue, và vì sao").
   - Nguồn nói: `specs/database/gap-list.md` có đúng 3 dòng ở cột Xử lý là `Chấp nhận`, gồm GAP-10, GAP-11, GAP-12. Lệnh `grep -E '^\| \*\*GAP-' … | grep -v "LAB-5"` ra 8 dòng không phải LAB-5, trong đó 3 là Chấp nhận, 3 là `Chờ khách` (GAP-09, 18, 26) và 2 là `Chờ PM ký` (GAP-24, 25).
   - Số 8 có vẻ do gộp các dòng không phải LAB-5. Mức "Thấp" cũng có tới 10 dòng, không phải 8.
   - Hậu quả: người đọc tưởng 8 quyết định đã chốt có lý do, trong khi 5 dòng chưa chốt. Hai dòng `Chờ PM ký` (GAP-24, GAP-25) không được nhắc ở bảng này, dù PM chưa ký.
   - Đề xuất: sửa thành "3 dòng Chấp nhận (GAP-10/11/12)" và liệt kê rõ phần còn lại: 3 dòng `Chờ khách`, 2 dòng `Chờ PM ký`.

## Warnings

1. **Số yêu cầu phi chức năng "còn lại" mâu thuẫn giữa file này, backlog và PREMISE.**
   - File: `7 yêu cầu phi chức năng còn lại` (bảng "Phần spec chưa thành issue"). Đồng thời bảng đó liệt kê riêng `NFR-SEC-01`, `NFR-AUD-01`, `NFR-LOC-01` ở các dòng trên.
   - Backlog: `"E7-I6"` có tiêu đề `Hỏi khách mức ưu tiên thật của tám yêu cầu phi chức năng ngoài NFR-SEC-03`.
   - PREMISE mục 3 điểm 4: `8 yêu cầu phi chức năng` và `7 mã còn lại gom thành một issue làm rõ`.
   - Cùng một việc, ba chỗ ghi 7, 8, 7. Người làm `E7-I6` không biết hỏi khách 7 hay 8 mã. Đề xuất: thống nhất một số và nói rõ ba NFR tách riêng có nằm trong số đó không.

2. **Số issue `constraint-2024` và mô tả epic không khớp.**
   - File: `**Tổng: 17 issue mang nhãn constraint-2024.**`, trong khi §1 nói epic "không ước lượng, không gán vai" và bảng §2 ghi `E10` có `16` item.
   - Nguồn: cột `constraint` của `backlog.csv` có 17 dòng `giờ lái 2024`, gồm cả dòng epic `E10`. Số issue thực (không tính epic) là 16.
   - Đề xuất: ghi "16 issue + 1 epic" hoặc bỏ nhãn khỏi epic.
   - Cùng chỗ: Project hiện gán `SWP` và `Hours` cho dòng epic, ví dụ `[E9]` có `Hours=116.1`, trái với "Không ước lượng". Đề xuất: ghi rõ đó là tổng cộng dồn.

3. **Phần "Khi nào tách sub-issue" lấy ví dụ nhưng chính các sub đó vẫn vượt trần.**
   - Ví dụ `E4-I9` (#68) và "3 sub của nó". Trong `backlog.csv`, `E4-I9-S2` có `36` giờ và `E4-I9-S3` có `24` giờ, đều vượt 16 giờ.
   - Điều này cùng gốc với Critical 1. Ghi riêng để bảo đảm lần sửa không bỏ sót hạng mục sub-issue.

## Not Verified

- Nhãn `constraint-2024` và `trap` trên GitHub: file JSON từ `fetch-project-items.py` không có trường nhãn. Cột `constraint` của `backlog.csv` thì có, và khớp số 17.
- Phân loại cột Xử lý trong phần 4 ("45 · 10 · 6 · 6"): đếm bằng `grep -ci` trên cột cuối của `findings/*.md` ra 44 · 12 · 5 · 7. Cách đếm này bắt cả chữ nằm trong ô khác nên chưa phân định được. Cần đọc từng dòng.
- Câu "xanh cả bốn cổng kiểm tự động" và "vòng review chéo bốn góc" (phần 4): không có nguồn trong phạm vi đã đọc để đối chiếu.
- Trích dẫn *"lái liên tục tối đa 4 giờ"* ở §3 là lời của RFP. `docs/01_requirements-extract.md` dòng `FR-SCH-03` chỉ ghi `vượt 4 giờ`. Chưa đối chiếu với RFP gốc.
- Chuỗi `CẦN XÁC NHẬN` (`E10-I13`): `grep -c "CẦN XÁC NHẬN" docs/01_requirements-extract.md` ra 0. Không tìm thấy nguồn trong tài liệu được giao.
- Mô tả mâu thuẫn `DD-OUT-001` §4.3 và §5 (phần 4, mục 1) và `SC4-03` §3bis: chưa mở file `specs/**/SC4-03_SPEC.md` và `DD-OUT-001`. Chỉ xác nhận một dòng tương tự ở `specs/review-report.md` (C9).
- Trạng thái và số SWP/giờ giữa `.md` và Project cho từng epic/issue: đối chiếu mẫu 21 dòng (E4-I8, E5-I9…, E10-I1…E10-I13) khớp số issue GitHub và `Hours`. `grep` số issue trên toàn bộ 136 dòng ra 0 lệch. Phần epic cộng dồn (`E10-I6`, `E4-I9`, `E7-I1`) lệch do `backlog.csv` để `swp_final` rỗng và Project ghi `SWP` khác `swp_rollup`; chưa rõ cột nào là nguồn.
