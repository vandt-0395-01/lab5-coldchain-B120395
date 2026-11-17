# Danh mục API dùng chung

Mọi screen spec tra mã API ở đây. **Không file spec nào được tự khai API mới** — quy ước của biểu
mẫu BM-2-901-51 mục 4.3.

Quy ước mã `SER-xx`. Một API dùng ở nhiều màn vẫn chỉ có một dòng.

Đối chiếu với 20 route thật trong `app/api/**/route.ts` của LAB-2.

## Ghi nghiệp vụ

| API ID | Method | Path | Mục đích | Vai gọi được | Màn dùng |
|---|---|---|---|---|---|
| `SER-01` | POST | `/api/receipts` | Tạo phiếu kiểm hàng nhập. Người lập lấy từ phiên | warehouse_staff | SC4-01 |
| `SER-02` | POST | `/api/receipts/{id}/lines` | Thêm dòng hàng vào phiếu. Trạng thái dòng do máy chủ đặt `draft` | warehouse_staff | SC4-01 |
| `SER-03` | PATCH | `/api/receipt-lines/{lineId}` | Sửa dòng hàng khi còn `draft` | warehouse_staff | SC4-01 |
| `SER-04` | POST | `/api/receipt-lines/{lineId}/confirm` | **Xác nhận dòng → sinh lô.** Kiểm nhiệt theo phiên bản ngưỡng tại thời điểm đo, kiểm loại hạn, kiểm trường truy xuất | warehouse_staff | SC4-01 |
| `SER-05` | POST | `/api/lots/{lotId}/status` | Đổi trạng thái lô: giải phóng, huỷ, cách ly. Bắt buộc có lý do | qa_haccp | SC4-02 |
| `SER-06` | POST | `/api/orders` | Tạo đơn xuất. Trạng thái và điều kiện giao do máy chủ suy ra từ hợp đồng | dispatcher | SC4-03 |
| `SER-07` | POST | `/api/orders/{orderId}/allocate` | **Phân bổ lô.** Chạy đủ 6 phép loại, trả về cả lô được chọn lẫn lý do loại từng lô khác | dispatcher | SC4-03 |
| `SER-08` | POST | `/api/orders/{orderId}/deliver` | Xác nhận đã giao. Ghi vào lịch sử giao, kiểm lại 日付逆転 ở tầng bảng | dispatcher | SC4-03 |
| `SER-09` | POST | `/api/routes` | Tạo tuyến giao | dispatcher | SC4-04 |
| `SER-10` | POST | `/api/routes/{routeId}/segments` | Thay toàn bộ đoạn thời gian của tuyến. Tuyến đã công bố thì từ chối | dispatcher | SC4-04 |
| `SER-11` | POST | `/api/routes/{routeId}/check` | Kiểm giờ lái, trả kết quả từng ngưỡng | dispatcher | SC4-04 |
| `SER-12` | POST | `/api/routes/{routeId}/assign-order` | Gắn đơn vào tuyến | dispatcher | SC4-04 |
| `SER-13` | POST | `/api/routes/{routeId}/publish` | **Công bố tuyến.** Máy chủ tự kiểm lại giờ lái trong CSDL, không tin kết quả client gửi lên | dispatcher | SC4-04 |
| `SER-14` | POST | `/api/alarms/evaluate` | Quét bản ghi nhiệt, gom đoạn vượt ngưỡng liên tiếp thành cảnh báo | qa_haccp | SC4-05 |
| `SER-15` | POST | `/api/alarms/{alarmId}/review` | Ghi xử lý và đóng cảnh báo. Người xử lý và thời điểm do máy chủ ghi | qa_haccp | SC4-05 |
| `SER-16` | POST | `/api/temp-policies` | **Tạo phiên bản ngưỡng nhiệt mới.** Số hiệu phiên bản và người tạo do máy chủ cấp | qa_haccp | SC4-07 |
| `SER-17` | POST | `/api/master/{entity}` | Thêm bản ghi master. `entity` nằm trong danh sách trắng 5 bảng | admin | SC4-07 |
| `SER-18` | PATCH | `/api/master/{entity}/{id}` | Sửa bản ghi master. Khoá chính và các cột lõi không sửa được | admin | SC4-07 |

## Đọc dữ liệu

| API ID | Method | Path | Mục đích | Vai gọi được | Màn dùng |
|---|---|---|---|---|---|
| `SER-19` | GET | `/api/traceability` | Dựng chuỗi truy xuất. Tham số `keyType` + `value`. **Bảy loại khoá**: mã lô, số lô NCC, mã cá thể bò, xuất xứ gạo, mã giao dịch gạo, mã khách, mã đơn — `FR-TRC-01` còn đòi mã hàng và nhà cung cấp, xem `GAP-21` | cả 4 vai | SC4-06 |
| `SER-20` | GET | `/api/health` | Kiểm hệ thống sống và nối được CSDL | **public** — cố ý, để trả lời được cả khi Auth hỏng | — |

## Hai quy ước áp cho mọi API ghi

1. **`requireRole()` là câu lệnh đầu tiên**, trước mọi thao tác dữ liệu. Sai vai trả `403`.
2. **Client không đặt được trạng thái, người thao tác, hay số hiệu phiên bản.** Những giá trị đó
   máy chủ suy ra từ dữ liệu hoặc lấy từ phiên. Gửi lên cũng bị bỏ qua.

## Màn hình đọc dữ liệu không qua API

Các màn đọc dữ liệu bằng **Server Component với phiên của người dùng**, để quyền đọc ở tầng hàng
(RLS) lọc giúp — không đi qua route API. Vì vậy mục 4.3 của screen spec chỉ liệt kê API ở những ô
thực sự gọi API; ô còn lại ghi nguồn là bảng CSDL.
