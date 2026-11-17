# ADR-004 — Quy tắc cửa sổ giao 1/3 – 1/2 là thuộc tính của hợp đồng, bỏ trống thì duyệt tay

| | |
|---|---|
| **Trạng thái** | Đã áp dụng |
| **Ngày** | 2026-11-16 |
| **Mã liên quan** | FR-OUT-02 · BR-FEFO-01 · Q5 (CHẶN BÁO GIÁ) |

## Bối cảnh

Trong ngành thực phẩm Nhật có tập quán **quy tắc 1/3** (3分の1ルール): người bán chỉ nhận hàng khi
hàng còn trong một phần nhất định của tuổi thọ, tính **từ ngày sản xuất** chứ không phải từ hôm nay.
Một số chuỗi dùng quy tắc 1/2 lỏng hơn; một số chỉ so hạn trên nhãn.

Điểm phải nắm cho đúng: **đây là tập quán thương mại giữa hai bên, không phải hạn dùng thật của
hàng.** Một lô còn hạn ba tháng vẫn có thể bị khách từ chối vì quá mốc 1/3. Hai khái niệm này
trông giống nhau trên màn hình — cùng là một ngày tháng — nhưng nguồn gốc và hệ quả khác hẳn.

Và quan trọng hơn: **không phải khách nào cũng dùng cùng một quy tắc.** Không có giá trị mặc định
đúng cho mọi khách.

## Quyết định

Quy tắc cửa sổ giao là một cột trên bảng **hợp đồng giao hàng**, khoá theo cặp (khách hàng, mã
hàng) và có ngày hiệu lực. Ba giá trị:

| Giá trị | Nghĩa |
|---|---|
| `ONE_THIRD` | Quy tắc 1/3 |
| `ONE_HALF` | Quy tắc 1/2 |
| `LABEL_DATE_ONLY` | Chỉ so hạn trên nhãn, không áp quy tắc tập quán |

**Cột này bỏ trống (`NULL`) thì đơn vào trạng thái chờ duyệt tay.** Hệ thống **không** suy ra giá
trị mặc định, không đoán, không lấy quy tắc của khách khác.

## Phương án đã bỏ và lý do

| Phương án | Vì sao bỏ |
|---|---|
| **Mặc định `ONE_THIRD` khi chưa khai** | Quy tắc 1/3 phổ biến nhưng không phải phổ quát. Đoán sai thì hệ thống âm thầm loại oan những lô hợp lệ, và không ai biết là nó đang đoán. Sai lặng lẽ tệ hơn dừng lại và hỏi |
| **Đặt quy tắc ở mức khách hàng thay vì cặp khách–mặt hàng** | Một khách có thể áp quy tắc khác nhau cho nhóm hàng khác nhau. Để ở mức khách là chặn mất khả năng đó ngay từ mô hình dữ liệu |
| **Để quy tắc trong cấu hình ứng dụng** | Quy tắc thay đổi theo từng lần ký lại hợp đồng và phải tra ngược được "lúc đó áp quy tắc nào". Cấu hình không có ngày hiệu lực, không truy vết được |
| **Tính cửa sổ giao từ ngày hôm nay** | Sai gốc. Quy tắc 1/3 tính **từ ngày sản xuất**. Tính từ hôm nay thì cùng một lô cho ra kết quả khác nhau mỗi ngày |
| **Gộp vào cùng trường với hạn dùng** | Chính là bẫy ③. Hạn dùng là thuộc tính của **hàng**, cửa sổ giao là thoả thuận với **khách**. Một lô giao cho khách này thì đạt, khách kia thì không |

## Hệ quả

**Được:** quy tắc truy vết được theo từng hợp đồng và từng giai đoạn hiệu lực. Khách đổi quy tắc
thì thêm một dòng hợp đồng mới, đơn cũ vẫn giải thích được vì sao hồi đó phán như vậy.

**Mất:** phải nhập đủ hợp đồng cho từng cặp khách–mặt hàng trước khi tạo đơn. Đổi lại, đơn không
có hợp đồng sẽ dừng lại chờ người xử lý thay vì chạy tiếp với một giả định ngầm.

**Hệ quả vận hành:** sẽ có một hàng đợi đơn chờ duyệt tay. Đó là **có chủ ý** — hàng đợi đó chính
là danh sách những hợp đồng cần đi hỏi khách.

**Còn treo — mục chặn báo giá:** công thức chính xác chưa được khách xác nhận. Hiện dùng
`ngày sản xuất + floor((hạn − ngày sản xuất) × tỷ lệ)`, tính theo ngày, lô đạt nếu ngày giao yêu
cầu không vượt mốc đó. Ba thứ chưa chắc: mốc bắt đầu tính, thời điểm phán định, và cách làm tròn.
Sai công thức là sai toàn bộ màn Đơn xuất → **phải hỏi khách trước khi báo giá**.
