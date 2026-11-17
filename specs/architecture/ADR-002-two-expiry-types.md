# ADR-002 — Tách hai loại hạn 賞味期限 và 消費期限 thành hai nhánh xử lý

| | |
|---|---|
| **Trạng thái** | Đã áp dụng |
| **Ngày** | 2026-11-16 |
| **Mã liên quan** | BR-EXP-01 · BR-EXP-02 · FR-REC-03 · FR-OUT-02 |

## Bối cảnh

Thực phẩm Nhật có hai loại hạn, và luật thực phẩm đối xử với chúng khác hẳn nhau:

| Loại hạn | Nghĩa | Quá hạn thì sao |
|---|---|---|
| **賞味期限** (hạn ngon nhất) | Mốc giữ được chất lượng tốt nhất | Vẫn ăn được, chất lượng giảm |
| **消費期限** (hạn tiêu thụ an toàn) | Mốc an toàn thực phẩm | **Không được bán, không được giao** |

Mô hình dữ liệu ban đầu chỉ có một cột `expiry_date`. Cách đó gọn, và phần lớn màn hình trông
giống nhau — nên rất dễ đi theo. Nhưng nó gộp hai khái niệm có hệ quả pháp lý khác nhau thành một.

Một hệ thống gộp hai loại hạn sẽ hoặc chặn quá tay (chặn luôn hàng 賞味期限 còn bán được, gây lãng
phí), hoặc buông quá tay (cho giao hàng 消費期限 đã quá hạn, là vi phạm an toàn thực phẩm).

## Quyết định

Mã hàng mang một trường `expiry_type` nhận một trong hai giá trị, và nó quyết định **nhánh xử lý**
chứ không chỉ là nhãn hiển thị:

| Nơi | 消費期限 | 賞味期限 |
|---|---|---|
| Phân bổ lô | **Chặn cứng** khi chạm hạn | Vẫn phân bổ được |
| Màn tồn kho | Nhãn đỏ, ghi rõ chặn phân bổ | Nhãn vàng cảnh báo, kèm số ngày còn lại |
| Kiểm hàng nhập | Loại hạn trên nhãn khác loại hạn trong master thì **chặn xác nhận** | Như trên |

Loại hạn khai ở mã hàng là nguồn sự thật. Nhân viên kho **không được ghi đè** khi nhãn thực tế
khác — hệ thống chặn và yêu cầu kiểm lại, vì lệch ở đây thường là nhận nhầm hàng.

## Phương án đã bỏ và lý do

| Phương án | Vì sao bỏ |
|---|---|
| **Một cột `expiry_date`, loại hạn chỉ là nhãn hiển thị** | Luật phân bổ không đọc được nhãn hiển thị. Gộp lại thì hoặc chặn thừa hoặc buông lọt, không có cách nào đúng cả hai |
| **Hai cột riêng `best_before` và `use_by`, lô nào có gì thì điền nấy** | Một mặt hàng chỉ mang một loại hạn, nên một cột luôn rỗng. Cột rỗng mời gọi lỗi: code sẽ phải đoán "rỗng nghĩa là không áp dụng" hay "rỗng nghĩa là chưa nhập" |
| **Suy ra loại hạn từ dải nhiệt** (đông lạnh thì 賞味期限, mát thì 消費期限) | Sai. Cả hai loại hạn đều xuất hiện ở cả ba dải nhiệt. Đây là suy diễn bằng kiến thức phổ thông, đúng thứ mà hồ sơ chào khách Nhật không được phép làm |
| **Cho nhân viên kho ghi đè khi nhãn khác master** | Lệch giữa nhãn và master thường là dấu hiệu nhận nhầm hàng. Cho ghi đè là biến một cảnh báo hữu ích thành một nút bấm cho qua |

## Hệ quả

**Được:** luật an toàn thực phẩm thể hiện đúng ở tầng dữ liệu. Nhìn vào mã hàng là biết lô đó được
xử lý theo nhánh nào, không phải đọc code mới biết.

**Mất:** mọi màn chạm tới hạn dùng đều phải hiển thị kèm loại hạn, không được chỉ hiện ngày. Dài
dòng hơn, nhưng đó chính là thông tin người dùng cần để quyết định.

**Còn treo:** ngưỡng số ngày cảnh báo trước cho 賞味期限 chưa có trong RFP. Hiện chỉ hiện số ngày
còn lại, không đặt ngưỡng cứng; cột `best_before_warning_days` trên mã hàng để trống chờ khách trả lời.
