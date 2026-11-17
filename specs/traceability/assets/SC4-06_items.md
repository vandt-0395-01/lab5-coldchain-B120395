<!-- SINH TỰ ĐỘNG từ specs/_tools/screens.mjs — đừng sửa tay, sửa file đó rồi chạy lại -->

### 4.1 Danh sách item — SC4-06

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Tra cứu** | | | |
| 1.0 | Tra theo khoá | Text box | Có | Bảy loại prototype có: mã lô, số lô NCC, mã cá thể bò, xuất xứ gạo, mã giao dịch gạo, mã khách, mã đơn. FR-TRC-01 còn đòi mã hàng và nhà cung cấp — hai khoá này prototype THIẾU, xem GAP-21 |
| 2.0 | Giá trị cần tra | Text box | Có |  |
| 3.0 | Tra cứu | Button | - |  |
| **B** | **Chuỗi truy xuất — ngược về nguồn** | | | |
| 1.0 | Bảng chuỗi | Label | - |  |
| **C** | **Trường truy xuất pháp định** | | | |
| 1.0 | Mặt hàng này thuộc diện bắt buộc truy xuất | Label | - | Chỉ hiện với gạo và thịt bò. Mặt hàng khác thì khối này ẩn và ghi rõ là khuyến khích, không bắt buộc. Bẫy ⑤: đừng áp nhầm quy định bắt buộc cho toàn bộ mặt hàng |
| 2.0 | Mã số cá thể bò (個体識別番号): đúng 10 chữ số | Label | - |  |
| 3.0 | Thông tin xuất xứ gạo (産地情報) | Label | - |  |
