<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-01

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Tạo phiếu kiểm hàng nhập** | | | |
| 1.0 | Nhà cung cấp (仕入先) | Text box | Có | Lấy từ master `suppliers` |
| 2.0 | Tạo phiếu | Button | - | Người lập phiếu lấy từ phiên, không nhận từ client |
| **B** | **Danh sách phiếu gần đây** | | | |
| 1.0 | Bảng phiếu kiểm hàng nhập | Label | - | Bấm vào thời điểm để mở phiếu |
| **C** | **Dòng hàng — thông tin nhận từ nhãn** | | | |
| 1.0 | Mã hàng (SKU) | Text box | Có | Quyết định dải nhiệt và loại hạn áp dụng |
| 2.0 | Số lượng nhận | Text box | Có | > 0 |
| 3.0 | Số lượng giữ lại | Text box | Không | ≤ số lượng nhận; phần giữ lại vào cách ly |
| 4.0 | Ngày sản xuất (製造日) | Text box | Có | Mốc tính quy tắc 1/3 – 1/2 ở màn Đơn xuất |
| 5.0 | Hạn trên nhãn | Text box | Có | Kèm loại hạn ở C-6 — hai thứ này phải khớp SKU master |
| 6.0 | Loại hạn trên nhãn: 賞味期限 (ngon nhất) / 消費期限 (an toàn) | Text box | Có | Khác loại hạn khai trong SKU master thì CHẶN xác nhận, không cho ghi đè (BR-EXP-01) |
| 7.0 | Vị trí nhập kho | Text box | Có | Lệch dải nhiệt giữa SKU và vị trí thì chặn hẳn |
| 8.0 | Mã lô của nhà cung cấp | Text box | Không | Lưu vào `supplier_lot`, mang sang lô để truy xuất ngược |
| 9.0 | Số lượng từ chối | Text box | Không | Tổng nhận + từ chối + giữ lại phải bằng số khai báo |
| 10.0 | Lý do từ chối hoặc giữ lại | Text box | Không | Bắt buộc khi số lượng từ chối hoặc giữ lại lớn hơn 0 |
| 11.0 | Bao bì nguyên vẹn | Text box | Không | Kiểm cảm quan khi nhận hàng |
| 12.0 | Ảnh chụp khi nhận — **mô phỏng**, gõ tay | Text box | Không | Prototype chưa có camera; ô nhập tay thay cho ảnh thật |
| **D** | **Đo nhiệt độ khi nhận hàng** | | | |
| 1.0 | Nhiệt độ đo (測定温度) °C | Text box | Có | So với ngưỡng của dải nhiệt SKU |
| 2.0 | Thời điểm đo (測定時刻) | Text box | Có | Chọn phiên bản ngưỡng theo THỜI ĐIỂM ĐO, không theo lúc bấm xác nhận — để phiếu cũ không bị chấm lại khi ngưỡng đổi phiên bản |
| 3.0 | Ngoài ngưỡng — lô vào khu cách ly, không vào tồn khả dụng | Label | - | Hiện ngưỡng đang áp dụng kèm số hiệu phiên bản và ngày hiệu lực, không hiển thị con số cứng. Bẫy ①: ngưỡng do khách tự công bố, có phiên bản |
| **E** | **Trường truy xuất pháp định** | | | |
| 1.0 | Mã số cá thể bò (個体識別番号) | Text box | Có — CHỈ với thịt bò | Đúng 10 chữ số. Nhận 9 số thì CHẶN và nói rõ không tự đệm thêm số 0 (R-06) |
| 2.0 | Thông tin xuất xứ gạo (産地情報) | Text box | Có — CHỈ với gạo | BR-TRACE-01. Mặt hàng khác gạo thì ô này KHÔNG hiện |
| 3.0 | Mã giao dịch gạo | Text box | Có — CHỈ với gạo | BR-TRACE-01 đòi cả mã giao dịch, không chỉ xuất xứ. Thiếu là thiếu một nửa luồng truy xuất gạo |
| **F** | **Xác nhận dòng hàng** | | | |
| 1.0 | Xác nhận dòng | Button | - | Sinh lô; trạng thái lô do máy chủ suy ra, client không gửi lên |
| 2.0 | Lưu nháp | Button | - |  |
| 3.0 | Chặn xác nhận — nêu đúng trường sai | Label | - | Thiếu trường truy xuất, sai loại hạn, hoặc lệch dải nhiệt giữa SKU và vị trí. |
| 4.0 | Đã xác nhận → lô sinh ra | Label | - | Hai trục TÁCH BIỆT: nguồn lô (`source_kind` = nhận / giữ lại) và trạng thái (`status` = khả dụng / cách ly / đã huỷ). Đừng trộn |
