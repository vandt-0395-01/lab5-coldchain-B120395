# Việc còn tồn

Danh sách chỗ **đã biết là chưa xong** tính đến 16/11/2026, sau vòng review chéo và hai vòng sửa.

Tách riêng khỏi [`database/gap-list.md`](database/gap-list.md): sổ gap nói về chỗ **prototype làm
khác thiết kế**; file này nói về chỗ **bản thân bộ specs còn thiếu hoặc chưa nhất quán**.

Mọi mục ở đây đều **không chặn LAB-5 bẻ task**. Mười hai lỗi mức Cao đã xử lý xong, ghi ở
[`review-report.md`](review-report.md) mục A và B.

---

## Còn tồn — cần khách hoặc PM trả lời

| # | Việc | Trạng thái |
|---|---|---|
| **P-04** | **Mức ưu tiên của 8 yêu cầu phi chức năng chưa xác minh được.** Bảng NFR không có cột ưu tiên, danh sách tính năng không trỏ tới. Người soát xếp chúng ngoài tập P0 bằng **suy luận, không bằng trích dẫn** | **Chưa giải được trong LAB-4.** Cần đối chiếu RFP gốc hoặc hỏi khách. Hệ quả nếu đoán sai: một NFR đáng ra P0 bị đẩy xuống sau, LAB-5 không bẻ task cho nó |
| **P-02** | Vế "ghi sự kiện ngoại lệ bất biến" của `BR-EXP-02` và bốn nhịp còn lại của `BR-HACCP-01` | **Đã ghi thành `GAP-24` mức Cao, chờ PM ký.** [`PREMISE.md`](PREMISE.md) mục 1 cấm xếp yêu cầu chạm bẫy thành lựa chọn phạm vi, nên chúng phải nằm trong sổ gap chứ không được để trống |
| **P-03** | Chín yêu cầu P0 vắng mặt ở cả thân spec lẫn sổ gap | **Đã ghi thành `GAP-25`, chờ PM ký.** Lý do vắng mặt là chúng được khai "ngoài phạm vi **prototype LAB-2**", trong khi specs tả **hệ thống đúng theo RFP** |
| **P-10** | **HACCP có phải ràng buộc cứng khi lập lịch giao hàng không?** `CLAUDE.md` của workspace nói có. Sổ yêu cầu LAB-1 dòng 275 nói RFP **không** gắn HACCP với việc lập lịch/công bố tuyến — HACCP chặn ở xác nhận nhập/xuất (`BR-TEMP-02`, `FR-OUT-05`) và sinh hàng đợi hồ sơ (`BR-HACCP-01`) — và tự đánh dấu câu kia là "chưa có trong RFP → cần hỏi khách" | **Chọn bám sổ yêu cầu**, vì `CLAUDE.md` cũng tự đặt luật không thêm yêu cầu ngoài RFP. Specs tả HACCP là ràng buộc cứng **ở đúng hai cổng của nó**, không gắn vào công bố tuyến. Nếu khách xác nhận cần gắn thì phát sinh một phép kiểm mới ở `SER-16` — **ảnh hưởng báo giá**, phải hỏi trước |
| **P-11** | **Ngưỡng nhiệt tra theo dải hay theo mã hàng/khu?** `FR-TEMP-02` viết "theo chính sách SKU/khu"; `temp_policies` khoá theo dải, `ADR-005` chốt theo dải | **Đã ghi thành `GAP-26`, chờ khách.** Đổi sang mã hàng/khu là **đổi khoá của bảng ngưỡng** — việc lớn, không phải chỉnh màn. Hỏi trước khi báo giá |
| **P-12** | **Dung sai cho đợt vượt ngưỡng** — hiện một bản ghi đơn lẻ ngoài ngưỡng cũng sinh cảnh báo với thời lượng 0 phút | RFP không nêu dung sai nào. Để nguyên thì nhiễu cảm biến sinh cảnh báo rác, mà hồ sơ HACCP lại không được tự lọc. Cần khách chốt ngưỡng tối thiểu |

---

## Đã xử lý trong vòng sửa cuối

| # | Việc | Đã làm gì |
|---|---|---|
| **P-01** | Trùng không gian mã màn giữa LAB-1 (`SCR-01`…`SCR-33`, 33 màn) và LAB-4 (7 màn khác hẳn) | **Đổi tiền tố LAB-4 thành `SC4-01`…`SC4-07`.** Sửa `_tools/screens.mjs`, đổi tên 49 file, thay 263 chỗ trích dẫn trong `specs/`, dựng lại toàn bộ wireframe. `docs/` của LAB-1 giữ nguyên `SCR-xx` |
| **P-05** | Mốc ngày hiệu lực ngưỡng nhiệt lệch một ngày giữa tài liệu và trigger `TMP01` | `M_70` viết lại thành "phải **sau hôm nay** — sớm nhất là ngày mai"; [`ADR-005`](architecture/ADR-005-versioned-temperature-policy.md) sửa theo đúng điều kiện `effective_from <= current_date` của trigger và trỏ sang `GAP-15` |
| **P-06** | Trường do máy sinh chưa nêu luật sinh | Thêm mục `6bis. Trường do máy sinh — luật sinh` vào SC4-03, SC4-04, SC4-05: cửa sổ đánh giá 24 giờ và trần 1000 điểm đo, cách chọn `affected_lot_ids`, dạng mã đơn `ORD-YYYYMMDD-XXXXXX` theo ngày JST, thứ tự đoạn tuyến do máy gán |
| **P-07** | `SHP01` dùng chung mã thông báo `M_32` với bước phân bổ | Cấp mã riêng `M_34b` cho lỗi chặn lúc giao; SC4-03 sửa theo |
| **P-08** | Còn câu kiểu nhật ký công việc trong thân spec | Đã gỡ; chuỗi "Bước 7" chỉ còn trong một dòng History of change hợp lệ |
| **P-09** | Chưa có mã thông báo cho xung đột tạo phiên bản ngưỡng đồng thời | Thêm `M_73` (HTTP 409) vào [`_common/error-codes.md`](_common/error-codes.md) |
| **P-13** | **Mô tả `RC001` trong danh mục mã lỗi sai so với code.** Danh mục ghi "dòng đã xác nhận thì không sửa được"; `0005_receipt_confirm_rpc.sql` ném `RC001` khi **dòng bị sửa giữa lúc đánh giá và lúc ghi** | Sửa lại mô tả theo code, và nói rõ luật "đã xác nhận thì không sửa" đi đường khác (lọc `status = 'draft'` ở `PATCH`, không có mã lỗi). Lộ ra khi viết `DD-RCV-001` |
| **P-14** | Thiếu mã thông báo cho ba tình huống chung: xung đột xác nhận đồng thời ở SC4-01, không tìm thấy bản ghi, lỗi hệ thống | Thêm `M_74`, `M_75`, `M_76` |
| **P-15** | **Mục `6bis` của SC4-05 sai hai chỗ so với code**: cửa sổ đánh giá viết "24 giờ từ thời điểm bấm" (code lấy từ **bản ghi đo mới nhất**), và trần viết "quá 1000 bản ghi" (code chặn ở **đủ 1000 trở lên**) | Sửa theo code, nêu rõ hai mốc chỉ trùng nhau khi bộ ghi chạy đều. Lộ ra khi viết `DD-ALM-001` |

---

## Cách kiểm lại danh sách này

Bốn cổng kiểm tự động chạy lại được bất cứ lúc nào, nhưng **không cổng nào bắt được các mục ở
trên** — chúng đều là lỗi nội dung, không phải lỗi hình thức:

```bash
node specs/_tools/check-req-codes.mjs    # mã yêu cầu có thật trong sổ 88 mã không
node specs/_tools/check-links.mjs        # link nội bộ còn sống không
node specs/_tools/check-mermaid.mjs      # sơ đồ đúng cú pháp không
npm run specs:check-schema               # tên bảng/cột có thật và thuộc đúng bảng không
```

Đây chính là bài học của vòng review: cổng kiểm tự động giữ cho tài liệu **không sai về hình
thức**, nhưng chuyện tài liệu có **nói đúng nghiệp vụ** hay không thì vẫn phải có người đọc.
