# Sổ gap — chỗ prototype LAB-2 làm khác thiết kế

Theo hướng đã chốt ở [`PREMISE.md`](../PREMISE.md) mục 1: thân specs tả **thiết kế đúng**; mỗi chỗ
prototype làm khác là một dòng ở đây, không rào đón trong thân spec.

**Ràng buộc quan trọng nhất:** chạm 6 bẫy nghiệp vụ thì **không được xếp vào sổ này như một lựa
chọn phạm vi**. Đó là *chưa làm* hoặc *lỗi phải sửa*, và cột Mức sẽ ghi Cao.

## Cách đọc

| Cột | Nghĩa |
|---|---|
| **Mức** | Cao = chạm bẫy nghiệp vụ hoặc ràng buộc pháp lý · Trung bình = lệch thiết kế, chưa khai thác được · Thấp = khác biệt về tiện dụng |
| **Xử lý ở đâu** | LAB-5 = bẻ thành task · Chờ khách = cần câu trả lời trước khi làm · Chấp nhận = cố ý giữ nguyên, có lý do |

---

## Gap đang mở

| Mã | Chỗ lệch | Prototype đang làm | Thiết kế đúng | Mức | Rủi ro | Xử lý ở đâu |
|---|---|---|---|---|---|---|
| **GAP-01** | Kiểm giờ lái thiếu phần lớn ngưỡng của 改善基準告示 | Chỉ kiểm trong **một ngày tuyến**, đúng ba phép: lái liên tục, thời gian ràng buộc ngày, hai đoạn chồng thời gian. Phút nghỉ tối thiểu chỉ dùng để reset bộ đếm, không phải ngưỡng khoá công bố | Kiểm đủ cả ngưỡng tuần, tháng, năm, lái bình quân 2 ngày, và quãng nghỉ giữa hai ngày làm việc. Bảng `driver_rule_versions` **đã lưu đủ số**, chỉ thiếu logic | **Cao** | Tuyến hợp lệ trong ngày vẫn có thể vi phạm ngưỡng tuần hoặc tháng. Hệ thống báo đạt trong khi thực tế vi phạm luật lao động | LAB-5 |
| **GAP-02** | Cảnh báo nhiệt không tự cách ly lô | Chỉ **liệt kê** lô nằm trong vùng ảnh hưởng; QA tự sang màn Tồn kho cách ly tay | Lô trong vùng ảnh hưởng tự chuyển sang cách ly, QA xác nhận giải phóng sau | Trung bình | Khoảng trống giữa lúc phát sinh cảnh báo và lúc QA thao tác: lô vẫn nằm trong tồn khả dụng và có thể bị phân bổ | LAB-5 |
| **GAP-03** | Tuyến đã công bố không sửa được | Chặn hẳn mọi thao tác sửa | Cho sửa **có lý do** và sinh phiên bản tuyến mới, giữ lại bản cũ | Trung bình | Thực tế vận hành phải đổi tuyến sau khi công bố (xe hỏng, khách dời giờ). Hiện phải xoá và lập lại, mất dấu vết | LAB-5 |
| **GAP-04** | Thời điểm đo nhiệt do người dùng tự đặt | Người kiểm nhập `measured_at` và sửa được khi dòng còn `draft` | Chặn thời điểm đo nằm quá xa thời điểm ghi bản ghi; đóng băng sau khi xác nhận | Trung bình | Lùi thời điểm đo về trước ngày siết ngưỡng thì được chấm theo phiên bản cũ lỏng hơn. **Chưa khai thác được** vì CSDL mới có phiên bản 1 cho cả 3 dải — lỗ hổng là **cấu trúc**, mở ra ngay khi có phiên bản 2 | LAB-5 |
| **GAP-05** | Hợp đồng chồng kỳ hiệu lực | Ràng buộc duy nhất chỉ trên `(customer_id, sku_id, effective_from)` | Thêm ràng buộc loại trừ trên khoảng hiệu lực để không có hai hợp đồng cùng cặp cùng hiệu lực một lúc | Trung bình | Tồn tại song song hai hợp đồng cùng cặp khách–SKU, một cái có quy tắc cửa sổ giao, một cái để trống → chọn cái không trống là **đi vòng qua bẫy ③**. Chưa khai thác được vì dữ liệu demo mỗi cặp chỉ có một hợp đồng | LAB-5 |
| **GAP-06** | Tên người nhận nằm chung bảng đơn | `orders.allocation_evidence` chứa tên người nhận, mà bảng đơn mở cho cả 4 vai đọc | Tách chứng từ giao hàng sang bảng riêng, chỉ điều phối và quản trị đọc được | Trung bình | Nhân viên kho và QA đọc được tên người nhận hàng của mọi khách, không có nhu cầu nghiệp vụ | LAB-5 |
| **GAP-07** | Bảng chỉ-ghi-thêm không chặn `TRUNCATE` | Trigger chặn `update` và `delete`, không chặn `truncate` | Chặn cả `truncate`, và thu hồi quyền `truncate` khỏi `service_role` trên ba bảng sổ | Trung bình | Toàn bộ chuỗi bằng chứng HACCP xoá được bằng một câu lệnh. **Cần khoá service-role**, thứ chỉ máy chủ giữ — không vai người dùng nào chạm tới | LAB-5 |
| **GAP-08** | RPC không tự kiểm vai của người thao tác | RPC nhận `p_actor` và tin, không đọc bảng hồ sơ để kiểm vai | Mỗi RPC tự kiểm vai của `p_actor` bên trong | Thấp | Phòng thủ nhiều lớp. Hiện không khai thác được vì RPC đã thu hồi quyền gọi từ `anon` và `authenticated` | LAB-5 |
| **GAP-09** | Mọi nhân viên kho sửa được mọi phiếu nhập | RLS chỉ kiểm vai, không ràng buộc dòng | Chỉ sửa được phiếu của chính mình, và chỉ khi chưa có dòng nào xác nhận | Thấp | Ghi đè được cột người kiểm trong hồ sơ HACCP. **Có thể là thiết kế đúng** — kho chạy ca kíp thì ca sau sửa phiếu ca trước là bình thường | **Chờ khách** |
| **GAP-13** | Bảng nối đơn với tuyến không lưu thứ tự giao | `route_orders` chỉ có `route_id` và `order_id` | Thêm cột thứ tự giao. Wireframe SC4-04 vẽ cột "Thứ tự giao" nhưng mô hình dữ liệu không đỡ được | Trung bình | Thứ tự giao quyết định cả lịch chạy lẫn phép kiểm giờ lái. Hiện phải suy từ thứ tự đoạn thời gian, không chắc chắn | LAB-5 |
| **GAP-14** | Chuỗi truy xuất bỏ mất mắt xích phiếu kiểm nhập | Chỉ nạp lô, nhà cung cấp, phân bổ và lịch sử giao — **không đọc `receipt_lines`** dù `lots.receipt_line_id` đã có sẵn | Chuỗi đi đủ: nhà cung cấp → phiếu kiểm nhập → lô → đơn đã giao | Trung bình | Mất mắt xích chứa kết quả đo nhiệt và trường truy xuất pháp định — đúng phần cơ quan kiểm tra hỏi tới | LAB-5 |
| **GAP-15** | Hai tầng lệch nhau một ngày ở luật ngưỡng nhiệt | Trigger `TMP01` chặn `effective_from <= current_date` (sớm nhất là ngày mai), còn hàm kiểm ở tầng biên chỉ chặn `< today` (cho qua hôm nay) | Hai tầng dùng chung một mốc | Thấp | Người dùng điền ngày hôm nay thì qua được tầng biên rồi mới bị CSDL từ chối — thông báo lỗi khó hiểu. Không sai nghiệp vụ, chỉ lệch trải nghiệm | LAB-5 |
| **GAP-16** | **Không kiểm nhiệt khi XUẤT hàng** | Chỉ kiểm nhiệt ở chiều nhập. Không bảng nào lưu kết quả kiểm trước xuất, không màn nào thao tác | `FR-OUT-05` (P0) đòi ghi nhiệt xe, nhiệt hàng, seal, thời điểm; ngoài chính sách thì **chặn xuất** và sinh sự kiện ngoại lệ. `BR-TEMP-02` đòi "tại **mọi** lần nhập/xuất, không ngoại lệ" | **Cao** | Hàng sai nhiệt vẫn xuất được. Chạm bẫy ① và là yêu cầu P0 — đây là **chưa làm**, không phải ngoài phạm vi | LAB-5 |
| **GAP-17** | Luồng huỷ đơn chưa đặc tả | Enum trạng thái đơn có `cancelled` nhưng không màn nào, không API nào đi vào trạng thái đó | Có đường huỷ đơn kèm lý do và dấu vết | Trung bình | Đơn sai chỉ có cách xoá thẳng trong CSDL, mất dấu vết | LAB-5 |
| **GAP-18** | `NFR-SEC-03` chưa được nhắc ở đâu | Mã hoá đường truyền do Vercel và Supabase lo; mã hoá CSDL, file đính kèm và hàng đợi offline **chưa xét**; log đã kiểm là không in token | Xét đủ bốn vế của yêu cầu | Thấp | Yêu cầu P0 nhưng phần lớn là cấu hình hạ tầng, không phải mã nguồn | **Chờ khách** |
| **GAP-19** | Đơn xuất chưa chặn ngày giao trong quá khứ | Ô ngày giao yêu cầu nhận được ngày đã qua | Chặn ngày quá khứ | Thấp | Ảnh hưởng phép tính cửa sổ giao 1/3 – 1/2 | LAB-5 |
| **GAP-20** | Số lượng nhận do client gửi lên | Thân yêu cầu nhận `qtyAccepted` và ghi thẳng xuống CSDL | **Máy chủ tính**: `qty_reported − qty_rejected − qty_held`. Để client khai số đã nhận là để client tự quyết nhận bao nhiêu | Trung bình | Client gửi số không khớp ba ô còn lại thì tổng lệch mà không ai chặn | LAB-5 |
| **GAP-21** | Truy xuất thiếu hai khoá RFP nêu đích danh | Bảy loại khoá: mã lô, số lô NCC, mã cá thể bò, xuất xứ gạo, mã giao dịch gạo, mã khách, mã đơn | `FR-TRC-01` nêu đích danh cả **mã hàng (SKU)** và **nhà cung cấp**. Prototype chỉ có *số lô* nhà cung cấp, hẹp hơn | Trung bình | Không tra ngược được "mặt hàng này đã đi những đâu" — đúng câu hỏi khi thu hồi hàng loạt | LAB-5 |
| **GAP-22** | `BR-EXP-02` thiếu vế ghi sự kiện ngoại lệ | Lô chạm hạn an toàn bị chặn phân bổ và chặn giao, nhưng **không ghi dòng nào** vào `exception_events` | `BR-EXP-02` đòi "ghi exception event bất biến — không ngoại lệ" | Trung bình | Bảng sổ ngoại lệ có sẵn nhưng không ai ghi vào. Mất dấu vết đúng loại sự kiện mà cơ quan kiểm tra hỏi | LAB-5 |
| **GAP-23** | `BR-POD-01` không phân nhánh theo điều kiện giao | Cột `delivery_term` (`ON_TRUCK` 車上渡し / `AT_DOOR` 軒先渡し) có trong 3 bảng nhưng **không màn nào đọc** | Chứng từ giao hàng phân nhánh theo điều kiện giao | Trung bình | Hai điều kiện giao có nghĩa vụ bằng chứng khác nhau; gộp làm một là sai tập quán thương mại Nhật | LAB-5 |
| **GAP-24** | `BR-HACCP-01` mới làm một phần | Có cảnh báo nhiệt và ghi xử lý. **Chưa có** hàng đợi tính đầy đủ hồ sơ HACCP không tự đóng | `BR-HACCP-01` đòi sinh hàng đợi completeness, không tự đóng cho tới khi đủ hồ sơ | **Cao** | Yêu cầu P0 chạm bẫy ⑥. Theo `PREMISE.md` mục 1 không được xếp thành lựa chọn phạm vi — ghi là **chưa làm**, chờ PM ký | **Chờ PM ký** |
| **GAP-25** | Chín yêu cầu P0 vắng ở cả thân spec lẫn sổ gap | Khai ngoài phạm vi trong `docs/scope.md` mục 5 — nhưng đó là phạm vi **prototype LAB-2** | `PREMISE.md` chốt specs tả **hệ thống đúng theo RFP**, nên chín mã này phải có trong thân spec **và** một dòng gap | Trung bình | Người đọc không phân biệt được "cố ý bỏ" với "quên". Danh sách chín mã ở `plans/reports/review-lab4-traceability.md` mục 5 | **Chờ PM ký** |
| **GAP-26** | Ngưỡng nhiệt tra theo **dải**, không theo mã hàng/khu | `temp_policies` chỉ có cột `band`; bộ phân giải ngưỡng tra theo dải | `FR-TEMP-02` ghi "đánh giá từng bản ghi theo chính sách **SKU/khu** đang hiệu lực" | Trung bình | Lệch về **mô hình dữ liệu**, không phải về màn. `ADR-005` chốt mô hình theo dải nên thân spec bám ADR; nếu khách xác nhận cần theo mã hàng/khu thì phải đổi khoá của `temp_policies` — việc lớn, cần hỏi trước khi báo giá | **Chờ khách** |
| **GAP-27** | Vi phạm do tầng CSDL bắt được **nghèo thông tin hơn** tầng API | `publish_route` trả mỗi vi phạm gồm mã và một mốc thời điểm | Tầng API trả đủ khoảng vi phạm (`from`/`to`) và diễn giải | Trung bình | Chỉ lộ ra trên nhánh đua — khi tuyến bị tầng CSDL từ chối chứ không phải tầng API. Lúc đó người dùng mất **khoảng thời gian vi phạm**, đúng thứ `FR-SCH-02` đòi hiển thị | LAB-5 |
| **GAP-28** | Đoạn tuyến **chồng thời gian** không bị chặn ở tầng bảng | `route_segments` chỉ có ràng buộc kết thúc sau bắt đầu và duy nhất theo thứ tự đoạn | Hai đoạn của cùng tuyến không được chồng khoảng thời gian | Thấp | Đoạn chồng nhau **ghi xuống được**, chỉ bị bắt lúc kiểm hoặc lúc công bố. Cùng dạng lỗ hổng với hai lỗi mức Cao của vòng audit LAB-2: luật đúng nhưng chỉ phủ một nửa đường ghi | LAB-5 |
| **GAP-29** | Chưa có bài kiểm chứng đua cho việc **công bố tuyến** | `verify:route-publish-guard` có 6 nhóm nhưng không nhóm nào bắn song song hai lời gọi công bố | Khoá hàng ở `publish_route` phải được chứng minh bằng bài chạy, như `verify:allocation-race` đã làm cho phân bổ lô | Thấp | Thiết kế khoá là đúng, nhưng **chưa có bằng chứng chạy**. Đây là chỗ hai lỗ hổng mức Cao của LAB-2 từng ẩn nấp | LAB-5 |
| **GAP-10** | SSO / MFA | Supabase Auth email và mật khẩu | SSO qua OIDC, MFA, giới hạn thiết bị được quản lý | Thấp | Phạm vi prototype. Không chạm bẫy nghiệp vụ nào | Chấp nhận |
| **GAP-11** | Vòng đời duyệt master data | Thêm sửa là có hiệu lực ngay | Vòng đời nháp → chờ duyệt → hiệu lực → ngừng, chặn tự duyệt | Thấp | Ngưỡng nhiệt và hợp đồng — hai thứ lõi của bẫy ① và ③ — **vẫn giữ ngày hiệu lực**, nên phần quan trọng không mất | Chấp nhận |
| **GAP-12** | Tối ưu tuyến giao | Không có | Hệ thống đề xuất tuyến | Thấp | Ngoài phạm vi: cần dữ liệu quãng đường, thời gian di chuyển thật, cửa sổ nhận hàng của khách — RFP không cung cấp | Chấp nhận |

## Thống kê

| Mức | Số lượng | Trong đó chạm bẫy nghiệp vụ |
|---|---|---|
| Cao | 3 | 3 — `GAP-01` bẫy ⑥, `GAP-16` bẫy ①, `GAP-24` bẫy ⑥ |
| Trung bình | 16 | 3 — `GAP-04` bẫy ①, `GAP-05` bẫy ③, `GAP-26` bẫy ① (cả ba chưa khai thác được, nhưng là lỗ hổng cấu trúc) |
| Thấp | 10 | 0 |

**Số liệu đếm lại sau vòng review**: **29 gap**: 21 vào LAB-5, 3 chờ khách trả lời, 2 chờ PM ký, 3 chấp nhận giữ nguyên có lý do. Số liệu này đếm lại từ chính bảng trên, không chép tay.

Ba gap `GAP-13`, `GAP-14`, `GAP-15` tìm ra ở Bước 6 khi viết screen spec — đều lộ ra vì đi đối chiếu từng trường với schema và với code thật, không phải từ đọc tài liệu.

Bốn gap `GAP-26`…`GAP-29` tìm ra ở vòng viết detail design, và đều lộ ra theo cùng một cách: đi đọc
thẳng hàm, migration và script kiểm chứng để tả cho đủ thuật toán. Ba trong bốn cái là loại **không
màn hình nào nhìn thấy** — mô hình khoá của bảng ngưỡng, dữ liệu vi phạm trả về trên nhánh đua, ràng
buộc chồng thời gian — nên không vòng review tài liệu nào bắt được.

---

## Hai chỗ KHÔNG nằm trong sổ này — vì đã sửa, không phải lựa chọn phạm vi

Vòng audit bảo mật cuối của LAB-2 tìm ra hai lỗ hổng mức Cao. Theo ràng buộc ở `PREMISE.md`, chúng
chạm bẫy nghiệp vụ nên **không được ghi thành gap** — đã vá và chứng minh:

| Lỗ hổng | Bẫy | Cách vá | Bằng chứng |
|---|---|---|---|
| Bất biến HACCP của cảnh báo nhiệt lách được qua đường **tạo mới** — trigger chỉ gắn vào đường sửa | HACCP | Trigger chạy cả `insert`; cảnh báo chỉ sinh ra ở trạng thái mở và không gắn sẵn dấu vết xử lý (`ALM04`, `ALM05`) | `npm run verify:alarm-integrity` — chạy đỏ 2/7 trước khi vá, xanh 7/7 sau |
| Chặn 日付逆転 lách được khi **giao hai đơn đồng thời** | ④ | Khoá theo cặp khách–SKU trong trigger, đặt trước câu đọc lịch sử | `npm run verify:delivery-race` — gỡ khoá ra là đỏ ngay, lắp lại thì xanh với đúng mã lỗi `SHP01` |

Chi tiết: [`../../docs/security-audit.md`](../../docs/security-audit.md).

---

## Cách kiểm lại sổ này

Sổ gap dễ lạc hậu nhất trong cả bộ specs, vì nó nói về một thứ đang thay đổi. Ba lệnh đối chiếu
với CSDL thật:

```bash
npm run specs:check-schema   # mọi tên bảng/cột viết trong specs có thật không
npm run db:erd               # sinh lại sơ đồ 23 bảng từ schema đang chạy
npm run verify:rls           # 149 phép kiểm phân quyền đọc và ghi
```
