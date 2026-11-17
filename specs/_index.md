# Chỉ mục bộ specs — Product B, hệ thống kho lạnh 3 dải nhiệt

Mỗi tài liệu viết theo biểu mẫu có một dòng ở đây. Ba nơi phải khớp nhau, không được lệch:
`version` / `updated` ở frontmatter của file · dòng cuối bảng **History of change** trong file ·
dòng tương ứng ở bảng này.

Cột `Approve` để trống nghĩa là **khách hàng chưa duyệt** phiên bản đó. Chỉ khách hàng điền cột
này; nội bộ duyệt PR không được điền.

## Screen Specification — biểu mẫu BM-2-901-51 v2.1

| Screen ID | Tên màn | Feature | File | Version | Updated | Approve |
|---|---|---|---|---|---|---|
| SC4-01 | Kiểm hàng nhập (入荷検品) | receiving | [`receiving/screen-specification/SC4-01_SPEC.md`](receiving/screen-specification/SC4-01_SPEC.md) | 0.2.0 | 2026-11-16 | |
| SC4-02 | Tồn kho 3 dải nhiệt (三温度帯) | inventory | [`inventory/screen-specification/SC4-02_SPEC.md`](inventory/screen-specification/SC4-02_SPEC.md) | 0.2.0 | 2026-11-16 | |
| SC4-03 | Đơn xuất và phân bổ lô (出荷指示) | outbound | [`outbound/screen-specification/SC4-03_SPEC.md`](outbound/screen-specification/SC4-03_SPEC.md) | 0.2.0 | 2026-11-16 | |
| SC4-04 | Lập tuyến giao (配送計画) | routing | [`routing/screen-specification/SC4-04_SPEC.md`](routing/screen-specification/SC4-04_SPEC.md) | 0.2.0 | 2026-11-16 | |
| SC4-05 | Cảnh báo nhiệt độ (温度逸脱) | alarms | [`alarms/screen-specification/SC4-05_SPEC.md`](alarms/screen-specification/SC4-05_SPEC.md) | 0.2.0 | 2026-11-16 | |
| SC4-06 | Truy xuất nguồn gốc (トレーサビリティ) | traceability | [`traceability/screen-specification/SC4-06_SPEC.md`](traceability/screen-specification/SC4-06_SPEC.md) | 0.2.0 | 2026-11-16 | |
| SC4-07 | Master và ngưỡng nhiệt (マスタ・温度基準) | master | [`master/screen-specification/SC4-07_SPEC.md`](master/screen-specification/SC4-07_SPEC.md) | 0.2.0 | 2026-11-16 | |

## Detail Design — biểu mẫu BM-2-901-53 v01

| ID | Nội dung | Feature | File | Version | Updated | Approve |
|---|---|---|---|---|---|---|
| DD-RCV-001 | Xác nhận dòng phiếu nhập — ngưỡng nhiệt theo thời điểm đo, hai loại hạn, truy xuất gạo/bò | receiving | [`receiving/detail-design/RCV_RECEIPT_CONFIRM_DETAIL.md`](receiving/detail-design/RCV_RECEIPT_CONFIRM_DETAIL.md) | 0.1.0 | 2026-11-16 | |
| DD-OUT-001 | Phân bổ lô cho đơn xuất — sáu phép loại, chống đua | outbound | [`outbound/detail-design/OUT_ALLOCATION_DETAIL.md`](outbound/detail-design/OUT_ALLOCATION_DETAIL.md) | 0.1.0 | 2026-11-16 | |
| DD-RTE-001 | Kiểm ràng buộc và công bố tuyến — giờ lái là ràng buộc cứng | routing | [`routing/detail-design/RTE_ROUTE_PUBLISH_DETAIL.md`](routing/detail-design/RTE_ROUTE_PUBLISH_DETAIL.md) | 0.1.0 | 2026-11-16 | |
| DD-ALM-001 | Đánh giá vượt ngưỡng nhiệt và sinh cảnh báo — bất biến hồ sơ HACCP | alarms | [`alarms/detail-design/ALM_EXCURSION_EVAL_DETAIL.md`](alarms/detail-design/ALM_EXCURSION_EVAL_DETAIL.md) | 0.1.0 | 2026-11-16 | |

## Database Design — biểu mẫu BM-2-901-50 v01

| ID | Nội dung | File | Version | Updated | Approve |
|---|---|---|---|---|---|
| DB-001 | 23 bảng đã dựng + 1 bảng thiết kế; 13 bảng viết đầy đủ | [`database/COLDCHAIN_DATABASE.md`](database/COLDCHAIN_DATABASE.md) | 0.1.0 | 2026-11-16 | |

## Danh mục dùng chung

| Nội dung | File | Ghi chú |
|---|---|---|
| Danh mục API | [`_common/api-list.md`](_common/api-list.md) | 20 API, mã `SER-xx`. Screen spec **không tự khai API mới** |
| Danh mục mã thông báo | [`_common/error-codes.md`](_common/error-codes.md) | 30 mã `M_xx` + mã lỗi nghiệp vụ ở tầng CSDL. Screen spec **không tự chế mã mới** |

## Tài liệu tạo mới cho LAB-4 — ngoài bộ chuẩn

Bộ spec-standard không có biểu mẫu cho ba thứ này, xem [`_template-list.md`](_template-list.md).

| ID | Nội dung | File | Version | Updated |
|---|---|---|---|---|
| ARC-001 | Kiến trúc hệ thống, luồng dữ liệu, điểm rẽ nhánh logic | [`architecture/architecture.md`](architecture/architecture.md) | 0.1.0 | 2026-11-16 |
| ADR-001…006 | 6 quyết định kiến trúc | [`architecture/ADR-index.md`](architecture/ADR-index.md) | 0.1.0 | 2026-11-16 |
| — | Sổ gap: chỗ prototype làm khác thiết kế | [`database/gap-list.md`](database/gap-list.md) | 0.1.0 | 2026-11-16 |
| — | Wireframe 7 màn (ảnh + bảng item 4.1) | `{feature}/assets/` | — | 2026-11-16 |

## Màn KHÔNG viết spec chi tiết ở LAB-4

Đề bài đòi screen spec cho "các màn hình cốt lõi". Bảy màn ở trên được chọn theo tiêu chí **phủ đủ
6 bẫy nghiệp vụ** (xem [`PREMISE.md`](PREMISE.md) mục 2). Các màn còn lại của LAB-2:

| Màn | Vì sao chưa viết spec chi tiết |
|---|---|
| Dashboard KPI | Chỉ tổng hợp số từ các màn khác, không mang luật nghiệp vụ riêng |
| Lịch sử giao | Màn chỉ đọc, dữ liệu đã đặc tả ở bảng `shipment_history` trong BM-50 |
| Dữ liệu cảm biến | Nguồn dữ liệu là **mô phỏng**; luật đánh giá đã đặc tả ở SC4-05 |
| Chi tiết phiếu nhập / đơn / tuyến | Là trang con của SC4-01 / SC4-03 / SC4-04, dùng chung item và luật của màn cha |
| Đăng nhập, Không có quyền | Không mang luật nghiệp vụ; hành vi phân quyền đã đặc tả ở `architecture.md` mục 1 |

Những màn này vẫn nằm trong phạm vi sản phẩm; chúng chỉ chưa tới lượt viết spec chi tiết ở LAB-4.
