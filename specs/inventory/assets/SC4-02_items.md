<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-02

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Bộ lọc** | | | |
| 1.0 | Dải nhiệt: Thường (常温) / Mát (冷蔵) / Đông (冷凍) | Text box | Không |  |
| 2.0 | Trạng thái lô | Text box | Không | Đúng ba giá trị: khả dụng · cách ly · đã huỷ. “Đã giữ” KHÔNG phải trạng thái mà là nguồn lô (`source_kind`), lọc riêng |
| 3.0 | Tìm theo mã hàng hoặc mã lô | Text box | Không |  |
| **B** | **Tổng quan 3 dải nhiệt** | | | |
| 1.0 | Tồn theo dải nhiệt | Label | - | Ngưỡng đọc từ phiên bản hiệu lực, KHÔNG hard-code (bẫy ①) |
| **C** | **Danh sách lô** | | | |
| 1.0 | Bảng lô | Label | - |  |
| **D** | **Thao tác của QA trên lô cách ly** | | | |
| 1.0 | Giải phóng lô | Button | - | Chỉ qa_haccp. Chuyển cách ly → khả dụng |
| 2.0 | Huỷ lô | Button | - | Chỉ qa_haccp. Không quay lại được |
| 3.0 | Lý do (bắt buộc, vào sổ chỉ-ghi-thêm) | Text box | Có | Ghi vào `lot_status_events`, bảng chỉ-ghi-thêm, trigger chặn sửa và xoá |
| 4.0 | Chuyển lô sang cách ly (隔離) | Button | - | Chỉ qa_haccp. Dùng khi cảnh báo nhiệt chỉ ra lô nằm trong vùng ảnh hưởng — hệ thống chưa tự cách ly, xem GAP-02 |
