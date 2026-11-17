<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-05

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Đánh giá lại chuỗi reading** | | | |
| 1.0 | Đánh giá reading | Button | - | Chỉ qa_haccp. Quét reading trong cửa sổ thời gian, gom đoạn vượt ngưỡng liên tiếp thành cảnh báo |
| **B** | **Hàng đợi cảnh báo** | | | |
| 1.0 | Bảng cảnh báo | Label | - |  |
| 2.0 | SLA xác nhận 15 phút — quá hạn thì tô đỏ | Label | - | 15 phút là giả định lấy từ baseline của RFP, CẦN XÁC NHẬN với khách |
| **C** | **Chi tiết cảnh báo** | | | |
| 1.0 | Số liệu bằng chứng: đỉnh nhiệt, thời điểm bắt đầu và kết thúc, thời lượng | Label | - | Máy tính ra, người dùng KHÔNG sửa được (mã lỗi ALM02) |
| 2.0 | Lô nằm trong vùng ảnh hưởng | Label | - |  |
| **D** | **Ghi xử lý và đóng cảnh báo** | | | |
| 1.0 | Nội dung xử lý | Text box | Có | Bắt buộc. Đóng mà bỏ trống thì bị chặn ở tầng bảng (mã lỗi ALM03) |
| 2.0 | Đóng cảnh báo | Button | - | Người xử lý và thời điểm do máy chủ ghi, client không gửi lên. Cảnh báo đã đóng là bất biến (ALM01) |
