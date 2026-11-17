# ADR-003 — So 日付逆転 với lịch sử giao của đúng cặp khách–SKU, kiểm ở hai thời điểm

| | |
|---|---|
| **Trạng thái** | Đã áp dụng |
| **Ngày** | 2026-11-16 |
| **Mã liên quan** | BR-DATE-01 · FR-OUT-02 · R-07 |

## Bối cảnh

Khách Nhật không chấp nhận nhận lô có hạn **sớm hơn** lô họ đã nhận lần trước. Lý do là vận hành
chứ không phải an toàn: hàng trên kệ của họ phải ra theo thứ tự hạn, nhận ngược là rối kho của khách.

Đây là luật dễ cài sai nhất trong cả hệ thống, vì câu "không được đảo ngày" nghe như thể so với
hôm nay. Ba cách hiểu sai, cách nào cũng tạo ra một hệ thống *chạy được* nhưng sai nghiệp vụ:

| Cách hiểu sai | Hậu quả |
|---|---|
| So hạn với **ngày hôm nay** | Chặn nhầm hàng còn tốt, bỏ lọt đúng trường hợp cần chặn |
| So với lần giao gần nhất **của bất kỳ khách nào** | Khách A bị chặn vì lịch sử của khách B |
| So với lần giao gần nhất **của bất kỳ mặt hàng nào** cho khách đó | Gạo bị chặn vì lịch sử giao thịt bò |

## Quyết định

Mốc so sánh là **hạn của lần giao gần nhất cho đúng cặp (khách hàng, mã hàng)** đó, đọc từ bảng
lịch sử giao. Hạn **bằng nhau thì cho phép**; chỉ chặn khi sớm hơn.

Luật được kiểm **hai lần, ở hai thời điểm khác nhau**, và đây là phần quan trọng:

| Thời điểm | Ở đâu | Làm gì |
|---|---|---|
| Lúc **phân bổ lô** | Hàm quy tắc thuần | Loại lô vi phạm và hiện rõ lý do cho người dùng |
| Lúc **xác nhận đã giao** | Trigger ở tầng bảng, mã lỗi `SHP01` | Huỷ cả giao dịch |

Kèm một **khoá theo cặp khách–SKU** trong trigger, giữ đến hết giao dịch.

## Phương án đã bỏ và lý do

| Phương án | Vì sao bỏ |
|---|---|
| **Chỉ kiểm lúc phân bổ** | Hai đơn cùng cặp khách–SKU phân bổ xong trước khi đơn nào kịp giao thì cả hai đều qua. Giao đơn hạn muộn trước rồi đơn hạn sớm sau là khách nhận hạn cũ hơn — đúng thứ luật sinh ra để chặn. Lỗ này đã **tìm thấy thật** ở LAB-2 và phải vá |
| **Kiểm ở tầng bảng nhưng không khoá theo cặp** | Hàm ghi giao hàng chỉ khoá đúng dòng đơn của nó. Hai **đơn khác nhau** của cùng khách và cùng mặt hàng giao đồng thời thì khoá hai dòng khác nhau, không chặn nhau; ở mức cô lập mặc định của Postgres, bên này không thấy dòng chưa commit của bên kia nên **cả hai cùng qua**. Đã chứng minh bằng hai giao dịch chạy song song thật, rồi vá bằng khoá tư vấn theo cặp |
| **Đổi toàn hệ thống sang mức cô lập `serializable`** | Bắt cả ứng dụng đổi mức cô lập chỉ vì một luật, và sinh lỗi serialization mà tầng trên phải tự thử lại. Khoá tư vấn gọn hơn và chỉ nằm trong phạm vi trigger |
| **Chặn cả khi hạn bằng nhau** | RFP viết "hạn cũ hơn". Bằng nhau không phải cũ hơn. Chặn thừa sẽ loại oan những lô hợp lệ |

## Hệ quả

**Được:** luật đúng ở mọi đường ghi và mọi mức đồng thời. Hai lần giao cho cùng một cặp khách–SKU
buộc phải nối đuôi nhau; hai cặp khác nhau vẫn chạy song song nên thông lượng giao hàng không đổi.

**Mất:** bảng lịch sử giao thành bảng nóng, mọi lần giao đều đọc nó. Cần chỉ mục trên
`(khách, mã hàng, thời điểm giao)` — đã có.

**Việc phải làm theo:** bảng lịch sử giao là **chỉ ghi thêm**. Sửa hay xoá một dòng trong đó là
sửa mốc so sánh của mọi lần giao sau, nên trigger chặn cả `update` lẫn `delete`.

**Còn treo:** chuyến trước giao nhiều lô nhiều hạn khác nhau thì lấy hạn **nhỏ nhất** hay **lớn
nhất** làm mốc. Hiện lấy nhỏ nhất. RFP chỉ nói "so với lô đã giao trước đó" → **cần hỏi khách**.
