<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-04

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Thông tin tuyến** | | | |
| 1.0 | Ngày chạy tuyến | Text box | Có | Quyết định phiên bản bộ quy tắc giờ lái được áp dụng |
| 2.0 | Tài xế | Text box | Có |  |
| 3.0 | Xe | Text box | Có | Dải nhiệt của xe phải phủ được dải nhiệt của hàng trên tuyến |
| 4.0 | Trạng thái tuyến: nháp / đã kiểm / đã công bố | Label | - |  |
| **B** | **Các đoạn thời gian trong ngày** | | | |
| 1.0 | Bảng đoạn | Label | - |  |
| 2.0 | Thêm đoạn | Button | - |  |
| **C** | **Kết quả kiểm giờ lái (改善基準告示)** | | | |
| 1.0 | Bảng kiểm từng ngưỡng | Label | - |  |
| 2.0 | Vi phạm lái liên tục — không công bố được tuyến | Label | - | Chèn một đoạn nghỉ đủ dài để cắt chuỗi lái liên tục, rồi kiểm lại. Bẫy ⑥: đây là ràng buộc cứng, không phải cảnh báo bỏ qua được |
| 3.0 | Kiểm lại giờ lái | Button | - | Máy chủ tự kiểm lại trong CSDL khi công bố, không tin kết quả client gửi lên |
| **D** | **Đơn gắn vào tuyến** | | | |
| 1.0 | Bảng đơn trên tuyến | Label | - |  |
| **E** | **Công bố tuyến** | | | |
| 1.0 | Công bố tuyến | Button | - | Khoá lại khi còn vi phạm giờ lái |
