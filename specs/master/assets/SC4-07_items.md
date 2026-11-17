<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-07

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Chọn nhóm dữ liệu** | | | |
| 1.0 | Nhóm: Mã hàng / Khách hàng / Nhà cung cấp / Vị trí / Hợp đồng giao / Ngưỡng nhiệt | Text box | Có |  |
| **B** | **Ngưỡng nhiệt 3 dải — các phiên bản** | | | |
| 1.0 | Bảng phiên bản ngưỡng | Label | - |  |
| **C** | **Tạo phiên bản ngưỡng mới** | | | |
| 1.0 | Dải nhiệt áp dụng | Text box | Có |  |
| 2.0 | Ngưỡng dưới °C | Text box | Không | Để trống nghĩa là không giới hạn dưới |
| 3.0 | Ngưỡng trên °C | Text box | Không | Ngưỡng dưới lớn hơn ngưỡng trên thì bị chặn (mã lỗi TMP02) |
| 4.0 | Hiệu lực từ | Text box | Có | Không được đặt ngày trong quá khứ — chặn hồi tố (mã lỗi TMP01) |
| 5.0 | Tạo phiên bản | Button | - | Chỉ qa_haccp. Số hiệu phiên bản và người tạo do máy chủ cấp, client không gửi lên |
| 6.0 | Chỉ vai QA / HACCP tạo được phiên bản ngưỡng | Label | - | Vai Quản trị xem được màn này nhưng không tạo được phiên bản — phân tách nhiệm vụ có chủ ý. |
| **D** | **Danh mục master dùng chung** | | | |
| 1.0 | Bảng bản ghi master | Label | - |  |
| 2.0 | Thêm bản ghi | Button | - | Chỉ admin |
