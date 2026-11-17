# Danh mục quyết định kiến trúc (ADR)

Mỗi ADR ghi một quyết định **đã đưa ra và đang có hiệu lực**, kèm những phương án đã cân nhắc rồi
bỏ. Mục "Phương án đã bỏ và lý do" là phần đáng đọc nhất: nó cho biết quyết định này đã được cân
nhắc hay chỉ là lựa chọn mặc định không ai hỏi lại.

> Tài liệu **tạo mới cho LAB-4** — bộ spec-standard của công ty không có biểu mẫu cho ADR.
> Format tối thiểu: Trạng thái · Bối cảnh · Quyết định · Phương án đã bỏ và lý do · Hệ quả · Mã liên quan.

| Mã | Quyết định | Bẫy nghiệp vụ liên quan | Trạng thái |
|---|---|---|---|
| [ADR-001](ADR-001-business-rules-at-table-level.md) | Đặt bất biến nghiệp vụ ở **tầng bảng**, không chỉ ở tầng API | nền cho tất cả | Đã áp dụng |
| [ADR-002](ADR-002-two-expiry-types.md) | Tách **賞味期限** và **消費期限** thành hai nhánh xử lý | ② hai loại hạn | Đã áp dụng |
| [ADR-003](ADR-003-date-reversal-at-table-level.md) | So **日付逆転** với lịch sử giao của **đúng cặp khách–SKU**, kiểm ở hai thời điểm | ④ đảo ngày | Đã áp dụng |
| [ADR-004](ADR-004-delivery-window-rule-per-agreement.md) | Quy tắc **1/3 – 1/2** là thuộc tính của hợp đồng; bỏ trống thì duyệt tay | ③ tập quán hợp đồng | Đã áp dụng |
| [ADR-005](ADR-005-versioned-temperature-policy.md) | Ngưỡng **3 dải nhiệt** là dữ liệu có phiên bản, chọn theo thời điểm đo | ① ngưỡng của khách | Đã áp dụng |
| [ADR-006](ADR-006-driver-hours-blocks-route-publish.md) | **Giờ lái** khoá việc công bố tuyến; tối ưu tuyến ngoài phạm vi | ⑥ ràng buộc cứng | Đã áp dụng, có phần chưa làm đủ |

## Bẫy nghiệp vụ nào chưa có ADR riêng

Bẫy ⑤ — **truy xuất nguồn gốc chỉ bắt buộc với gạo và thịt bò** — không có ADR riêng vì nó không
tạo ra ngã rẽ kiến trúc nào: nó là một trường dữ liệu trên mã hàng và một phép kiểm lúc xác nhận
phiếu nhập. Quyết định duy nhất ở đó là **không áp quy định bắt buộc cho toàn bộ mặt hàng**, và
nó nằm trong screen spec của SC4-01 và SC4-06.

## Ba điểm chung rút ra từ sáu quyết định

1. **Số liệu nghiệp vụ là dữ liệu có phiên bản, không phải hằng số** — ngưỡng nhiệt (ADR-005), quy
   tắc cửa sổ giao (ADR-004), bộ ngưỡng giờ lái (ADR-006) đều theo khuôn này. Chúng là chính sách
   của khách và sẽ đổi; hồ sơ cũ phải giữ nguyên cách chấm.
2. **Luật phải phủ hết mọi đường ghi, không chỉ cửa chính** — ADR-001 và ADR-003 đều sinh ra từ
   những lỗ hổng tìm được thật, cùng một dạng: luật đúng nhưng chỉ gắn vào một nửa thao tác.
3. **Không đoán khi thiếu dữ liệu** — ADR-004 cho đơn vào trạng thái chờ duyệt tay thay vì suy ra
   quy tắc mặc định. Dừng lại và hỏi tốt hơn chạy tiếp với một giả định ngầm không ai thấy.
