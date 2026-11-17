# Phạm vi prototype Lab 2 — Product B (kho lạnh 3 dải nhiệt)

- Vai trò viết: Tech Lead. Ngày chốt: 2026-11-15.
- Stack cố định: **Next.js (App Router, TypeScript, Tailwind) + Supabase (Postgres, Auth, RLS) + Vercel**.
- Budget: **~16 giờ** cho toàn bộ (DB → khung → auth → màn hình → review/deploy). Cắt theo 80/20: làm thật các luồng chứa 6 bẫy nghiệp vụ, mock phần tích hợp/thiết bị, bỏ phần quản trị/báo cáo phụ.
- Nguồn: `docs/00_rfp-vi.md` (RFP dịch), `01_requirements-extract.md`, `02_qa-list.xlsx` (Q1–Q24), `03_function-list.xlsx`, `04_feature-list.xlsx`, `05_screen-list.xlsx` (SCR-01..32), `06_user-stories.md` (US-01..38).
- Quy ước: **CẦN XÁC NHẬN** = tài liệu không đủ căn cứ, prototype dùng giả định ghi rõ và để tham số hoá được, không hard-code.

---

## 1. Nguyên tắc nghiệp vụ prototype phải đúng (6 bẫy Lab 1)

| # | Bẫy | Cách prototype làm | Căn cứ |
|---|---|---|---|
| 1 | Ngưỡng 3 dải là chính sách Yuki, có phiên bản | Bảng `temp_policies` (band, min_c, max_c, version, effective_from/to). Seed v1: 常温 15–25°C, 冷蔵 0–5°C, 冷凍 ≤-18°C. Code **không chứa số ngưỡng**; mọi đánh giá lưu `temp_policy_id` đã dùng. Biên là "thuộc ngưỡng" (25,0 pass; 25,1 alarm) | BR-TEMP-01 (D2 tr.21), R-01, R-06, US-08/09/24 |
| 2 | 賞味期限 ≠ 消費期限 | `skus.expiry_type` ∈ `BEST_BEFORE` / `USE_BY`. USE_BY chạm/quá hạn → **chặn cứng** + ghi `exception_events` bất biến. BEST_BEFORE → **chỉ cảnh báo**, quyết định giao theo rule hợp đồng | BR-EXP-01/02 (D3 tr.25), R-02, US-10/11 |
| 3 | 1/3 – 1/2 là tập quán hợp đồng, không phải luật, khác hạn dùng | `delivery_agreements.delivery_window_rule` ∈ `ONE_THIRD` / `ONE_HALF` / `LABEL_DATE_ONLY` / **NULL**. NULL (AGR-008, AGR-014) → đơn vào `business_review`, **không tự gán mặc định**. UI ghi nhãn "tập quán thương mại theo hợp đồng" | BR-DELWIN-01, R-04 tr.80, R-06, US-02/14 |
| 4 | 日付逆転禁止 so lịch sử đúng cặp khách–SKU | So hạn lô đề xuất với lần giao **đã chấp nhận gần nhất** trong `shipment_history` của **đúng (customer_id, sku_id)**. Không so hôm nay, không mượn lịch sử khách khác; chưa có lịch sử → không chặn. Vi phạm → **chặn** (RFP dùng "phải chặn", không có chế độ chỉ cảnh báo) | BR-DATE-01, D3 tr.26 (CUS-003/CHI-002), DR-HIST-01, US-13 |
| 5 | Truy xuất pháp định chỉ gạo + bò | Lane `RICE` (AMB-001): bắt buộc transaction ID + xuất xứ. Lane `BEEF` (CHI-001): số cá thể **đúng 10 chữ số**, sai → chặn, không tự đệm/làm tròn. 10 SKU còn lại lane `INTERNAL`, không đòi trường pháp định | BR-TRACE-01/02/03, R-02 tr.78, US-29 |
| 6 | Giờ lái là ràng buộc cứng | Tuyến có vi phạm → nút công bố bị khoá ở **server** (API từ chối), hiện đúng khoảng vi phạm. Ngưỡng lấy từ `driver_rule_versions`, tuyến công bố gắn `rule_version_id`, không hồi tố | FR-SCH-02/04, D5 tr.33–34, US-21 |

Thứ tự loại trừ khi phân bổ lô (cố định, D3 tr.25 / FR-OUT-02): **USE_BY → lệch dải nhiệt → cách ly → cửa sổ giao → 日付逆転 → FEFO (cùng hạn thì FIFO theo giờ nhập)**. Mỗi lô bị loại ghi bước + rule làm bằng chứng.

---

## 2. Vai trò prototype

| Role | Tương ứng RFP (S1-02) | Được làm trong prototype |
|---|---|---|
| `admin` | Quản trị master data, IT | Master data, hợp đồng khách-SKU, xem mọi màn |
| `warehouse_staff` | Người phụ trách nhập kho, nhân viên trung tâm | Kiểm hàng nhập, xem tồn kho. **Không** release/scrap lô (S1-02: "không tự ý giải phóng hàng cách ly") |
| `qa_haccp` | Quản lý chất lượng | Phiên bản ngưỡng nhiệt, cảnh báo nhiệt + ghi xử lý, release/scrap lô, truy xuất |
| `dispatcher` | Người lập kế hoạch giao vận (+ gánh phần Sales tạo đơn trong prototype) | Đơn xuất, phân bổ lô, xác nhận giao (POD mô phỏng), lập tuyến + công bố |

Mọi role đọc được Dashboard. Ma trận chi tiết thực thi bằng RLS + kiểm role ở API (xem plan phase 3).

---

## 3. Bảng phạm vi màn hình

Trạng thái: **Làm thật** = UI + API + logic thật trên dữ liệu Supabase · **Mock** = có màn/nút nhưng dữ liệu, thiết bị hoặc tích hợp là giả · **Ngoài phạm vi** = không làm trong Lab 2.

| Mã màn hình | Tên | Vai trò dùng | Mã yêu cầu RFP | Trạng thái | Lý do | Nếu làm thật cần gì |
|---|---|---|---|---|---|---|
| SCR-01 | Đăng nhập | Tất cả 4 role | NFR-SEC-01, NFR-SEC-02, IF-IDP-01 | Làm thật | Bắt buộc theo yêu cầu Lab; mọi màn khác dựa vào role | Lên bản thật: thay email/password Supabase bằng OIDC với IdP doanh nghiệp (Q16), MFA cho role đặc quyền, phiên ngắn tự khoá cho thiết bị chung 5 cửa kho, managed device cho tài xế |
| SCR-02 | Quản trị master data (SKU, khách, NCC, vị trí) | admin | DR-MST-01 | Làm thật (rút gọn) | Allocation, kiểm nhập, kiểm nhiệt đều đọc master; phải sửa được dải nhiệt/loại hạn/lane để demo | Vòng đời created→review→active→retired, phiên bản effective_from/to, chặn tự duyệt (US-01); master thiết bị logger |
| SCR-03 | Hợp đồng khách-SKU | admin | DR-MST-01, BR-DELWIN-01, R-04 | Làm thật | Chứa Bẫy 3: rule NULL phải hiển thị "chưa chốt", chốt rule sau bằng ngày hiệu lực không đổi cấu trúc | Duyệt rule bởi sales owner + ngày hiệu lực có quy trình (Q6) |
| SCR-04 | Cấu hình chính sách theo phiên bản | qa_haccp (ngưỡng nhiệt); admin (rule giờ lái) | BR-TEMP-01, FR-SCH-02, BR-HACCP-01 | Làm thật (chỉ ngưỡng nhiệt) / Mock (rule giờ lái, nhịp HACCP) | Bẫy 1 cần chứng minh tạo phiên bản ngưỡng mới mà giao dịch cũ giữ phiên bản cũ. Rule giờ lái chỉ seed 1 phiên bản, xem read-only | Màn sửa phiên bản rule giờ lái (Q13), nhịp HACCP cấu hình theo phiên bản (Q14) |
| SCR-05 | Lịch appointment nhập kho | warehouse_staff | FR-REC-01 (P1) | Ngoài phạm vi | P1, không chứa bẫy; kiểm hàng nhập tạo phiếu trực tiếp | Bảng appointment, cảnh báo trùng mã tham chiếu NCC, liên kết sang phiếu kiểm hàng |
| SCR-06 | Kiểm hàng nhập kho | warehouse_staff | FR-REC-02, FR-REC-03, FR-REC-04, FR-REC-05, BR-TEMP-01, BR-TEMP-02, BR-TRACE-01/02 | Làm thật (ảnh/mã vạch = Mock) | Bắt buộc theo Lab. Kiểm trường P0, nhiệt độ theo phiên bản ngưỡng, dải SKU ↔ vị trí, trường pháp định gạo/bò, chia nhận/từ chối/giữ, sinh lô idempotent, tự cách ly | Chụp ảnh thật (camera trình duyệt + hash), quét mã vạch; luồng phê duyệt khi tổng dòng lệch số báo cáo (FR-REC-03); dải nhiệt tạm thời + duyệt (Q1) |
| SCR-07 | Quản lý lô & cách ly | qa_haccp | FR-INV-05, FR-REC-05 | Làm thật (gộp vào SCR-08) | Lô cách ly từ kiểm nhập cần đường release/scrap có rationale để demo đủ vòng | Màn riêng theo khu -Q, liên kết deviation case |
| SCR-08 | Tra cứu tồn kho | Tất cả (thao tác release/scrap: qa_haccp) | FR-INV-06, FR-INV-05, BR-EXP-01 | Làm thật | Bắt buộc theo Lab: tồn theo lô + dải nhiệt + loại hạn + hạn dùng + trạng thái | Phân quyền theo kho (1 kho nên chưa cần), lọc theo NCC/vị trí đầy đủ, phân trang lớn |
| SCR-09 | Put-away & di chuyển | warehouse_staff | FR-INV-01/02/03 | Ngoài phạm vi | Vị trí chọn ngay ở kiểm nhập (vẫn chặn lệch dải theo BR-TEMP-02); gợi ý vị trí là P1 | Sức chứa vị trí, gợi ý vị trí, nhật ký di chuyển, chặn tồn âm |
| SCR-10 | Kiểm kê mù & duyệt chênh lệch | warehouse_staff | FR-INV-04 (P1) | Ngoài phạm vi | P1, không chứa bẫy | Task kiểm kê ẩn số sổ sách, maker-checker 2 cấp |
| SCR-11 | Quản lý đơn hàng (đơn xuất) | dispatcher | FR-OUT-01, BR-DELWIN-01 | Làm thật | Bắt buộc theo Lab. Lỗi "master chưa định nghĩa", "chưa có hợp đồng khách-SKU", trùng tham chiếu; đơn thuộc hợp đồng rule NULL → `business_review` | Đơn nhiều dòng, nhập từ ERP (IF-ERP-01), vòng trạng thái đủ created→…→delivered |
| SCR-12 | Phân bổ lô (allocation) | dispatcher | FR-OUT-02, BR-EXP-02, BR-TEMP-02, FR-INV-05, BR-DELWIN-01, BR-DATE-01, BR-FEFO-01 | Làm thật (**trọng tâm**) | Chứa 4/6 bẫy; hiển thị bằng chứng loại trừ từng lô; khoá dòng lô khi commit để không over-allocate | Phân bổ một phần/nhiều dòng, huỷ phân bổ, duyệt tay cho đơn business_review (Q6) |
| SCR-13 | Lịch sử giao theo khách-SKU | dispatcher, qa_haccp | DR-HIST-01, BR-DATE-01 | Làm thật (chỉ đọc) | Căn cứ đối chiếu 日付逆転 phải nhìn thấy được; bảng append-only | Reversal event có lý do + người duyệt (US-13); baseline từ migration 3 năm (Q7) |
| SCR-14 | Picking task | warehouse_staff | FR-OUT-03 (P1), FR-OUT-04 | Ngoài phạm vi | Không chứa bẫy; tốn thời gian UI thiết bị | Gom task theo khu/tuyến, xác nhận bằng quét |
| SCR-15 | Kiểm tra xuất & chất hàng | warehouse_staff | FR-OUT-04, FR-OUT-05 | Ngoài phạm vi | Budget 16h; logic kiểm nhiệt đã chứng minh ở SCR-06 và dùng lại được | Barcode SKU/lô/xe/seal, nhiệt xe + hàng trước xuất, deviation + chặn xuất |
| SCR-16 | Khiếu nại / trả hàng | — | FR-OUT-07 (P1) | Ngoài phạm vi | P1, không chứa bẫy | Liên kết dòng giao, lô, bằng chứng POD |
| SCR-17 | Lập tuyến & kiểm tra ràng buộc | dispatcher | FR-SCH-01, FR-SCH-02, FR-SCH-04 | Làm thật (rút gọn rule) | Bắt buộc theo phạm vi đã thống nhất (Bẫy 6). Planner nhập timeline lái/dừng/nghỉ, hệ thống kiểm và khoá công bố | Đủ bộ ngưỡng FR-SCH-02 (năm/tháng/tuần/nghỉ giữa 2 ngày cần dữ liệu tích luỹ), chèn nghỉ FR-SCH-03, đổi tuyến sau công bố có lý do + phiên bản, dịch vụ bản đồ (IF-MAP-01) |
| SCR-18 | Itinerary tài xế | — | FR-SCH-03/04/05 | Ngoài phạm vi | Không có role tài xế trong prototype | Role driver, web responsive trên managed device, sự kiện bất khả kháng |
| SCR-19 | Ghi nhận POD | dispatcher (thay tài xế) | FR-OUT-06, BR-POD-01, DR-POD-01 | Mock | Cần POD để đơn thành "đã giao" và ghi `shipment_history`, nhờ đó demo được lần phân bổ sau bị chặn đảo ngày | Ảnh/chữ ký thật + hash, vị trí, queue offline mã hoá ≤8h (NFR-AVL-02), checklist khác nhau theo 車上渡し/軒先渡し |
| SCR-20 | Import & giám sát CSV logger | qa_haccp | FR-TEMP-01, IF-LOG-01 | Mock | Không có thiết bị/file thật; readings seed sẵn để cảnh báo nhiệt có dữ liệu | Upload CSV + SHA-256, idempotent theo hash, từ chối dòng lỗi kèm số dòng, timezone thiết bị |
| SCR-21 | Hàng đợi cảnh báo nhiệt độ | qa_haccp | FR-TEMP-02, FR-TEMP-03, BR-TEMP-01 | Làm thật | Thuộc phạm vi đã thống nhất: đánh giá reading theo phiên bản ngưỡng → alarm (first/last/peak/duration, lô ảnh hưởng), đồng hồ SLA 15 phút, ghi review đầu + ghi xử lý | Mỗi alarm tự tạo deviation + cách ly lô liên quan (D6 tr.37) — prototype chỉ liệt kê lô ảnh hưởng, QA cách ly tay ở SCR-08; alarm thời gian thực khi có import, gửi mail (IF-MAIL-01), đưa review trễ vào báo cáo quản lý |
| SCR-22 | Deviation case | qa_haccp | FR-TEMP-04 | Ngoài phạm vi | Thay bằng "ghi xử lý" trên alarm (note bắt buộc khi đóng) | Case điều tra → bằng chứng → corrective action → quyết định lô, thiếu rationale/đính kèm không đóng được |
| SCR-23 | Hàng đợi completeness HACCP | qa_haccp | BR-HACCP-01 | Ngoài phạm vi | Cần nhịp HACCP cấu hình (Q14) + nhiều loại bản ghi; quá budget | Quét thiếu bản ghi theo nhịp phiên bản, queue không tự đóng |
| SCR-24 | Tìm kiếm truy vết | qa_haccp, dispatcher | FR-TRC-01, BR-TRACE-01/02/03 | Làm thật (xuất PDF = Mock) | Thuộc phạm vi đã thống nhất: lô → khách đã giao + tồn còn lại; tìm theo lô, supplier lot, số cá thể bò, xuất xứ gạo; nhãn "pháp định" chỉ cho RICE/BEEF; chỉ rõ điểm kết thúc liên kết | Đạt ≤60 giây trên 300.000 dòng xuất + 2,5 triệu readings (NFR-PERF-02), truy ngược lên NCC, xuất PDF/CSV có manifest |
| SCR-25 | Recall case & đối soát | — | FR-TRC-02 | Ngoài phạm vi | Budget; truy vết SCR-24 đã cho dữ liệu nền | Case thu hồi, đẳng thức affected = on-hand + shipped = returned + unresolved + disposed |
| SCR-26 | Thông báo thu hồi | — | FR-TRC-03 (P1) | Ngoài phạm vi | P1 | Phiên bản thông báo, approver, mail relay |
| SCR-27 | Báo cáo vận hành (12 loại) | — | FR-RPT-01 (P1) | Ngoài phạm vi | Thay bằng Dashboard vài KPI (SCR-33) | 12 báo cáo theo catalog D8, lọc + CSV, quyền theo vai trò |
| SCR-28 | Audit export | — | FR-RPT-02, IF-ARCH-01 | Ngoài phạm vi | Budget | Gói bằng chứng + manifest checksum tái tạo được |
| SCR-29 | Giám sát tích hợp & batch | — | IF-ERP-01, IF-MAP-01, IF-MAIL-01 | Mock (không có màn) | Không có ERP/bản đồ/mail thật; master + đơn mẫu lấy từ seed thay cho ERP | Job SFTP CSV có schema version + idempotency key, reject cả file khi checksum lệch; bản đồ có cache/timeout |
| SCR-30 | Quản trị người dùng & vai trò | admin | NFR-SEC-02 | Mock | User demo tạo bằng script (`scripts/create-demo-users`), không có màn | Màn gán role, tách người lập/người duyệt, quản lý thiết bị chung |
| SCR-31 | Tra cứu audit log | — | NFR-AUD-01 | Ngoài phạm vi | Prototype chỉ giữ append-only cho `shipment_history`, `lot_status_events`, `exception_events` | Audit log toàn hệ thống append-only + màn tra cứu cho kiểm toán viên |
| SCR-32 | Đối soát migration | — | DR-MIG-01, ACC-MIG-01 | Ngoài phạm vi | Prototype dùng seed tổng hợp, không có migration | Lineage từng dòng, ACCEPT/REJECT/DUPLICATE/BUSINESS-REVIEW |
| **SCR-33 (mới)** | Dashboard KPI | Tất cả | S1-03 (KPI), FR-RPT-01 (rút gọn) | Làm thật | Thuộc phạm vi đã thống nhất; màn mở đầu demo | KPI chuẩn S1-03 cần dữ liệu thật 3 tháng (R-03, KPI chi tiết cung cấp khi due diligence) |

Tổng: **Làm thật 14** (SCR-01/02/03/04 phần ngưỡng/06/07 gộp/08/11/12/13/17/21/24/33) · **Mock 4** (SCR-19/20/29/30, cộng phần mock bên trong SCR-04/06/24) · **Ngoài phạm vi 15** (SCR-05/09/10/14/15/16/18/22/23/25/26/27/28/31/32). Tổng 33 dòng = 32 màn Lab 1 + 1 màn mới.

KPI Dashboard (SCR-33), chỉ đếm từ dữ liệu thật trong DB, không đặt ngưỡng mới: tồn kho (số lô, số lượng) theo 3 dải · số lô đang cách ly · lô USE_BY đã chạm hạn còn trong kho (bị chặn) · alarm nhiệt đang mở / quá SLA 15 phút · đơn `business_review` / chờ phân bổ · tuyến bị khoá công bố do vi phạm.

---

## 4. Chi tiết phần Mock — mock cái gì

| Mock | Loại mock | Làm thế nào trong prototype | Ranh giới (không được giả vờ) |
|---|---|---|---|
| Dữ liệu cảm biến (datalogger DL-A01/C01/F01) | **Dữ liệu + cảm biến** | Seed `temperature_readings` mỗi 15 phút cho 3 zone, có chuỗi vượt ngưỡng ở zone C và F (vd 5,1°C; -15°C) và giá trị đúng biên (5,0°C; 25,0°C). SCR-20 chỉ hiển thị danh sách reading đã seed, ghi rõ "dữ liệu mẫu" | Logic đánh giá reading → alarm là **thật** (`lib/rules/temperature`), không mock |
| Import ERP | **Tích hợp** | Không có SFTP/CSV. Master (12 SKU, 5 khách, 15 hợp đồng) và đơn mẫu nạp bằng seed SQL | Không dựng màn import giả; ghi rõ trong README |
| Chụp ảnh / quét mã vạch | **Thiết bị** | Trường `photo_ref` trên phiếu kiểm hàng là input text/checkbox "đã chụp ảnh (mô phỏng)" sinh chuỗi tham chiếu; mã lô nhập tay | Trường ảnh vẫn là **P0 bắt buộc** — bỏ trống vẫn bị chặn (FR-REC-02) |
| POD chữ ký / ảnh | **Thiết bị + dữ liệu** | Nút "Xác nhận đã giao (POD mô phỏng)" trên đơn đã phân bổ: nhập tên người nhận + tick bằng chứng; hệ thống ghi `shipment_history` (append-only) với expiry của lô đã giao | Việc ghi lịch sử giao là **thật** và là đầu vào thật của BR-DATE-01 ở lần phân bổ sau |
| Xuất PDF truy vết | **Tích hợp (IF-ARCH-01)** | Nút "In / Lưu PDF" gọi `window.print()` với CSS in | Không có manifest SHA-256, không phải bằng chứng audit |
| Tài khoản người dùng | **Tích hợp (IdP)** | Script tạo 4 user demo (1 user/role) qua Supabase Admin API | Không có SSO/MFA |
| Rule giờ lái & dữ liệu tài xế/xe | **Dữ liệu** | Seed 1 `driver_rule_versions` (v1, theo D5 tr.34), 3 tài xế, 3 xe (1 xe/dải) | Kiểm tra vi phạm + khoá công bố là **thật** |

**Ngoài phạm vi (không mock)**: tối ưu tuyến tự động — **lệch so với gợi ý ban đầu** (gợi ý xếp vào Mock). Lý do: RFP chỉ yêu cầu tạo tuyến + kiểm ràng buộc + chặn công bố (D5 tr.33); Q11 (CHẶN BÁO GIÁ) đang giả định planner xếp tay, không VRP. Mock một "thuật toán tối ưu" sẽ tạo kỳ vọng sai cho khách. Planner tự xếp, hệ thống chỉ kiểm.

---

## 5. Thay đổi so với Lab 1

1. **Vai trò rút còn 4** (`admin`, `warehouse_staff`, `qa_haccp`, `dispatcher`) thay vì 8 chức danh S1-02. Sales tạo đơn → giao cho `dispatcher`; tài xế, CS, kiểm toán viên, IT không có role riêng.
2. **Xác thực**: SSO/OIDC + MFA + managed device (FT-045, SCR-01) → Supabase Auth email/password + middleware + RLS.
3. **Thêm màn mới SCR-33 Dashboard KPI** — Lab 1 không có (Lab 1 dồn KPI vào SCR-27 báo cáo 12 loại).
4. **Gộp màn**: SCR-02 + SCR-03 + SCR-04 (phần ngưỡng nhiệt) thành khu "Master & chính sách" có tab; SCR-07 gộp vào SCR-08 (thao tác release/scrap ngay trên tồn kho); SCR-11 + SCR-12 thành trang đơn + chi tiết phân bổ; SCR-13 chỉ đọc.
5. **Master data bỏ vòng đời duyệt** (created→review→active→retired, chặn tự duyệt — US-01). Riêng ngưỡng nhiệt và hợp đồng khách-SKU vẫn giữ `effective_from` vì là lõi Bẫy 1 và Bẫy 3.
6. **Mô hình đơn hàng 1 dòng = 1 SKU** (theo từ điển dữ liệu Order S3-01 tr.50 có `sku_id` trên order). Phân bổ **toàn phần hoặc không** (đủ số lượng mới commit; thiếu → báo thiếu, đơn giữ nguyên trạng thái).
7. **Kiểm giờ lái rút gọn**: chỉ kiểm trong 1 ngày tuyến — lái liên tục ≤4h, thời gian ràng buộc ngày (13h tiêu chuẩn / 15h tối đa). Bỏ ngưỡng năm/tháng/tuần (960h, 3.300h, 284h, 44h), lái bình quân 2 ngày, nghỉ 9–11h giữa 2 ngày — các ngưỡng này cần dữ liệu tích luỹ nhiều ngày. Vẫn lưu đủ số trong `driver_rule_versions` để mở rộng sau.
8. **Tuyến công bố không cho sửa** trong prototype (FR-SCH-04 phần "đổi sau công bố có lý do + phiên bản mới" chuyển Ngoài phạm vi).
9. **POD (FT-026), datalogger import (FT-033/049), tích hợp ERP (FT-048)** từ Must → Mock (mục 4).
10. **Deviation case (FT-036)** → thay bằng ghi xử lý trên alarm; **completeness HACCP (FT-037)**, **recall (FT-041)**, **audit export (FT-044)**, **migration (FT-053)** → Ngoài phạm vi.
11. **Dải nhiệt tạm thời trên phiếu nhập** (một phần FT-014, US-08 AC3) → Ngoài phạm vi; Q1 chưa có câu trả lời.
12. **Dữ liệu demo tổng hợp**: các file fixture của RFP (lots.csv, shipment-history.csv, temperature-events.csv…) **không có trong docs/**. Seed dựng lại từ R-01 (vị trí), R-02 (12 SKU), R-04 (15 hợp đồng), ví dụ D3 tr.26 (CUS-003/CHI-002 hạn 2026-09-20). Tên khách/NCC là nhãn giả.
13. **Ngôn ngữ UI**: tiếng Việt kèm thuật ngữ gốc Nhật (賞味期限, 消費期限, 日付逆転…). NFR-LOC-01 (UI tiếng Nhật) Ngoài phạm vi.
14. **Phi chức năng** (NFR-PERF-01/02, BCP, AVL, WCAG 2.2 AA, observability) Ngoài phạm vi; chỉ giữ bảo mật cơ bản: RLS, khoá service role ở server, bảng lịch sử append-only.
15. **Tối ưu tuyến** chuyển từ "Mock" (gợi ý) sang "Ngoài phạm vi" (lý do ở mục 4).

---

## 6. CẦN XÁC NHẬN (giả định prototype dùng)

| # | Điểm | Giả định trong prototype (tham số hoá, không hard-code) | Nguồn |
|---|---|---|---|
| 1 | Công thức 1/3 – 1/2: mốc bắt đầu, thời điểm phán định, làm tròn | Hạn giao = `production_date + floor((expiry_date − production_date) × tỷ lệ)` theo ngày; lô đạt nếu `requested_date ≤ hạn giao`. Tỷ lệ 1/3, 1/2 (Hình 7 D3 ghi 33%/50%). Lưu bằng chứng (shelf days, hạn giao, ngày phán định) | Q5 (CHẶN BÁO GIÁ), D3 tr.25 |
| 2 | LABEL_DATE_ONLY so nhãn với mốc nào, bằng ngày có đạt không | Đạt nếu `expiry_date ≥ requested_date` | R-04, R-07 |
| 3 | 日付逆転: hạn **bằng** hạn lần giao trước có được không | Bằng → **cho phép**; chỉ chặn khi nhỏ hơn. "Gần nhất" = dòng có `completed_at` lớn nhất của cặp | BR-DATE-01, R-07 ("hạn cũ hơn") |
| 4 | USE_BY "chạm hạn" tính tại ngày nào | Chặn nếu `expiry_date ≤ max(hôm nay, requested_date)` — đây là kiểm an toàn của lô, **không phải** phép so 日付逆転 | BR-EXP-02 |
| 5 | Ngưỡng ngày cảnh báo 賞味期限 | Không đặt số; chỉ hiển thị số ngày còn lại + nhãn cảnh báo. Cột `best_before_warning_days` trên SKU để trống | Q3 |
| 6 | Nhiệt độ nhập ngoài ngưỡng: chặn xác nhận (BR-TEMP-02) hay nhận vào cách ly (FR-REC-05) | Không cho vào tồn khả dụng: lô tạo ở trạng thái `quarantine`, vị trí -Q cùng dải, ghi lý do. Lệch dải SKU ↔ vị trí thì **chặn** hẳn | BR-TEMP-02, FR-REC-05, US-05 |
| 7 | 常温 không có khu -Q | Lô 常温 cần cách ly (nhiệt ngoài ngưỡng hoặc số lượng giữ) → trạng thái `quarantine` (vẫn bị loại khỏi phân bổ), giữ vị trí đã chọn, hiện cảnh báo "chưa có khu cách ly 常温" | R-01 tr.77 |
| 7b | Thiếu trường truy xuất gạo/bò: chặn xác nhận (BR-TRACE-01/02) hay cho vào cách ly (FR-REC-05) | **Chặn xác nhận**, chỉ rõ trường thiếu/sai | BR-TRACE-01/02, FR-REC-05, US-05 AC3 |
| 7c | Loại hạn trên nhãn khác loại hạn trong SKU master | Chặn xác nhận, yêu cầu kiểm lại (chưa có quyền ghi đè) | BR-EXP-01, D1 tr.13 (PP-01) |
| 8 | Bò 9 chữ số tại kiểm nhập: từ chối hay business-review | Chặn xác nhận, thông báo rõ "không tự đệm thành 10 số" | R-06 (case migration), US-29 |
| 9 | Phút nghỉ tối thiểu để reset bộ đếm lái liên tục 4h | Tham số `min_break_minutes` trong `driver_rule_versions`; seed giá trị tạm, gắn nhãn CẦN XÁC NHẬN trên UI. RFP chỉ ghi "lái liên tục tối đa 4 giờ" | D5 tr.34, Q12, OPS-LAW-01 |
| 10 | Ngày làm việc 13h–15h: khi nào được kéo dài tới 15h | >15h = vi phạm (khoá công bố); 13h < x ≤ 15h = cảnh báo, không khoá | D5 tr.34 |
| 11 | Phân bổ một phần khi thiếu hàng | Không phân bổ một phần | FR-OUT-02 không nói |
| 12 | Đơn của hợp đồng rule NULL được duyệt tay thế nào | Prototype chỉ giữ `business_review`, chưa có nút duyệt | Q6 |
| 13 | So 日付逆転 theo khách hay theo điểm giao | Theo `customer_id` | Q8 |
| 14 | UI demo cho khách Nhật hay nội bộ | Nội bộ (tiếng Việt) | NFR-LOC-01 |
| 15 | SLA xác nhận cảnh báo nhiệt: bao nhiêu phút kể từ lúc phát sinh thì coi là trễ | 15 phút, lấy từ baseline S1-03 của RFP ("11% cảnh báo xác nhận trễ quá 15 phút"). Prototype để hằng số trong `lib/rules/temperature-reading-evaluation.ts`; bản thật nên chuyển thành cấu hình có phiên bản như ngưỡng nhiệt | S1-03, Q14 |
| 16 | Thời điểm đo nhiệt khi kiểm hàng nhập: lấy mốc nào để chọn phiên bản ngưỡng | Theo thời điểm ĐO ghi trên phiếu, không theo thời điểm bấm xác nhận — để phiếu cũ không bị đánh giá lại khi ngưỡng đổi phiên bản (Bẫy 1) | BR-TEMP-01, SCR-04 |

---

## 7. Ước lượng (khớp blueprint `plans/261115-1335-lab2-cold-chain-prototype/`)

| Phase | Nội dung | Giờ |
|---|---|---|
| 01 | DB schema + seed Supabase | 2,0 |
| 02 | Khung Next.js + layout + /api/health | 1,0 |
| 03 | Auth + phân quyền + RLS + user demo | 1,5 |
| 04 | Master data + hợp đồng + phiên bản ngưỡng nhiệt | 1,0 |
| 05 | Kiểm hàng nhập | 2,0 |
| 06 | Tồn kho + release/scrap | 1,0 |
| 07 | Đơn xuất + phân bổ FEFO/日付逆転/cửa sổ giao + lịch sử + POD mock | 3,0 |
| 08 | Cảnh báo nhiệt + reading mock | 1,0 |
| 09 | Lập tuyến + kiểm giờ lái | 1,5 |
| 10 | Truy xuất + Dashboard | 1,0 |
| 11 | Review bảo mật + deploy Vercel + README/Quick Report | 1,0 |
| | **Tổng** | **16,0** |

Nếu trễ, cắt theo thứ tự: phase 09 rút còn kiểm lái liên tục 4h → phase 10 bỏ dashboard (giữ truy xuất) → phase 08 bỏ ghi xử lý. **Không cắt** phase 05 và 07.
