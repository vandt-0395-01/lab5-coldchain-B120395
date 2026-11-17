# Trích xuất yêu cầu từ RFP — Product B (食品コールドチェーン業務支援システム)

- Nguồn chuẩn: `Input/product-b-rfp-ja-v2.0-rc4 (2).pdf` (bản gốc tiếng Nhật, 89 trang). Bản dịch `Output/00_rfp-vi.md` chỉ để tham khảo.
- Mã tài liệu: YCL-RFP-2026-01, phiên bản 2.0, ngày cơ sở 2026-08-13 (S1-04, tr.11).
- RFP tự tuyên bố: toàn bộ công ty, tổ chức, dữ liệu là **hư cấu**; nghĩa vụ dẫn từ nguồn công khai phải được vendor kiểm chứng lại phạm vi áp dụng trước khi chốt thiết kế (S1-04, tr.11; OPS-LAW-01, S4-04, tr.68).
- Quy ước trong file này: dòng đánh dấu **[SUY LUẬN]** là nhận định của người phân tích, KHÔNG có trong RFP. Chỗ thiếu căn cứ ghi rõ **"chưa có trong RFP → cần hỏi khách"**.

---

## 1. Bối cảnh và mục tiêu của khách

**Khách hàng**: ユキコールドロジスティクス株式会社 (gọi tắt ユキ物流 / Yuki) — vận hành **một** trung tâm logistics lạnh duy nhất, 3 dải nhiệt độ (三温度帯) trên cùng khuôn viên, 2 cửa nhập / 3 cửa xuất, khu cách ly vật lý riêng (S1-01 tr.4; S1-02 tr.7).

**Lý do đầu tư** (S1-03, tr.9): khách bán lẻ tăng khiến bộ công cụ hiện tại (Excel, fax, log nhiệt độ giấy, xếp lịch tay) không còn quản được đồng thời: hạn bảo quản, lô, nhiệt độ và giờ công tài xế. Yuki yêu cầu **hệ thống web tiếng Nhật + POD trên thiết bị**; đề xuất phải phân biệt rõ cái gì là nghĩa vụ pháp lý, cái gì là tập quán thương mại, cái gì là chính sách riêng của Yuki.

**Kết quả kinh doanh kỳ vọng** (S1-03, tr.10): chặn xuất lô không đạt điều kiện (hạn tiêu thụ an toàn, lịch sử 日付逆転, cách ly); giảm giờ chuẩn bị hồ sơ HACCP và đối soát nhập/xuất; phát hiện vi phạm giờ ràng buộc tài xế TRƯỚC khi công bố tuyến; truy xuất nhanh gạo/bò/lô nội bộ và chốt phạm vi thu hồi bằng đối soát số lượng; ghi nhận tách bạch 車上渡し/軒先渡し; chuyển đổi dữ liệu có lineage, không xoá âm thầm.

**KPI baseline → mục tiêu sau 3 tháng** (S1-03, tr.9–10):

| KPI | Baseline | Mục tiêu |
|---|---|---|
| Thời gian tìm 1 lô (truy xuất) | 145 phút | ≤60 giây tìm + ≤30 phút xác nhận |
| Tỷ lệ sửa dòng giao hàng (POD) | 6,8% | <2,0% |
| Cảnh báo review trễ (>15 phút) | 11,0% | <1,0% |
| Đổi tuyến sau công bố | 2,4% | <1,0% |
| Chênh lệch tồn kho không giải thích được | 1,7% | <0,5% |
| Giờ chuẩn bị gói HACCP | 18 giờ | ≤4 giờ |

**Lịch trình dự kiến** (S4-02, tr.65): khởi động 2026-10-05; thiết kế cơ bản 8 tuần; xây dựng + test 18 tuần; 2 lần diễn tập chuyển đổi; UAT 6 tuần; **go-live mục tiêu 2027-06-01**. Cutover: RTO 4 giờ; rollback nếu có lỗi P0, chênh tồn kho >0,1% hoặc trace/POD không đầy đủ (tr.66). Vận hành song song: 1 tuần đầu hệ cũ chỉ-đọc (tr.66). Hypercare 4 tuần (OPS-SUP-01, S4-04, tr.68).

**Đánh giá đề xuất** (S5-03, tr.71): hiểu nghiệp vụ cold chain & Nhật 20% / mức đáp ứng FR-BR + khả năng test 25% / dữ liệu-tích hợp-migration 15% / NFR-bảo mật-liên tục-accessibility 15% / tiến độ-đội ngũ-quản trị 10% / minh bạch TCO 15%. **Điểm kỹ thuật <70/100 bị loại trước vòng thương mại**; nhầm 賞味期限/消費期限, so 日付逆転禁止 với hôm nay, gọi quy tắc 1/3 là luật, hoặc bỏ ràng buộc cứng của tài xế bị tính là **lỗi nghiêm trọng** (tr.71).

**Cấu trúc hồ sơ dự thầu bắt buộc** (S5-01, tr.69): 1 bản tiếng Nhật; ma trận tuân thủ **toàn bộ 88 yêu cầu** (Comply/Partial/Not comply/Assumption); mỗi dòng Partial/Assumption phải nêu ảnh hưởng scope-effort-chi phí-lịch-nghiệm thu; cấm ghi "chức năng chuẩn" không kèm bằng chứng; demo phải dùng fixture khách phát (12 SKU, nhiệt biên, 2 loại hạn, 日付逆転, tuyến bất khả thi, trace gạo/bò, POD theo điều kiện, dirty data). Cấm đưa tài liệu vào dịch vụ AI công khai khi chưa được Yuki phê duyệt (tr.69). Bảng chi phí tách một lần/định kỳ/option, không gộp option vào giá cơ sở (S5-02, tr.70). Hỏi đáp chỉ qua một cửa, Q&A table phát đồng thời cho mọi vendor và có hiệu lực ngang RFP (S5-05, tr.75).

---

## 2. Yêu cầu chức năng (FR)

Tổng quan cách đọc: ID duy nhất, cột 受入条件 là bằng chứng đo được để đóng yêu cầu; ưu tiên chỉ có P0 (bắt buộc lúc go-live) và P1 (có thể có phương án tạm được phê duyệt) (S1-04 "要件表の読み方", tr.12). RFP nói tổng cộng **88 yêu cầu** (S5-01, tr.69) nhưng không nêu cơ cấu. **[SUY LUẬN]** Cơ cấu tự đếm từ RFP: 32 FR + 12 BR + 12 NFR + 10 DR + 6 IF + 8 OPS + 8 ACC = 88 (NUM-SKU-01/NUM-BAND-01 chỉ là tham chiếu chéo ở R-02 tr.78, không phải mã yêu cầu); bảng dưới liệt kê 32 FR.

### D1 — Nhập kho, kiểm tra, lưu kho (tr.16)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-REC-01 | Tạo appointment nhập kho: ETA nhà cung cấp, xe, dải nhiệt, số dòng dự kiến; cảnh báo trùng mã tham chiếu | P1 | D1, tr.16 |
| FR-REC-02 | Ghi kiểm hàng từng dòng: tình trạng bao gói, số lượng, lô, loại hạn, hạn, nhiệt độ thực đo, ảnh; thiếu trường P0 thì chặn xác nhận và chỉ rõ trường thiếu | P0 | D1, tr.16 |
| FR-REC-03 | Ghi số lượng chấp nhận/từ chối/treo + mã lý do; tổng dòng khớp số báo cáo hoặc cần phê duyệt có thẩm quyền | P1 | D1, tr.16 |
| FR-REC-04 | Tạo lô + stock unit bất biến từ nhập kho đã chấp nhận; retry cùng request không sinh trùng khoá lô | P0 | D1, tr.16 |
| FR-REC-05 | Chuyển hàng vào cách ly khi trượt kiểm nhiệt độ hoặc thiếu trường truy xuất; hàng cách ly không được đặt trước/không picking | P0 | D1, tr.16 |

### D2 — Tồn kho, lô, 3 dải nhiệt độ (tr.21–22)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-INV-01 | Quản lý sức chứa, dải nhiệt, tình trạng sử dụng theo vị trí; chặn put-away vượt sức chứa/vị trí đóng | P1 | D2, tr.22 |
| FR-INV-02 | Gợi ý vị trí hợp lệ theo dải nhiệt/trạng thái/sức chứa/FEFO; chọn vị trí khác phải có lý do; vị trí không hợp lệ luôn bị chặn | P1 | D2, tr.22 |
| FR-INV-03 | Ghi mọi lần di chuyển: nguồn, đích, lô, số lượng, người, thiết bị, thời điểm; từ chối tồn âm và di chuyển lệch dải nhiệt không có deviation | P0 | D2, tr.22 |
| FR-INV-04 | Kiểm kê mù (không hiện số sổ sách); điều chỉnh chênh lệch cần lý do, vượt ngưỡng cần duyệt 2 cấp (maker-checker) | P1 | D2, tr.22 |
| FR-INV-05 | Máy trạng thái available/quarantine/release/scrap, chỉ cho chuyển trạng thái hợp lệ, lịch sử bất biến, cập nhật realtime cho allocation | P0 | D2, tr.22 |
| FR-INV-06 | Tìm tồn kho theo SKU/lô/NCC/hạn/loại hạn/dải nhiệt/trạng thái/vị trí | P1 | D2, tr.22 |

Mọi thao tác idempotent khi client retry, không được sinh tồn kho âm (D2, tr.22).

### D3 — Quản lý hạn, FEFO, cửa sổ giao hàng (tr.25–26)

D3 **không có FR riêng** trong requirements-registry.csv — 5 quy tắc BR của D3 là đầu vào cho bước allocation chạy ở D4 (FR-OUT-02) (D3, tr.25). Thứ tự loại trừ đầy đủ khi allocation: quá 消費期限 (BR-EXP-02) → lệch dải nhiệt (BR-TEMP-02) → đang cách ly (FR-INV-05) → vi phạm cửa sổ giao hàng (BR-DELWIN-01) → vi phạm 日付逆転禁止 (BR-DATE-01) → còn lại theo FEFO, cùng hạn thì FIFO (BR-FEFO-01) (D3, tr.26).

### D4 — Xuất kho, picking, bàn giao, POD (tr.30)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-OUT-01 | Tạo dòng đơn: khách, SKU, số lượng, ngày yêu cầu, điều kiện giao, tham chiếu; lỗi master chưa định nghĩa/trùng tham chiếu xử lý được | P0 | D4, tr.30 |
| FR-OUT-02 | Allocation **nguyên tử** theo hạn, an toàn, cửa sổ khách, 日付逆転禁止, FEFO; request song song không over-allocate cùng lô | P0 | D4, tr.30 |
| FR-OUT-03 | Gom picking task theo khu/tuyến/thứ tự chất hàng; thay đổi task giữ allocation gốc + audit log | P1 | D4, tr.30 |
| FR-OUT-04 | Kiểm chứng picking/chất hàng bằng barcode (hoặc nhập tay có kiểm soát): SKU, lô, số lượng, xe, seal; sai thì chặn xác nhận | P0 | D4, tr.30 |
| FR-OUT-05 | Ghi kiểm tra trước xuất: nhiệt xe, nhiệt hàng, seal, thời điểm; giá trị ngoài chính sách tạo deviation và chặn xuất | P0 | D4, tr.30 |
| FR-OUT-06 | Xác nhận giao có POD theo điều kiện: thời điểm, vị trí, người nhận, chữ ký/ảnh, mã ngoại lệ; hàng đợi offline mã hoá, đối soát một lần, không trùng | P0 | D4, tr.30 |
| FR-OUT-07 | Liên kết trả hàng/khiếu nại với dòng giao, lô, bằng chứng, trạng thái, lịch sử lưu giữ; trạng thái khiếu nại và xử lý tồn kho audit độc lập | P1 | D4, tr.30 |

### D5 — Lập tuyến và giờ ràng buộc tài xế (tr.33–34)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-SCH-01 | Tạo tuyến từ đơn, dải nhiệt xe, khung giờ, service time, giờ depot; đơn chưa gán và lý do từ chối luôn hiển thị | P0 | D5, tr.34 |
| FR-SCH-02 | Kiểm tra theo **phiên bản quy tắc chính thức**: giờ làm thêm, tổng giờ, nghỉ ngơi, lái bình quân, lái liên tục; tuyến vi phạm cấm công bố, hiển thị đúng khoảng thời gian vi phạm | P0 | D5, tr.34 |
| FR-SCH-03 | Chèn điểm nghỉ đủ trước khi lái liên tục vượt 4 giờ; vị trí/thời lượng nghỉ hiện trong itinerary tài xế và tính toán tuân thủ | P1 | D5, tr.34 |
| FR-SCH-04 | Công bố tuyến có quản lý phiên bản; thay đổi sau công bố bắt buộc nhập lý do; tài xế nhận bản mới nhất, bản cũ audit được | P0 | D5, tr.34 |
| FR-SCH-05 | Ghi sự kiện khách quan (tai nạn, hỏng xe, thiên tai) tách khỏi lịch thường; bằng chứng bất biến, không ghi đè âm thầm kết quả tuân thủ đã tính | P1 | D5, tr.34 |

Ngưỡng FR-SCH-02 kiểm tra: 960h làm thêm/năm, 3.300h ràng buộc/năm, 284h/tháng, 13h/ngày thường, tối đa 15h, nghỉ mục tiêu 11h tối thiểu 9h, lái bình quân 9h/ngày (2 ngày), 44h/tuần (2 tuần), lái liên tục tối đa 4h — RFP ghi rõ đây là "bản tóm tắt từ nguồn chính thức cần kiểm chứng lại" (D5, tr.34).

### D6 — Giám sát nhiệt độ, lệch chuẩn, hồ sơ HACCP (tr.37–38)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-TEMP-01 | Import CSV datalogger có hash, timestamp thiết bị + timezone; cùng hash xử lý idempotent, dòng sai định dạng bị từ chối kèm số dòng | P0 | D6, tr.38 |
| FR-TEMP-02 | Đánh giá từng reading theo chính sách SKU/zone hiệu lực; lưu first/last/peak/duration, phiên bản ngưỡng, danh sách lô bị ảnh hưởng | P0 | D6, tr.38 |
| FR-TEMP-03 | Hiển thị cảnh báo chưa xác nhận, ghi thời điểm review đầu tiên trong 15 phút; review quá hạn đánh dấu rõ và vào báo cáo quản lý | P0 | D6, tr.38 |
| FR-TEMP-04 | Quản lý deviation case: liên kết cảnh báo, điều tra, bằng chứng, trạng thái tồn kho, hành động khắc phục, quyết định; thiếu rationale/đính kèm bắt buộc thì không đóng được case | P0 | D6, tr.38 |

### D7 — Truy xuất nguồn gốc và thu hồi (tr.40–41)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-TRC-01 | Tìm tồn kho/giao hàng liên quan từ lô/SKU/NCC/xuất xứ gạo/số định danh cá thể bò; kết quả có timestamp, nguồn, quan hệ, chỉ rõ điểm kết thúc của liên kết đã ghi | P0 | D7, tr.41 |
| FR-TRC-02 | Mở recall case: phạm vi, lô ảnh hưởng, khách, số lượng, đầu mối, task, hạn; dashboard đối soát affected = on-hand + shipped = returned + unresolved + disposed | P0 | D7, tr.41 |
| FR-TRC-03 | Sinh thông báo thu hồi (khách + nội bộ) từ dữ liệu case; mọi bản phát hành có quản lý phiên bản, cần approver trước khi gửi | P1 | D7, tr.41 |

### D8 — Báo cáo, KPI, kế toán quản trị (tr.44)

| Mã | Nội dung | Ưu tiên | Trích dẫn |
|---|---|---|---|
| FR-RPT-01 | Cung cấp 12 loại báo cáo vận hành theo catalog, lọc theo kỳ/khách/SKU/dải/trạng thái, xuất CSV, phân quyền theo vai trò khớp catalog | P1 | D8, tr.44 |
| FR-RPT-02 | Xuất bằng chứng audit: case record, event, file đính kèm, index, hash nguồn; export có manifest checksum ổn định, người có quyền tái tạo chính xác được | P0 | D8, tr.44 |

### Quy tắc nghiệp vụ (BR) — ràng buộc xuyên suốt

| Mã | Nội dung | Trích dẫn |
|---|---|---|
| BR-TEMP-01 | Ngưỡng 3 dải nhiệt **quản lý theo phiên bản** (常温 15–25°C, 冷蔵 0–5°C, 冷凍 ≤-18°C là chính sách Yuki); giao dịch quá khứ giữ phiên bản dùng lúc đánh giá | D2, tr.21 |
| BR-TEMP-02 | So dải nhiệt SKU ↔ dải nhiệt vị trí ↔ nhiệt thực đo tại mọi lần nhập/xuất; lệch là chặn xác nhận, tạo deviation, không ngoại lệ | D2, tr.21 |
| BR-EXP-01 | Mỗi SKU tuyên bố 賞味期限 hoặc 消費期限, áp dụng đường quyết định khác nhau | D3, tr.25 |
| BR-EXP-02 | Lô chạm/quá 消費期限: chặn cả allocation lẫn giao, ghi exception event bất biến — không ngoại lệ | D3, tr.25 |
| BR-FEFO-01 | Chọn lô hạn sớm nhất; cùng hạn theo thứ tự giờ nhập (FIFO); lô cách ly không đủ điều kiện dù hạn sớm | D3, tr.25 |
| BR-DATE-01 | 日付逆転禁止: so hạn đề xuất với **lần giao đã chấp nhận gần nhất của đúng cặp khách-SKU**; không so với hôm nay, không mượn lịch sử khách khác | D3, tr.25 |
| BR-DELWIN-01 | Đánh giá cửa sổ giao hàng theo cấu hình hợp đồng từng cặp khách-SKU; không coi cấu hình là yêu cầu pháp định | D3, tr.25 |
| BR-POD-01 | Phân nhánh xác nhận giao theo điều kiện 車上渡し/軒先渡し; thiếu bằng chứng bắt buộc theo điều kiện đã cấu hình thì không hoàn tất được | D4, tr.29 |
| BR-HACCP-01 | Kiểm tra completeness theo nhịp Yuki: logger 15 phút, mỗi movement nhập/xuất, sanitation mỗi ca, visitor/driver mỗi lượt, review alarm; thiếu bản ghi sinh completeness queue, không tự đóng | D6, tr.37 |
| BR-TRACE-01 | Lane gạo: giữ transaction ID, số lượng, ngày, đối tác, thông tin xuất xứ; thiếu trường bắt buộc thì chặn xác nhận | D7, tr.40 |
| BR-TRACE-02 | Lane bò: số định danh cá thể **đúng 10 chữ số** xuyên suốt nhập/tồn/allocation/xuất/recall; sai thì chặn | D7, tr.40 |
| BR-TRACE-03 | Lane nội bộ (P1): lô nội bộ + liên kết supplier/customer là dữ liệu có cấu trúc, không phải ghi chú tự do | D7, tr.40 |

### Thực thể dữ liệu bắt buộc (DR) — tóm tắt

DR-LOT-01 (lô: supplier lot, hạn, loại hạn, ID quản chế — D7 tr.41), DR-HIST-01 (dòng giao đã chấp nhận: customer+SKU+expiry+completion, bất biến, dùng cho 日付逆転禁止 — S3-01 tr.45, 47), DR-ROUTE-01 (phiên bản tuyến — D5 tr.34), DR-TEMP-01 (reading/event nhiệt độ — D6 tr.38), DR-POD-01 (POD metadata: delivery, term, hash, custody — D4 tr.30), DR-TRACE-01 (xuất xứ gạo/số bò: typed & searchable — D7 tr.41), DR-MST-01 (master có effective date — S3-01 tr.45), DR-MIG-01 (migration lineage — S4-01 tr.64), DR-PRIV-01 (hồ sơ tối thiểu tài xế/người nhận — S3-04 tr.60), DR-RET-01 (retention — S3-04 tr.60).

### Giao diện ngoài (IF) — phạm vi cơ sở (S3-02, tr.56)

IF-ERP-01 (CSV UTF-8 → ERP qua managed SFTP, schema version + idempotency key; checksum lệch/key trùng → reject cả file), IF-LOG-01 (upload CSV datalogger có kiểm soát, giữ file gốc + SHA-256, **không kết nối live**), IF-MAP-01 (dịch vụ bản đồ có license; estimate quá 24h thì cấm publish route), IF-IDP-01 (OIDC với IdP doanh nghiệp), IF-MAIL-01 (mail relay doanh nghiệp, không SMS, retry theo queue), IF-ARCH-01 (xuất archive PDF/CSV + manifest SHA-256).

### Cổng nghiệm thu (ACC) — S5-04, tr.72

| Mã | Nội dung | Trích dẫn |
|---|---|---|
| ACC-FUN-01 | E2E kho: nhập → lô → allocation → pick → dispatch → POD, không được bỏ qua bước nào | S5-04, tr.72 |
| ACC-TEMP-01 | Nhiệt độ: ngưỡng biên, vượt ngưỡng, thiếu reading, review trễ đều ra đúng trạng thái | S5-04, tr.72 |
| ACC-DATE-01 | Ngày: loại hạn, cửa sổ giao, FEFO và lịch sử cho đúng cảnh báo/chặn | S5-04, tr.72 |
| ACC-SCH-01 | Lịch: tình huống thường, bất khả thi, nghỉ ngơi và sự kiện bất khả kháng đều đúng phiên bản quy tắc | S5-04, tr.72 |
| ACC-TRC-01 | Truy xuất/recall: gạo, bò, lô nội bộ và đối soát số lượng | S5-04, tr.72 |
| ACC-MIG-01 | Migration: 2 lần diễn tập, lineage, bản ghi bị từ chối, business sign-off | S5-04, tr.72 |
| ACC-NFR-01 | NFR: hiệu năng, bảo mật, phục hồi, accessibility, observability | S5-04, tr.72 |
| ACC-GO-01 | Go-live: 6 owner ký, rủi ro tồn dư và sẵn sàng rollback | S5-04, tr.72 |

### Vận hành, quản trị, đào tạo (OPS)

RFP không tách nội dung riêng cho GOV/CHG/RISK/TEST ở dạng từng mã — 4 mã này cùng bắt buộc minutes, RAID, decision log, change impact và test trace (S4-04, tr.68); dòng dưới ghi đúng như vậy.

| Mã | Nội dung | Trích dẫn |
|---|---|---|
| OPS-TRN-01 | Bắt buộc đào tạo tiếng Nhật theo vai trò trước go-live; cấm dùng một session chung cho mọi vai trò vì mỗi nhóm chạm phần hệ thống khác nhau | S4-03, tr.67 |
| OPS-GOV-01 | Cùng nhóm GOV/CHG/RISK/TEST: bắt buộc minutes, RAID, decision log, change impact, test trace; scope không có owner và acceptance thì không vào sprint | S4-04, tr.68 |
| OPS-CHG-01 | Cùng nhóm GOV/CHG/RISK/TEST: bắt buộc minutes, RAID, decision log, change impact, test trace | S4-04, tr.68 |
| OPS-RISK-01 | Cùng nhóm GOV/CHG/RISK/TEST: bắt buộc minutes, RAID, decision log, change impact, test trace | S4-04, tr.68 |
| OPS-TEST-01 | Mọi test phải link được tới requirement, dữ liệu, môi trường, kết quả và defect; quyết định go-live dựa trên evidence này, không dựa tỷ lệ hoàn thành sprint | S4-04, tr.68 |
| OPS-ENV-01 | Tách dev/test/UAT/prod, che (mask) dữ liệu; release gồm checksum artifact, config diff, phê duyệt, backup và rollback | S4-04, tr.68 |
| OPS-SUP-01 | Hypercare 4 tuần, severity matrix, escalation, communication và báo cáo SLA | S4-04, tr.68 |
| OPS-LAW-01 | Kiểm chứng lại nguồn chính thức trước design freeze và trước go-live | S4-04, tr.68 |

---

## 3. Yêu cầu phi chức năng (NFR)

| Mã | Nội dung | Cách kiểm chứng | Trích dẫn |
|---|---|---|---|
| NFR-PERF-01 | p95 read ≤2s, write ≤3s với 80 người dùng đồng thời | Load test 80 concurrent trên dữ liệu giống production | S3-03, tr.58 |
| NFR-PERF-02 | Truy vết lô 3 năm hoàn tất ≤60 giây | Dataset test 300.000 dòng xuất + 2,5 triệu temperature readings | S3-03, tr.58 |
| NFR-BCP-01 | RTO 4 giờ, RPO 15 phút | Restore drill mỗi quý, trượt mục tiêu phải ghi corrective action | S3-03, tr.59 |
| NFR-AVL-01 | Availability 99,5%/tháng trong giờ dịch vụ JST 05:00–23:00 (trừ bảo trì được duyệt) | Tính từ đúng cửa sổ giờ dịch vụ đã thoả thuận | S3-03, tr.59 |
| NFR-AVL-02 | Mất mạng: POD queue mã hoá tối đa 8 giờ; giao dịch kho KHÔNG chạy offline | Test cắt mạng tại điểm bàn giao, resync conflict-safe | S3-03, tr.59 |
| NFR-OPS-01 | Metrics, structured logs, traces, alert + runbook có correlation ID | Kịch bản sự cố P0 phát alert hành động được, correlation ID tìm kiếm được | S3-03, tr.59 |
| NFR-SEC-01 | SSO; MFA cho vai trò đặc quyền; managed device auth cho tài xế | — | S3-04, tr.60 |
| NFR-SEC-02 | Quyền tối thiểu/RBAC theo tác nhân & vai trò; tách người lập – người duyệt | — | S1-02 tr.8; S3-04 tr.60 |
| NFR-SEC-03 | Mã hoá transit, DB, file đính kèm, offline queue; không tài khoản chung; log không chứa token/chữ ký/ảnh POD gốc | — | S3-04, tr.60 |
| NFR-AUD-01 | Sự kiện append-only cho trạng thái, master, phê duyệt, export, authentication | — | S3-04, tr.60 |
| NFR-LOC-01 | UI, lỗi, báo cáo bằng tiếng Nhật/JST; timestamp nội bộ ISO 8601 | — | S3-04, tr.60 |
| NFR-ACC-01 | WCAG 2.2 AA: bàn phím, focus, nhãn, lỗi, contrast | — | S3-04, tr.60 |

Vendor phải nộp: load plan, threat model, dependency/SBOM, vulnerability scan, restore evidence, accessibility report, observability drill, danh sách ngoại lệ có người chịu trách nhiệm/ngày sửa; **cấm test bằng môi trường production hoặc dữ liệu người dùng thật** (S3-03, tr.59).

Lưu trữ (DR-RET-01, S3-04, tr.61): nhiệt độ/phiếu nhập/phiếu xuất/deviation/route/traceability **3 năm**; sanitation + log visitor/driver **1 năm**; hồ sơ đào tạo + HACCP revision **3 năm**. RFP ghi rõ đây là chính sách Yuki hư cấu, không phải chuẩn toàn quốc. Legal hold chặn xoá; purge theo lịch cần log phê duyệt.

---

## 4. Ràng buộc pháp lý và quy định

RFP tách 3 tầng rõ rệt: **nghĩa vụ pháp lý** / **tập quán thương mại** / **chính sách riêng Yuki** — và yêu cầu đề xuất cũng phải tách như vậy (S1-03, tr.9). OPS-LAW-01: kiểm chứng lại nguồn chính thức trước khi đóng băng thiết kế và trước go-live (S4-04, tr.68). Nguồn tham chiếu tại R-08 (tr.88), 8 nguồn SRC-EXT:

| Chủ đề | Nội dung trong RFP | Nguồn / vị trí |
|---|---|---|
| HACCP | Nhịp ghi chép (logger 15 phút, review alarm 15 phút, sanitation mỗi ca…) là **chính sách Yuki**, RFP nói rõ "không mô tả như tần suất pháp định toàn quốc"; nghĩa vụ HACCP nền lấy từ 厚生労働省 | BR-HACCP-01, D6 tr.37; SRC-EXT-01/02, R-08 tr.88 |
| Giờ lái xe (改善基準告示) | Bộ ngưỡng FR-SCH-02 (960h/3.300h/284h/13h/15h/9–11h/4h liên tục…) là "tóm tắt từ nguồn chính thức, cần kiểm chứng lại"; là **ràng buộc cứng khi lập tuyến** — tuyến vi phạm cấm công bố | D5 tr.33–34; SRC-EXT-03/04, R-08 tr.88 |
| Truy xuất gạo | 米トレーサビリティ法 — chỉ SKU lane gạo (AMB-001) bắt buộc; chặn xác nhận nếu thiếu trường | BR-TRACE-01, D7 tr.40; R-02 tr.78; SRC-EXT-06 |
| Truy xuất bò | Số định danh cá thể 10 chữ số (牛トレーサビリティ) — chỉ SKU lane bò (CHI-001) | BR-TRACE-02, D7 tr.40; R-02 tr.78; SRC-EXT-07 |
| Ghi nhãn hạn dùng | Phân loại 賞味期限/消費期限 theo 消費者庁 | BR-EXP-01, D3 tr.25; SRC-EXT-05 |
| Quy tắc 1/3 | Tập quán thương mại theo hợp đồng, **không phải luật** — RFP nhấn mạnh "không được ghi thành nghĩa vụ pháp lý" | D3 tr.25; R-04 tr.80; SRC-EXT-08, R-08 tr.88 |

**[SUY LUẬN]** RFP không dùng cụm từ 物流2024年問題 trong phần thân bài đã trích (tên gọi này nằm trong bối cảnh CLAUDE.md); căn cứ thực tế trong RFP là 改善基準告示 cho tài xế xe tải (SRC-EXT-03/04). Khi viết đề xuất nên dẫn 改善基準告示, có thể nhắc 2024年問題 như bối cảnh ngành.

**[SUY LUẬN]** RFP không nhắc đến luật bảo vệ dữ liệu cá nhân (APPI) theo tên; chỉ có DR-PRIV-01 (tối thiểu hoá dữ liệu tài xế/người nhận, không thu số điện thoại cá nhân nếu không cần — S1-02 tr.8, S3-04 tr.60). Mức tuân thủ APPI cụ thể: chưa có trong RFP → cần hỏi khách.

---

## 5. Số liệu vận hành khách cung cấp

| Hạng mục | Số liệu | Trích dẫn |
|---|---|---|
| Số kho | 1 trung tâm duy nhất, 3 zone nhiệt (A/C/F), 2 cửa nhập, 3 cửa xuất, khu cách ly vật lý (cách ly chia theo dải nhiệt, mã vị trí hậu tố -Q, 常温 không có -Q) | S1-02 tr.7; R-01 tr.76–77 |
| Nhân sự | 42 người: 18 công nhân trung tâm, 9 tài xế, 4 người lập kế hoạch giao vận, 3 QC, 3 sales/CS, 2 IT, 3 quản lý | S1-02 tr.7 |
| SKU | 12 SKU đóng gói sẵn, mỗi dải nhiệt 4 SKU; chỉ AMB-001 (gạo) và CHI-001 (bò) mang định danh pháp định; không có SKU cần cắt/chia/đóng gói lại | R-02 tr.78 |
| Hợp đồng khách-SKU | 15 thoả thuận (AGR-001..015), 5 khách (CUS-001..005), hiệu lực từ 2026-04-01; cột rule: ONE_THIRD / ONE_HALF / LABEL_DATE_ONLY; **AGR-008 và AGR-014 chưa chốt rule — là trạng thái thật, cấm tự suy ONE_THIRD/ONE_HALF** | R-04 tr.80 |
| Khối lượng giao dịch | 1.800 dòng nhập/tháng; 7.200 dòng xuất/tháng (kỳ mẫu 3 tháng) | S1-03 tr.10; D1 tr.13 |
| Xe nhập kho | 6–10 xe tải đến cửa nhập mỗi ngày | S1-01 tr.5 |
| Số chuyến giao/ngày | **Chưa có con số trực tiếp trong RFP → cần hỏi khách.** RFP chỉ cho: 9 tài xế, slot điều xe sáng 88% / chiều 76% / tăng cường 42% (S1-03 tr.9), form kế hoạch có 午前1便/午後1便 (R-05 tr.84) |
| Ngưỡng nhiệt | 常温 15–25°C, 冷蔵 0–5°C, 冷凍 ≤-18°C; logger 15 phút/lần; kiểm mỗi lần nhập/xuất — chính sách Yuki, quản lý theo phiên bản | Bìa tr.1; D2 tr.21; R-01 tr.76 |
| Giờ dịch vụ | 05:00–23:00 JST, 2 ca, có khung giờ 2 ca chồng nhau | S1-02 tr.8 (NFR-AVL-01, tr.59) |
| Người dùng đồng thời | 80 concurrent (mục tiêu Yuki tự đặt, KHÔNG suy từ 42 nhân sự; cấm đọc 80 thành 42) | S1-02 tr.8 |
| Dữ liệu migration | Master 11 CSV ~3.600 dòng; lô/tồn 4 file ~28.000 dòng; lịch sử xuất FY2024–FY2026 + file theo tháng cũ (mục tiêu 3 năm); nhiệt độ ~2,5 triệu record; route/POD index 180.000 dòng; 2 file riêng cho xuất xứ gạo + số bò | S4-01 tr.63 |
| Cỡ test hiệu năng | 300.000 dòng xuất (= 7.200 × 36 tháng = 259.200, cộng buffer ~15%, làm tròn; cấm dùng lại 259.200) + 2,5 triệu readings | R-03 tr.79; NFR-PERF-02 tr.58 |
| Dữ liệu bẩn đã biết | Hạn bỏ trống, định dạng ngày lẫn lộn (YYYY/MM/DD, DD-MM-YYYY, Excel serial), đổi mã khách, dòng hoàn tiền âm — cấm tự suy ngày mơ hồ | S4-01 tr.63 |

**[SUY LUẬN]** CLAUDE.md ghi khách 30–50 nhân viên; RFP chốt chính xác 42 — khớp khoảng đó, lấy 42 làm chuẩn khi viết đề xuất.

---

## 6. Phạm vi IN / OUT (S3-05, tr.61–62)

**IN (gói cơ sở):** quản lý master; appointment; nhập kho; lô + tồn kho theo 3 dải nhiệt; put-away; FEFO/FIFO; order–allocation–pick–load–dispatch; logic 賞味期限/消費期限; lịch sử 日付逆転禁止; delivery window rule theo từng cặp khách-SKU; nhiệt độ/HACCP; cách ly + deviation; lập tuyến; POD/claim; truy xuất/thu hồi; báo cáo; audit; migration; đào tạo và hỗ trợ.

**OUT (ngoài gói cơ sở):**
- Cắt/chia/đóng gói lại, sản xuất, tính lương, tối ưu nhân sự
- Điều khiển phòng lạnh, PLC, datalogger — gói cơ sở **chỉ nhận CSV thiết bị xuất ra**; kết nối live datalogger/IoT là option (S3-02 tr.58: firmware có vendor endpoint nhưng không thuộc baseline)
- Gateway truy xuất toàn quốc cho mọi SKU — chỉ làm 3 lane: gạo, bò, nội bộ
- Tối ưu bổ sung tồn kho, dự báo nhu cầu, gợi ý tự động giảm waste (baseline báo cáo có cột waste/stockout/replenishment nhưng không dự báo — D8 tr.44)
- SMS, theo dõi GPS liên tục, lưu địa chỉ nhà tài xế

**Tiền đề kỹ thuật cố định** (S3-05, tr.62): web responsive tiếng Nhật; SSO cho nhân viên; managed device cho tài xế; ERP qua CSV/SFTP; dịch vụ bản đồ có license; mail relay doanh nghiệp. **Không native app, không chế độ offline cho giao dịch kho**; riêng POD cho phép queue mã hoá tối đa 8 giờ. Mọi thứ ngoài biên này phải báo giá thành option riêng, không giấu trong giá cơ sở (tr.61).

---

## 7. Kiểm tra 6 bẫy nghiệp vụ (đối chiếu CLAUDE.md ↔ RFP)

### Bẫy 1 — Ngưỡng nhiệt 3 dải do công ty tự công bố
- **RFP nói**: "三温度帯閾値を版管理… をポリシーとし、有効日で版管理" (BR-TEMP-01, D2 tr.21); "これはシミュレーション企業ポリシーである" (D2 tr.21); S1-04 tr.11 nhắc lại ngưỡng nhiệt/chu kỳ ghi/retention là chính sách riêng Yuki, không phải chuẩn ngành toàn quốc.
- **Giá trị Yuki công bố**: 常温 15–25°C / 冷蔵 0–5°C / 冷凍 ≤-18°C (bìa tr.1; D2 tr.21; R-01 tr.76).
- **Hiểu đúng** **[SUY LUẬN]**: ngưỡng là **dữ liệu cấu hình có phiên bản + ngày hiệu lực**, không hard-code số phổ thông; giao dịch cũ đánh giá theo phiên bản tại thời điểm đó. Phiếu nhập FORM-REC-01 (S3-01 tr.55) có trường "dải nhiệt tạm thời" (temporary band/lý do/người duyệt), nhưng RFP không có FR/BR nào yêu cầu cơ chế này — chưa có trong RFP → cần hỏi khách có thuộc phạm vi hỗ trợ không.

### Bẫy 2 — 賞味期限 ≠ 消費期限
- **RFP nói**: mỗi SKU tuyên bố một loại hạn, hai đường quyết định khác nhau (BR-EXP-01, D3 tr.25); "消費期限超過は hard stop。賞味期限はアラート/契約ポリシー使用" (D3 tr.25); nhầm lẫn hai loại là **lỗi nghiêm trọng khi chấm thầu** (S5-03 tr.71); hiện trạng đang nhầm vì nhập lại tay (D1 tr.13).
- **Hiểu đúng** **[SUY LUẬN]**: 消費期限 (an toàn) → quá hạn chặn cứng cả allocation lẫn giao, ghi exception bất biến; 賞味期限 (chất lượng) → cảnh báo + chính sách hợp đồng. Trong 12 SKU: CHI-001/003/004 dùng 消費期限, còn lại 賞味期限 (R-02 tr.78).

### Bẫy 3 — Hạn giao theo tập quán (1/3, 1/2) ≠ hạn dùng thực
- **RFP nói**: "3分の1ルールおよび2分の1ルールは契約による商慣行であり、法定規制ではない" (D3 tr.25); cột rule 3 giá trị ONE_THIRD/ONE_HALF/LABEL_DATE_ONLY theo từng cặp khách-SKU (R-04 tr.80); gọi 1/3 là luật = lỗi nghiêm trọng (S5-03 tr.71); SRC-EXT-08 xếp loại "商慣習 — 法律ではない" (R-08 tr.88).
- **Hiểu đúng** **[SUY LUẬN]**: rule cửa sổ giao hàng do **hợp đồng từng cặp khách-SKU chọn** (BR-DELWIN-01), nhưng cửa sổ được tính trên hạn trên nhãn (tỷ lệ hạn còn lại với ONE_THIRD/ONE_HALF, hoặc chỉ so ngày nhãn với LABEL_DATE_ONLY — R-04 tr.80; R-07 tr.87); AGR-008/AGR-014 chưa chốt rule — hệ thống phải cho cấu hình sau, dòng đơn liên quan giữ trạng thái business-review (R-04 tr.80; R-06 tr.86), cấm gán mặc định.

### Bẫy 4 — 日付逆転禁止 so với lịch sử cùng khách, không so với hôm nay
- **RFP nói**: "比較は常に個別顧客-SKUペアの配送履歴に基づき、今日との静的比較ではなく、他の顧客の履歴を借りない" (D3 tr.26); BR-DATE-01 (tr.25); ví dụ CUS-003/CHI-002: đã nhận hạn 2026-09-20 thì lô 2026-09-18 bị chặn dù còn xa hạn; CUS-004 chưa có lịch sử thì **không** mượn lịch sử CUS-003 (D3 tr.26); so với hôm nay = lỗi nghiêm trọng (S5-03 tr.71).
- **Hiểu đúng** **[SUY LUẬN]**: cần bảng lịch sử giao đã chấp nhận bất biến theo (customer, SKU, expiry, completion) — DR-HIST-01 (S3-01 tr.47), sửa chỉ bằng reversal event có lý do + người duyệt; test case bắt buộc "date reversal" dùng shipment-history.csv (R-06 tr.86).

### Bẫy 5 — Truy xuất chỉ bắt buộc với gạo và thịt bò
- **RFP nói**: 3 lane — gạo (BR-TRACE-01, theo 米トレーサビリティ法), bò (BR-TRACE-02, số cá thể 10 chữ số), nội bộ (BR-TRACE-03, P1, là chính sách Yuki); "AMB-001（米）およびCHI-001（牛）のみが法定トレーサビリティ識別子を担持する… 全国的な法的要件ではない" (R-02 tr.78); scope OUT ghi rõ không làm gateway toàn quốc cho mọi SKU (S3-05 tr.62).
- **Hiểu đúng** **[SUY LUẬN]**: không thiết kế truy xuất pháp định đồng loạt cho 12 SKU; 10 SKU còn lại dùng lô nội bộ + liên kết đối tác dạng dữ liệu có cấu trúc. Lane bò phải validate đúng 10 chữ số — số 9 chữ số trong dirty data phải vào business-review, cấm tự làm tròn (R-06 tr.86).

### Bẫy 6 — HACCP + giới hạn giờ lái xe là ràng buộc cứng khi lập lịch
- **RFP nói**: (a) HACCP: BR-HACCP-01 completeness queue (D6 tr.37), FR-TEMP-03 review 15 phút, FR-TEMP-04 không đóng case thiếu rationale; KPI 18h→≤4h chuẩn bị hồ sơ (S1-03 tr.10); retention 3 năm (S3-04 tr.61). (b) Giờ lái: FR-SCH-02 "ルート違反は公開禁止" — tuyến vi phạm **cấm công bố** (D5 tr.34); FR-SCH-03 chèn nghỉ trước 4h lái liên tục; nguyên tắc "ルートは公開時点の有効なドライバー規則版にバインド" (D5 tr.33); capacity plan không được giả định giờ làm thêm luôn sẵn có (D5 tr.34); bỏ ràng buộc cứng tài xế = lỗi nghiêm trọng (S5-03 tr.71); ACC-SCH-01 là cổng nghiệm thu riêng (S5-04 tr.72).
- **Hiểu đúng** **[SUY LUẬN]**: hai ràng buộc này chặn ở hai cơ chế khác nhau, không gộp làm một. (1) Giờ lái xe: chỉ có cơ chế **chặn publish tuyến** (FR-SCH-02, "ルート違反は公開禁止", D5 tr.34); bộ quy tắc giờ lái phải quản lý theo phiên bản (đổi luật không hồi tố tuyến đã công bố); sự kiện bất khả kháng ghi riêng, không trộn vào tuân thủ thường (FR-SCH-05). (2) HACCP: RFP không gắn HACCP với việc lập lịch/publish tuyến; HACCP chặn ở **xác nhận nhập/xuất** (BR-TEMP-02 D2 tr.21; FR-OUT-05 D4 tr.30) và sinh **completeness queue** không tự đóng (BR-HACCP-01, D6 tr.37). Nghĩa vụ HACCP là pháp định, nhưng **tần suất cụ thể** trong RFP là chính sách Yuki (D6 tr.37) — đề xuất phải phân tầng đúng như vậy. Câu "HACCP là ràng buộc cứng khi lập lịch giao hàng" (CLAUDE.md) chưa có trong RFP → cần hỏi khách.

---

## Điểm treo cần hỏi khách (tổng hợp)

1. Số chuyến giao hàng/ngày và cấu trúc ca giao (chỉ có slot sáng/chiều/tăng cường + 9 tài xế) — chưa có trong RFP → cần hỏi khách.
2. Rule cửa sổ giao hàng cho AGR-008, AGR-014 (RFP chủ đích để trống — xác nhận quy trình chốt sau go-live).
3. KPI chi tiết bảng quản trị (received_qty, waste_qty…) — RFP nói "cung cấp khi due diligence theo yêu cầu" (R-03 tr.79).
4. Mức tuân thủ bảo vệ dữ liệu cá nhân (APPI) cụ thể ngoài DR-PRIV-01 — chưa có trong RFP → cần hỏi khách.
5. Hạn nộp hồ sơ, đầu mối Q&A: RFP ghi "theo thư mời" (招待状記載, S5-05 tr.75) — cần lấy thư mời.
6. Ngân sách/khung giá: chưa có trong RFP → cần hỏi khách (RFP chỉ cho template bảng chi phí, S5-02 tr.70).
