# ADR-001 — Đặt bất biến nghiệp vụ ở tầng bảng, không chỉ ở tầng API

| | |
|---|---|
| **Trạng thái** | Đã áp dụng |
| **Ngày** | 2026-11-16 |
| **Mã liên quan** | BR-DATE-01 · BR-TEMP-01 · BR-EXP-01/02 · BR-HACCP-01 |

## Bối cảnh

Hệ thống có bốn vai, mỗi vai có tài khoản thật và JWT hợp lệ. Supabase để lộ PostgREST ra ngoài:
bất kỳ ai có JWT đều gọi thẳng được vào CSDL, không bắt buộc phải đi qua ứng dụng Next.js.

Thiết kế ban đầu đặt toàn bộ luật nghiệp vụ ở tầng API route: kiểm vai, kiểm quy tắc, rồi ghi.
Cách này đọc rất hợp lý và bốn cổng kiểm tự động (typecheck, lint, 722 unit test, build) đều xanh.

Rồi vòng audit bảo mật tìm ra hai lỗ hổng mức Cao, **cả hai cùng một dạng**: luật có thật, nằm
đúng chỗ, nhưng chỉ phủ **một nửa** đường ghi.

- Vai điều phối có phiên hợp lệ chèn thẳng được một đơn trỏ hợp đồng sai cặp khách–SKU, và tự đặt
  trạng thái để né quy tắc "hợp đồng chưa chốt thì phải duyệt tay".
- Vai QA chèn thẳng được một cảnh báo nhiệt ở trạng thái *đã đóng*, không ghi chú xử lý, gắn tên
  người xử lý tuỳ ý — luật ALM01–ALM03 chỉ gắn vào đường SỬA, không gắn vào đường TẠO MỚI.

## Quyết định

Mọi bất biến nghiệp vụ phải có một **trigger ở tầng bảng** chặn nó, bất kể tầng API đã kiểm hay
chưa. Tầng API vẫn kiểm, nhưng để trả thông báo lỗi tử tế cho người dùng, không phải để làm hàng
rào duy nhất.

Kèm theo ba quy tắc:

1. Mọi RPC nghiệp vụ **thu hồi quyền gọi** từ `anon` và `authenticated`, chỉ `service_role` gọi được.
2. Trigger phải phủ **đủ mọi thao tác** — `insert` và `update`, không chỉ một trong hai.
3. Mỗi bất biến có một **mã lỗi riêng** (`ORD01`–`06`, `SHP01`, `TMP01`–`02`, `ALM01`–`05`) để bài
   kiểm chứng minh được là đúng luật đó bắn, không phải một lỗi bất kỳ.

## Phương án đã bỏ và lý do

| Phương án | Vì sao bỏ |
|---|---|
| **Giữ luật ở tầng API, đóng PostgREST lại** | Đóng được PostgREST thì mất luôn RLS lọc dữ liệu đọc theo vai, phải tự viết lại toàn bộ tầng đọc. Và nó chỉ đóng một cửa: script nhập liệu, migration, tích hợp ERP sau này vẫn ghi thẳng vào bảng |
| **Dùng `check constraint` thay trigger** | Ràng buộc kiểm tra chỉ nhìn được một hàng đang ghi. Phần lớn luật ở đây phải đọc hàng khác: 日付逆転 đọc lịch sử giao, ngưỡng nhiệt đọc bảng phiên bản |
| **Tin vào việc mọi thao tác ghi đều qua ứng dụng** | Đây chính là giả định đã bị hai lỗ hổng trên bác bỏ. Giả định "không ai gọi thẳng" không kiểm chứng được |
| **Chỉ dựa vào RLS, không cần trigger** | RLS trả lời "ai được ghi hàng nào", không trả lời "nội dung hàng đó có hợp lệ không". Vai QA **được phép** tạo cảnh báo; cái sai là nội dung cảnh báo đó |

## Hệ quả

**Được:** luật bịt mọi đường ghi, kể cả đường chưa ai nghĩ tới. Script, migration và tích hợp
tương lai đều bị chặn như nhau. Mã lỗi nghiệp vụ trở thành một hợp đồng kiểm chứng được.

**Mất:** luật nằm ở hai nơi (hàm quy tắc thuần và trigger SQL), nên đổi luật phải sửa cả hai và
giữ cho chúng khớp nhau. Chấp nhận có lặp ở đây, vì cái giá của việc lệch là một hồ sơ HACCP sai.

**Việc phải làm theo:** mỗi luật mới cần một bài kiểm **chạy đỏ trước khi vá**, đi thẳng vào CSDL
bằng tài khoản thật chứ không qua API — vì đó đúng là đường kẻ tấn công sẽ đi.
