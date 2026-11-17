<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-03

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Tạo đơn xuất** | | | |
| 1.0 | Khách hàng (得意先) | Text box | Có | Quyết định hợp đồng và lịch sử giao dùng để so 日付逆転 |
| 2.0 | Mã hàng (SKU) | Text box | Có | Một đơn một SKU |
| 3.0 | Số lượng | Text box | Có | Không phân bổ một phần: thiếu hàng thì báo thiếu, đơn giữ nguyên |
| 4.0 | Ngày giao yêu cầu (納品希望日) | Text box | Có |  |
| 5.0 | Tạo đơn và phân bổ lô | Button | - |  |
| **B** | **Hợp đồng áp dụng** | | | |
| 1.0 | Hợp đồng của cặp khách–SKU | Label | - |  |
| 2.0 | Hợp đồng chưa chốt quy tắc cửa sổ giao → đơn vào trạng thái chờ duyệt tay | Label | - | Hệ thống KHÔNG tự suy ra quy tắc 1/3. Bẫy ③: đây là tập quán hợp đồng, không phải hạn dùng thật của hàng. |
| **C** | **Kết quả phân bổ lô** | | | |
| 1.0 | Lô được chọn | Label | - |  |
| 2.0 | Trạng thái đơn: đã phân bổ / chờ duyệt tay / thiếu hàng | Label | - | Trạng thái do máy chủ suy ra từ dữ liệu, client không gửi lên được |
| **D** | **Vì sao các lô khác bị loại — bảng giải trình** | | | |
| 1.0 | Bảng lô bị loại theo từng bước | Label | - |  |
| **E** | **Xác nhận giao hàng** | | | |
| 1.0 | Tên người nhận | Text box | Có |  |
| 2.0 | Bằng chứng giao hàng (POD) — mô phỏng, gõ tay | Text box | Có | Prototype chưa có chữ ký số hay ảnh thật |
| 3.0 | Xác nhận đã giao | Button | - | Ghi vào lịch sử giao. Luật 日付逆転 kiểm LẠI ở tầng bảng tại đây, không chỉ lúc phân bổ (mã lỗi SHP01) |
