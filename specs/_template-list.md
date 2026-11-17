# Biểu mẫu dùng trong bộ specs này — kế thừa và tạo mới

Trả lời câu hỏi của đề bài LAB-4: *file nào, template nào kế thừa từ bộ spec-standard của công ty;
file nào, template nào là mới tạo thêm theo yêu cầu đề bài.*

---

## (a) KẾ THỪA từ bộ spec-standard của công ty

Sáu biểu mẫu ISO của **SUN ASTERISK VIETNAM CO., LTD** (ISO/IEC 27001:2013 & ISO 9001:2015), chép
nguyên văn vào [`_templates/`](_templates/) và đặt chế độ **chỉ đọc** (`chmod 444`) để không ai sửa
nhầm bản gốc.

Nguồn: bộ `spec-standards` đóng gói trong Takumi Agent Kit, bản pin
`9cd03bc738bbdd00c935623488e32faa27bee6ba`, thư mục `01-outputs/01-templates/`.

| Biểu mẫu | Tên đầy đủ | File trong repo | Bài này dùng vào đâu |
|---|---|---|---|
| **BM-2-901-50 v01** | Database Design | [`_templates/BM-2-901-50-database-design-template.md`](_templates/BM-2-901-50-database-design-template.md) | `database/` — mô hình dữ liệu 23 bảng, đối chiếu với bảng đã tạo thật ở LAB-2 |
| **BM-2-901-51 v2.1** | Screen Specification | [`_templates/BM-2-901-51-screen-specification-template.md`](_templates/BM-2-901-51-screen-specification-template.md) | `{feature}/screen-specification/` — 7 màn cốt lõi |
| **BM-2-901-52 v01** | API Design | [`_templates/BM-2-901-52-api-design-template.md`](_templates/BM-2-901-52-api-design-template.md) | `_common/api-list.md` và API của từng màn |
| **BM-2-901-53 v01** | Detail Design (Chart + Description) | [`_templates/BM-2-901-53-detail-design-template.md`](_templates/BM-2-901-53-detail-design-template.md) | `{feature}/detail-design/` — logic nghiệp vụ đằng sau màn |
| **BM-2-901-54 v01** | Function Specifications | [`_templates/BM-2-901-54-function-specifications-template.md`](_templates/BM-2-901-54-function-specifications-template.md) | Danh mục chức năng, nối FR của LAB-1 với màn |
| **BM-2-901-63** | Requirement Document | [`_templates/BM-2-901-63-requirement-document-template.md`](_templates/BM-2-901-63-requirement-document-template.md) | Tham chiếu — yêu cầu gốc đã có ở LAB-1 (`docs/01_requirements-extract.md`), không dựng lại |

**Những quy ước của bộ chuẩn được giữ nguyên, không chế lại:**

- Mục **History of change** trong mỗi file: version theo SemVer, cột `Approve` để trống vì khách
  chưa duyệt. Ba nơi phải khớp nhau: `version`/`updated` ở frontmatter, dòng cuối bảng History, và
  dòng tương ứng trong [`_index.md`](_index.md).
- Mã API và mã thông báo lỗi tra ở [`_common/`](_common/) — **screen spec không được tự khai API mới
  hay tự chế mã lỗi mới** trong file của nó.
- Ảnh thiết kế đặt trong `{feature}/assets/`, tên có tiền tố Screen ID, nhúng bằng đường dẫn tương
  đối. Biểu mẫu cấm vẽ màn hình bằng Excel hay Spreadsheet.
- Đánh ID item trong màn: section là chữ (`A`, `B`, `C`…), item trong section là số (`1.0`, `2.0`…),
  tham chiếu chéo bằng `{section}-{số}` — ví dụ `A-2`.

---

## (b) TẠO MỚI cho LAB-4

Đề bài đòi ba thứ mà **bộ spec-standard không có biểu mẫu**, nên phải tự định nghĩa format. Đây là
phần tự chế, và ghi rõ ra đây để người đọc phân biệt được với phần kế thừa.

| Thứ cần làm | Vì sao không kế thừa được | Format tự định nghĩa |
|---|---|---|
| **Wireframe** | Bộ chuẩn chỉ nói screen spec phải *có ảnh* trong `{feature}/assets/` và cấm vẽ bằng Excel — nhưng không quy định bản thân wireframe trình bày thế nào | Mỗi màn 3 file: `SC4-xx_layout.svg` (nguồn, sửa và diff được trong git), `SC4-xx_layout.png` (bản trơn), `SC4-xx_annotated.png` (đánh số callout khớp **đúng** ID item ở mục 4.1 của screen spec). Ảnh chụp hiện trạng prototype để trong `assets/_prototype/` |
| **Architecture design** | Bộ chuẩn dừng ở mức Detail Design cho từng chức năng, không có biểu mẫu cho kiến trúc toàn hệ thống | [`architecture/architecture.md`](architecture/architecture.md): thành phần hệ thống · luồng dữ liệu chính · điểm tích hợp (nêu rõ đang mock hay làm thật) · **các điểm rẽ nhánh logic** — mục cuối là yêu cầu riêng của đề bài, không được đơn giản hóa thành luồng tuyến tính |
| **ADR** (Architecture Decision Record) | Không có trong bộ chuẩn | `architecture/ADR-00x-{tên}.md` theo format ADR phổ biến, tối thiểu: Trạng thái · Bối cảnh · Quyết định · **Phương án đã bỏ và lý do** · Hệ quả · Mã BR/FR liên quan. Có [`architecture/ADR-index.md`](architecture/ADR-index.md) liệt kê tất cả |

Ngoài ra, bốn file ở gốc `specs/` là **yêu cầu nộp bài của LAB-4**, không thuộc bộ chuẩn:
[`README.md`](README.md), [`PREMISE.md`](PREMISE.md), [`AI-report.md`](AI-report.md) và
[`ai-log.md`](ai-log.md) (nhật ký làm bài, là đầu vào để viết AI-report).

---

## Một quyết định cần nói rõ: vì sao không chạy bộ skill `up-create-*`

Takumi kit có sẵn bộ skill chuyên dụng để viết theo từng biểu mẫu (`up-create-screen-spec`,
`up-create-database-design`, `up-create-api-design`, `up-create-detail-design`,
`up-create-function-spec`). Bài này **chỉ chạy `up-create-database-design`** ở Bước 5, còn lại dùng
biểu mẫu kèm `/tkm:manage-docs`.

Lý do: các skill đó gắn với quy trình RMP/PEC thật của công ty — đòi có Story issue trên GitHub,
nhánh `ver/*`, PR review và một vòng independent audit do người khác chạy. Trong bài lab một người
làm, chạy đủ bộ đó sẽ tốn phần lớn thời gian vào thủ tục quy trình thay vì vào nội dung thiết kế.
Dùng **biểu mẫu** của chúng vẫn đạt yêu cầu "theo format chuẩn của bộ spec-standard" mà đề bài đặt ra.
