# ADR-005 — Ngưỡng 3 dải nhiệt là dữ liệu có phiên bản, chọn theo thời điểm đo

| | |
|---|---|
| **Trạng thái** | Đã áp dụng |
| **Ngày** | 2026-11-16 |
| **Mã liên quan** | BR-TEMP-01 · BR-TEMP-02 · FR-REC-02 · FR-TEMP-02 · BR-HACCP-01 |

## Bối cảnh

"Ba dải nhiệt" (三温度帯) nghe như một chuẩn ngành có sẵn con số. Thực tế **mỗi công ty tự công bố
ngưỡng của mình**, và đó là một phần hồ sơ HACCP của họ. Ngưỡng của Yuki hiện là
`常温 15,0–25,0 °C` · `冷蔵 0,0–5,0 °C` · `冷凍 ≤ −18,0 °C` — công ty khác công bố khác.

Điều này đẻ ra một ràng buộc mà hệ thống quản lý kho thường bỏ sót: **ngưỡng thay đổi theo thời
gian, và hồ sơ cũ phải giữ nguyên cách chấm ban đầu.** Một phiếu nhập năm ngoái được chấm "đạt"
theo ngưỡng năm ngoái thì năm nay vẫn phải là "đạt", kể cả khi ngưỡng đã siết lại. Nếu không, mỗi
lần đổi chính sách là toàn bộ hồ sơ HACCP quá khứ tự đổi kết luận — không cơ quan kiểm tra nào
chấp nhận chuyện đó.

## Quyết định

Ngưỡng nằm trong một bảng **chính sách nhiệt có phiên bản**, mỗi dòng mang số hiệu phiên bản và
ngày bắt đầu hiệu lực. Ba quy tắc đi kèm:

1. **Chọn phiên bản theo thời điểm ĐO**, không theo thời điểm bấm xác nhận. Phiếu nhập mang một
   trường thời điểm đo riêng, tách khỏi thời điểm tạo bản ghi.
2. **Phiên bản cũ là bất biến.** Không sửa, không xoá. Đổi ngưỡng nghĩa là thêm phiên bản mới.
3. **Không tạo được phiên bản hồi tố** — ngày hiệu lực phải **sau hôm nay**, sớm nhất là ngày mai
   (mã lỗi `TMP01`). Tầng biên API hiện còn cho qua ngày hôm nay rồi tầng bảng mới chặn — lệch một ngày, xem `GAP-15`, và ngưỡng dưới không được lớn hơn ngưỡng trên (`TMP02`).

Giá trị **đúng biên là đạt**: đo được đúng 5,0 °C ở kho mát thì không sinh cảnh báo.

Màn hình **không bao giờ in con số ngưỡng rời**; luôn kèm số hiệu phiên bản và ngày hiệu lực.

## Phương án đã bỏ và lý do

| Phương án | Vì sao bỏ |
|---|---|
| **Để ngưỡng là hằng số trong mã nguồn** | Ngưỡng là dữ liệu của khách. Đưa vào mã nguồn nghĩa là mỗi lần khách đổi chính sách phải phát hành lại phần mềm, và không ai tra ngược được lúc đó áp ngưỡng nào |
| **Ngưỡng là một dòng duy nhất, sửa tại chỗ** | Sửa tại chỗ thì hồ sơ HACCP cũ tự đổi kết luận. Đây là lỗi nặng nhất có thể mắc với tài liệu kiểm tra an toàn thực phẩm |
| **Chọn phiên bản theo lúc bấm xác nhận** | Nhân viên đo lúc 8 giờ sáng, xác nhận lúc 5 giờ chiều; nếu giữa hai mốc đó có phiên bản mới thì phiếu bị chấm theo ngưỡng chưa có hiệu lực lúc đo. Rất khó phát hiện vì chỉ xảy ra đúng ngày đổi ngưỡng |
| **Coi giá trị đúng biên là vi phạm** | Ngưỡng công bố `0,0–5,0` nghĩa là **bao gồm** hai đầu. Chặn ở đúng 5,0 là loại oan hàng đạt |
| **Lấy ngưỡng từ cấu hình môi trường** | Không có ngày hiệu lực, không truy vết được, và không hiện ra được cho người dùng thấy |

## Hệ quả

**Được:** đổi chính sách nhiệt là thao tác dữ liệu, không phải thao tác phát hành phần mềm. Hồ sơ
cũ giữ nguyên kết luận. Mọi kết quả chấm đều chỉ ra được đã dùng phiên bản nào.

**Mất:** mọi chỗ đọc ngưỡng phải mang theo một mốc thời gian để tra phiên bản. Phức tạp hơn so với
đọc một hằng số, nhưng đây chính là cái giá của việc hồ sơ truy vết được.

**Việc phải làm theo:** phiếu nhập **bắt buộc** có trường thời điểm đo. Thiếu nó là không chọn
được phiên bản ngưỡng, và cả cơ chế này sụp.

**Còn treo:** trường thời điểm đo hiện do người dùng nhập và sửa được khi phiếu còn nháp. Một
người cố tình lùi thời điểm đo về trước ngày siết ngưỡng sẽ được chấm theo ngưỡng cũ lỏng hơn.
Hiện chưa khai thác được vì CSDL mới có phiên bản 1 cho cả ba dải, nhưng lỗ hổng là **cấu trúc**
và sẽ mở ra ngay khi có phiên bản 2 → ghi nhận ở [`gap-list.md`](../database/gap-list.md).
