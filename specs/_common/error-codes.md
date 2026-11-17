# Danh mục mã thông báo và mã lỗi dùng chung

Mọi screen spec tra mã thông báo ở đây. **Không file spec nào được tự chế mã mới** — quy ước của
biểu mẫu BM-2-901-51 mục 5.

Hai nhóm mã, đừng trộn lẫn:

- **`M_xx`** — thông báo hiển thị cho người dùng trên màn hình.
- **Mã lỗi nghiệp vụ ở tầng CSDL** — do trigger Postgres ném ra, đã có thật trong LAB-2 và là bằng
  chứng rằng luật nghiệp vụ nằm ở tầng bảng chứ không chỉ ở API.

## M_xx — thông báo trên màn hình

| Mã | Nội dung (tiếng Việt) | Loại | Màn dùng |
|---|---|---|---|
| `M_01` | Trường bắt buộc chưa điền. | Lỗi | mọi màn |
| `M_02` | Giá trị không hợp lệ. | Lỗi | mọi màn |
| `M_03` | Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại. | Lỗi | mọi màn |
| `M_04` | Bạn không có quyền thực hiện thao tác này. | Lỗi | mọi màn |
| `M_05` | Không đọc được dữ liệu, thử lại sau ít phút. | Lỗi | mọi màn |
| `M_10` | Nhiệt độ đo ngoài ngưỡng {dải} phiên bản v{n} ({min}–{max} °C). Lô sẽ vào khu cách ly. | Cảnh báo | SC4-01 |
| `M_11` | Loại hạn trên nhãn ({nhãn}) khác loại hạn khai trong mã hàng ({master}). Kiểm lại hàng, không ghi đè được. | Lỗi | SC4-01 |
| `M_12` | Dải nhiệt của vị trí không khớp dải nhiệt của mã hàng. | Lỗi | SC4-01 |
| `M_13` | Mã số cá thể bò phải đúng 10 chữ số. Hệ thống không tự đệm thêm số 0. | Lỗi | SC4-01, SC4-06 |
| `M_14` | Mặt hàng này thuộc diện truy xuất bắt buộc, cần điền đủ trường nguồn gốc. | Lỗi | SC4-01 |
| `M_15` | Chưa có khu cách ly cho dải thường — lô giữ nguyên vị trí nhưng không vào tồn khả dụng. | Cảnh báo | SC4-01 |
| `M_16` | Chưa có phiên bản ngưỡng nhiệt nào hiệu lực cho dải {dải} tại thời điểm đo. Không chấm được phiếu. | Lỗi | SC4-01, SC4-02, SC4-05 |
| `M_20` | Lô này dùng hạn tiêu thụ an toàn (消費期限) và đã chạm hạn — không phân bổ được. | Lỗi | SC4-02, SC4-03 |
| `M_21` | Lô này dùng hạn ngon nhất (賞味期限), còn {n} ngày. | Cảnh báo | SC4-02, SC4-03 |
| `M_22` | Nhập lý do trước khi giải phóng hoặc huỷ lô. | Lỗi | SC4-02 |
| `M_30` | Hợp đồng giữa khách và mã hàng này chưa chốt quy tắc cửa sổ giao. Đơn chuyển sang chờ duyệt tay. | Cảnh báo | SC4-03 |
| `M_31` | Không đủ hàng để phân bổ. Thiếu {n} {đơn vị}. Hệ thống không phân bổ một phần. | Lỗi | SC4-03 |
| `M_32` | Lô bị loại ở bước đảo ngày: hạn {hạn lô} sớm hơn hạn đã giao gần nhất cho khách {khách} với chính mặt hàng {mã hàng} ({hạn cũ}). | Thông tin | SC4-03 |
| `M_34b` | Không xác nhận giao được: hạn {hạn lô} sớm hơn hạn đã giao gần nhất cho khách {khách} với mặt hàng {mã hàng} ({hạn cũ}). | **Lỗi** | SC4-03 |
| `M_33` | Lô bị loại ở bước cửa sổ giao: quá mốc {tỷ lệ} hạn dùng tính từ ngày sản xuất. | Thông tin | SC4-03 |
| `M_34` | Cần ít nhất một mục bằng chứng giao hàng. | Lỗi | SC4-03 |
| `M_40` | Tuyến vi phạm {ngưỡng}: {giá trị} so với giới hạn {giới hạn}. Không công bố được. | Lỗi | SC4-04 |
| `M_41` | Tuyến đã công bố, không sửa được. | Lỗi | SC4-04 |
| `M_42` | Thời gian ràng buộc ngày vượt mức tiêu chuẩn nhưng chưa vượt mức tối đa. | Cảnh báo | SC4-04 |
| `M_50` | Phải ghi nội dung xử lý trước khi đóng cảnh báo. | Lỗi | SC4-05 |
| `M_51` | Cảnh báo đã đóng, không sửa lại được. | Lỗi | SC4-05 |
| `M_52` | Còn {n} cảnh báo quá hạn xác nhận {sla} phút. | Cảnh báo | SC4-05 |
| `M_60` | Không tìm thấy dữ liệu truy xuất cho mã này. | Thông tin | SC4-06 |
| `M_61` | Mặt hàng này không thuộc diện truy xuất bắt buộc (chỉ gạo và thịt bò). Thông tin nguồn gốc là khuyến khích. | Thông tin | SC4-06 |
| `M_70` | Ngày hiệu lực phải **sau hôm nay** — sớm nhất là ngày mai. | Lỗi | SC4-07 |
| `M_71` | Ngưỡng dưới không được lớn hơn ngưỡng trên. | Lỗi | SC4-07 |
| `M_73` | Có người vừa tạo phiên bản cho dải này. Tải lại trang rồi tạo lại, không ghi đè. | Lỗi | SC4-07 |
| `M_72` | Phiên bản ngưỡng cũ không sửa và không xoá được. Tạo phiên bản mới thay vì sửa. | Thông tin | SC4-07 |
| `M_74` | Dòng phiếu vừa bị người khác thay đổi trong lúc bạn xác nhận. Tải lại dòng rồi xác nhận lại. | Lỗi | SC4-01 |
| `M_75` | Không tìm thấy bản ghi này. Có thể nó vừa bị xoá hoặc đường dẫn sai. | Lỗi | mọi màn |
| `M_76` | Hệ thống gặp lỗi, thao tác chưa được ghi. Thử lại; còn lỗi thì báo quản trị kèm thời điểm. | Lỗi | mọi màn |
| `M_77` | Khoảng thời gian cần chấm có quá nhiều bản ghi đo nên **chưa chấm**. Thu hẹp khoảng rồi chạy lại. | Lỗi | SC4-05 |

## Mã lỗi nghiệp vụ ở tầng CSDL (đã có trong LAB-2)

| Mã | Luật bị vi phạm | Trigger / migration |
|---|---|---|
| `ORD01` | Hợp đồng ghi trên đơn **không tồn tại** | `0010`, `0014` |
| `ORD02` | Hợp đồng **không thuộc đúng cặp** khách–mã hàng của đơn | `0010`, `0014` |
| `ORD03` | Hợp đồng **không còn hiệu lực** tại ngày giao yêu cầu | `0010`, `0014` |
| `ORD04` | Đơn **có** hợp đồng nhưng trạng thái không khớp luật: hợp đồng chưa chốt quy tắc cửa sổ giao thì đơn **bắt buộc** ở `business_review` | `0010`, `0014` |
| `ORD05` | **Điều khoản giao** của đơn khác điều khoản ghi trong hợp đồng | `0010`, `0014` |
| `ORD06` | Đơn **không gắn hợp đồng nào** thì bắt buộc ở `business_review` | `0010`, `0014` |
| `SHP01` | 日付逆転 — không giao lô có hạn sớm hơn lần giao gần nhất của **đúng cặp khách–SKU** | `0011`, `0016` |
| `TMP01`, `TMP02` | Không tạo phiên bản ngưỡng nhiệt hồi tố; ngưỡng dưới không được lớn hơn ngưỡng trên | `0012` |
| `ALM01`–`ALM03` | Cảnh báo đã đóng là bất biến; số liệu bằng chứng bất biến; đóng cảnh báo phải có ghi chú xử lý | `0012` |
| `RC001` | **Dòng phiếu nhập bị sửa giữa lúc đánh giá và lúc ghi** — số lượng nhận/giữ lệch với dòng đã khoá, hoặc thiếu lô tương ứng. Không phải luật "đã xác nhận thì không sửa" (luật đó nằm ở `PATCH` dòng phiếu, lọc `status = 'draft'`, không có errcode) | `0005` |
| `LS001` | **Lô đã bị người khác đổi trạng thái giữa chừng** — trạng thái hiện tại khác trạng thái lệnh kỳ vọng. Tải lại rồi làm lại | `0006` |
| `LS002` | **Chuyển trạng thái không nằm trong bảng chuyển hợp lệ** | `0006` |
| `ALM04`, `ALM05` | Cảnh báo chỉ được tạo ở trạng thái `open`; không gắn sẵn người xử lý hay ghi chú lúc tạo | `0015` |

## Mã kết quả trả về từ RPC nghiệp vụ

Nhóm thứ ba, **khác hẳn hai nhóm trên**: đây không phải thông báo cho người dùng và cũng không phải
lỗi SQLSTATE do trigger ném ra. Đây là **mã kết quả** mà hàm RPC trả về trong `{ok: false, code}`;
tầng API dịch chúng thành mã `M_xx` tương ứng trước khi hiển ra màn.

Nhóm tuyến giao **không có mã lỗi SQLSTATE** — luật giờ lái nằm trong thân hàm RPC chứ không
trong trigger, vì nó cần đọc nhiều bảng và trả về danh sách vi phạm chứ không chỉ một câu từ chối.

| RPC | Mã kết quả | Nghĩa | Hiển thị bằng |
|---|---|---|---|
| `publish_route` | `ROUTE_HAS_VIOLATIONS` | Tuyến còn vi phạm giờ lái — **khoá công bố** | `M_40` |
| `publish_route` | `CONTINUOUS_DRIVING_OVER_LIMIT` | Vượt ngưỡng lái liên tục | `M_40` |
| `publish_route` | `DAILY_DUTY_OVER_MAX` | Vượt mức tối đa thời gian ràng buộc ngày | `M_40` |
| `publish_route` | `SEGMENT_OVERLAP` | Hai đoạn chồng thời gian | `M_40` |
| `publish_route` | `RULE_VERSION_MISMATCH` | Phiên bản bộ quy tắc dùng lúc **kiểm** khác phiên bản hiệu lực lúc **công bố**. Đây là phép kiểm **máy chủ với máy chủ** — thân yêu cầu của `SER-13` bị bỏ qua hoàn toàn, client không gửi phiên bản lên | `M_02` |
| `publish_route` | `RULE_VERSION_NOT_FOUND` | Không có bộ quy tắc hiệu lực tại ngày chạy tuyến | `M_02` |
| `publish_route` | `NO_SEGMENTS` | Tuyến chưa có đoạn nào | `M_01` |
| `replace_route_segments` | `ROUTE_ALREADY_PUBLISHED` | Tuyến đã công bố, không sửa được | `M_41` |
| `replace_route_segments` | `INVALID_SEGMENT` | Loại đoạn hoặc thời điểm không hợp lệ | `M_02` |
| `allocate_order` | `STOCK_CHANGED` | Tồn đổi sau khi khoá — có người khác vừa lấy lô | `M_31` |
| `allocate_order` | `ORDER_NOT_ALLOCATABLE` | Đơn không ở trạng thái phân bổ được | `M_02` |
| `record_delivery` | `ORDER_NOT_DELIVERABLE` | Đơn chưa phân bổ hoặc đã giao | `M_02` |
| `record_delivery` | `INVALID_EVIDENCE` | Thiếu mục bằng chứng giao hàng | `M_34` |

> Bảng `M_xx` đã điền ở Bước 6. Bảng mã lỗi CSDL lấy từ `supabase/migrations/` và `docs/security-audit.md`
> của LAB-2 — đây là sự thật đã chạy, không phải thiết kế trên giấy.
