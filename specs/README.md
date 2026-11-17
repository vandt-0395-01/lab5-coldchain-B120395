# Bộ specs — Product B, hệ thống kho lạnh 3 dải nhiệt (LAB-4)

Bộ thiết kế cho **食品コールドチェーン業務支援システム** của Công ty CP Logistics Lạnh Yuki, dựng
từ prototype chạy thật ở LAB-2: <https://lab2-cold-chain-prototype.vercel.app>

Đây là đầu vào trực tiếp để bẻ task ở LAB-5, không phải tài liệu minh hoạ.

---

## Nên đọc theo thứ tự này

| Bước | File | Vì sao đọc trước |
|---|---|---|
| 1 | [`PREMISE.md`](PREMISE.md) | **Đọc trước tiên.** Chốt specs tả cái gì — hệ thống đúng theo RFP, hay prototype đã cắt gọn. Mọi tài liệu sau bám theo quyết định này |
| 2 | [`architecture/architecture.md`](architecture/architecture.md) | Thành phần, luồng dữ liệu, và **các điểm rẽ nhánh logic** — phần quan trọng nhất |
| 3 | [`architecture/ADR-index.md`](architecture/ADR-index.md) | Sáu quyết định kiến trúc, mỗi cái có mục *Phương án đã bỏ và lý do* |
| 4 | [`database/COLDCHAIN_DATABASE.md`](database/COLDCHAIN_DATABASE.md) | Mô hình dữ liệu theo biểu mẫu BM-2-901-50 |
| 5 | [`database/gap-list.md`](database/gap-list.md) | **29 chỗ prototype làm khác thiết kế**, phân mức và chỉ rõ cái nào vào LAB-5 |
| 6 | `{feature}/screen-specification/` | Bảy màn cốt lõi theo biểu mẫu BM-2-901-51 |
| 7 | [`review-report.md`](review-report.md) | Kết quả review chéo bốn góc và những gì đã sửa |
| 8 | [`PENDING.md`](PENDING.md) | Việc còn tồn: sáu điểm chờ khách hoặc PM, và chín điểm đã xử lý |

Chỉ mục đầy đủ kèm số hiệu phiên bản từng tài liệu: [`_index.md`](_index.md).

---

## Cây thư mục

```
specs/
├── README.md  PREMISE.md  PENDING.md  AI-report.md  ai-log.md  review-report.md  _index.md
├── _templates/   6 biểu mẫu ISO của công ty, đặt chỉ-đọc     <- KE THUA
├── _common/      api-list.md · error-codes.md                <- KE THUA quy uoc
├── _tools/       4 bộ kiểm tự động + bộ sinh wireframe       <- TAO MOI
├── architecture/ architecture.md + ADR-001..006 + ADR-index  <- TAO MOI
├── database/     COLDCHAIN_DATABASE.md (BM-50) + gap-list.md
└── {feature}/    7 feature: receiving · inventory · outbound · routing
                             alarms · traceability · master
    ├── screen-specification/   SC4-0x_SPEC.md        (BM-51)
    ├── detail-design/          *_DETAIL.md           (BM-53)
    └── assets/                 wireframe png + svg + bảng item 4.1
        └── _prototype/         ảnh chụp hiện trạng LAB-2 để đối chiếu
```

114 file. Trong đó 7 screen spec, 4 detail design, 6 ADR, 14 ảnh wireframe.

---

## Phần nào kế thừa, phần nào tạo mới

Đây là câu trả lời cho yêu cầu của đề bài. Chi tiết từng dòng kèm lý do:
[`_template-list.md`](_template-list.md).

### Kế thừa từ bộ spec-standard của công ty

Sáu biểu mẫu ISO của **SUN ASTERISK VIETNAM CO., LTD** (ISO/IEC 27001:2013 & ISO 9001:2015), chép
nguyên văn từ Takumi Agent Kit vào [`_templates/`](_templates/), đặt **chỉ đọc**:

| Biểu mẫu | Tên | Dùng ở đâu |
|---|---|---|
| **BM-2-901-50 v01** | Database Design | [`database/COLDCHAIN_DATABASE.md`](database/COLDCHAIN_DATABASE.md) |
| **BM-2-901-51 v2.1** | Screen Specification | 7 màn cốt lõi |
| **BM-2-901-52 v01** | API Design | [`_common/api-list.md`](_common/api-list.md) |
| **BM-2-901-53 v01** | Detail Design | 4 xử lý nặng thuật toán: receiving · outbound · routing · alarms |
| **BM-2-901-54 v01** | Function Specifications | Tham chiếu |
| **BM-2-901-63** | Requirement Document | Tham chiếu — yêu cầu gốc đã có ở LAB-1 |

Quy ước của bộ chuẩn được giữ nguyên: History of change ba nơi phải khớp; screen spec **không tự
khai API mới** và **không tự chế mã thông báo mới**; ảnh thiết kế không vẽ bằng Excel.

### Tạo mới cho LAB-4

Bộ chuẩn **không có biểu mẫu** cho ba thứ đề bài đòi, nên phải tự định nghĩa format:

| Thứ | Format tự định nghĩa |
|---|---|
| **Wireframe** | Mỗi màn 3 file: `_layout.svg` (nguồn), `_layout.png`, `_annotated.png` (đánh số callout khớp **đúng** ID item ở mục 4.1) |
| **Architecture** | Thành phần · luồng dữ liệu · điểm tích hợp · **các điểm rẽ nhánh logic** |
| **ADR** | Trạng thái · Bối cảnh · Quyết định · **Phương án đã bỏ và lý do** · Hệ quả · Mã liên quan |

Cộng bốn file ở gốc là yêu cầu nộp bài, không thuộc bộ chuẩn: README, PREMISE, AI-report, ai-log.

---

## Quy ước mã

| Loại | Dạng | Nguồn |
|---|---|---|
| Màn hình | `SC4-01`…`SC4-07` | [`PREMISE.md`](PREMISE.md) mục 2 — tiền tố `SC4` chọn riêng để không đụng `SCR-01`…`SCR-33` của LAB-1 (xem `P-01` ở [`PENDING.md`](PENDING.md)) |
| Yêu cầu | `BR-xx` `FR-xx` `NFR-xx` `DR-xx` `IF-xx` `OPS-xx` `ACC-xx` | `docs/01_requirements-extract.md` — sổ đăng ký 88 mã của LAB-1 |
| Quyết định kiến trúc | `ADR-001`… | [`architecture/ADR-index.md`](architecture/ADR-index.md) |
| Chỗ prototype làm khác | `GAP-01`…`GAP-29` | [`database/gap-list.md`](database/gap-list.md) |
| API | `SER-01`…`SER-20` | [`_common/api-list.md`](_common/api-list.md) |
| Thông báo trên màn | `M_xx` | [`_common/error-codes.md`](_common/error-codes.md) |
| Lỗi nghiệp vụ ở tầng CSDL | `ORD01`–`06` · `SHP01` · `TMP01`–`02` · `ALM01`–`05` · `RC001` · `LS001`–`02` | `supabase/migrations/` |

---

## Bốn cổng kiểm tự động

Bộ specs này nối chéo nhau nhiều, và loại lỗi nguy hiểm nhất là loại **trông vẫn đẹp**. Bốn lệnh
sau chạy lại được bất cứ lúc nào:

```bash
node specs/_tools/check-req-codes.mjs    # mã yêu cầu có thật trong sổ 88 mã không
node specs/_tools/check-links.mjs        # link nội bộ còn sống không
node specs/_tools/check-mermaid.mjs      # sơ đồ đúng cú pháp không
npm run specs:check-schema               # tên bảng/cột có thật VÀ thuộc đúng bảng không
```

Mỗi cổng sinh ra từ một lỗi có thật đã bị bắt trong lúc làm bài, không phải dựng cho đủ hình thức:

| Cổng | Lỗi làm nó ra đời |
|---|---|
| `check-req-codes` | 6 mã yêu cầu bịa, trong đó 4 mã đã **in lên ảnh wireframe** |
| `check-links` | Link nội bộ gãy khi đổi tên file, không build nào bắt |
| `check-mermaid` | Sơ đồ sai cú pháp hiện ô báo lỗi đỏ giữa tài liệu |
| `specs:check-schema` | 7 tên cột bịa, cộng 1 cột có thật nhưng **gán nhầm bảng** |

**Nhưng bốn cổng này không bắt được lỗi nội dung.** Vòng review chéo tìm ra 12 lỗi mức Cao mà cả
bốn cổng đều báo xanh — gán sai luật cho mã lỗi, thu hẹp yêu cầu so với RFP, bỏ trống đường ra của
trạng thái. Chúng giữ cho tài liệu không sai hình thức; chuyện tài liệu có nói đúng nghiệp vụ hay
không thì vẫn phải có người đọc.

---

## Dựng lại wireframe

Ảnh và bảng item mục 4.1 **sinh từ cùng một nguồn** là [`_tools/screens.mjs`](_tools/screens.mjs),
nên số callout trên ảnh và mã `A-2` mà spec tham chiếu không thể lệch nhau. Sửa file đó rồi chạy:

```bash
node specs/_tools/render-wireframes.mjs   # sinh .svg và bảng item .md
node specs/_tools/svg-to-png.mjs          # xuất .png bằng Chrome
```

**Đừng sửa tay file `.svg` hay `_items.md`** — chúng bị ghi đè.

---

## Sáu bẫy nghiệp vụ

Mọi tài liệu trong bộ này đều phải đúng sáu điểm sau. Vòng review chéo xác nhận **cả sáu đều ĐẠT**,
không có lỗi mức Cao ở góc soát này.

| # | Bẫy | Đặc tả ở đâu |
|---|---|---|
| ① | Ngưỡng 3 dải nhiệt **do khách tự công bố**, có phiên bản, chọn theo **thời điểm đo**; đúng biên là ĐẠT | [`ADR-005`](architecture/ADR-005-versioned-temperature-policy.md) · SC4-01, 02, 05, 07 |
| ② | **賞味期限 ≠ 消費期限** — một cái cảnh báo, một cái chặn | [`ADR-002`](architecture/ADR-002-two-expiry-types.md) · SC4-02 |
| ③ | Quy tắc **1/3 – 1/2 là tập quán hợp đồng**, tính từ ngày sản xuất; chưa chốt thì **không đoán** | [`ADR-004`](architecture/ADR-004-delivery-window-rule-per-agreement.md) · SC4-03 |
| ④ | **日付逆転** so với lần giao gần nhất của **đúng cặp khách–SKU**; hạn bằng nhau thì cho qua | [`ADR-003`](architecture/ADR-003-date-reversal-at-table-level.md) · SC4-03 |
| ⑤ | Truy xuất pháp định **chỉ bắt buộc với gạo và thịt bò** | SC4-01, SC4-06 |
| ⑥ | **HACCP và giới hạn giờ lái là ràng buộc cứng**, không phải cảnh báo bỏ qua được — nhưng **chặn ở hai cổng khác nhau**: giờ lái chặn **công bố tuyến**, HACCP chặn **xác nhận nhập/xuất** và sinh hàng đợi hồ sơ không tự đóng. RFP không gắn HACCP với việc lập lịch; chỗ này là **điểm cần hỏi khách** (`P-10`) | [`ADR-006`](architecture/ADR-006-driver-hours-blocks-route-publish.md) · SC4-04 · SC4-05 |
