# Tiền đề cho LAB-4

Những quyết định bổ sung sau LAB-1, chốt trước khi viết specs. Mọi tài liệu trong `specs/` bám
theo file này.

## 1. Hướng đã chốt: specs tả thiết kế đúng, chỗ lệch ghi riêng thành sổ gap

LAB-1 bóc RFP ra 54 feature / 32 màn / 38 user story. LAB-2 dựng prototype chạy thật nhưng cắt gọn
15 chỗ (`docs/scope.md` mục 5). LAB-4 phải chọn tả theo bên nào.

**Chốt: thân specs tả hệ thống đúng như RFP yêu cầu. Chỗ prototype làm khác ghi thành dòng có mã
trong [`database/gap-list.md`](database/gap-list.md), không rào đón trong thân spec.**

Ba ràng buộc để sổ gap không thành thùng rác:

| Ràng buộc | Nội dung |
|---|---|
| Giọng văn | Thân spec viết một giọng mệnh lệnh, tả thiết kế đúng. Đây là thứ LAB-5 bẻ ra task |
| Hình thức ghi lệch | Một dòng `GAP-xx` trong sổ gap. Trong spec chỉ được xuất hiện dưới dạng con trỏ một dòng `→ GAP-07` |
| Giới hạn | Chạm **6 bẫy nghiệp vụ** thì **không được gọi là gap** — đó là lỗi phải sửa, không phải lựa chọn phạm vi |

Vì sao không chọn hai hướng kia: tả bám prototype thì khách Nhật đọc ra là không hiểu yêu cầu, và
mục tiêu "phát hiện chỗ prototype làm khác thiết kế" của đề bài không còn gì để đối chiếu. Tả đủ 54
feature thì LAB-5 bẻ ra task không ai làm nổi, và không câu nào kiểm chứng được với thứ đang chạy.

Bằng chứng ủng hộ hướng này: vòng audit cuối của LAB-2 tìm ra **2 lỗ hổng mức Cao**, cả hai đều
thuộc dạng luật nghiệp vụ chỉ phủ một nửa đường ghi (`docs/security-audit.md`). Thiết kế phải dẫn
code, không chạy theo code.

## 2. Phạm vi đặc tả chi tiết: 7 màn cốt lõi

Đề bài đòi screen spec cho "các màn hình cốt lõi". Chốt 7 màn, chọn theo tiêu chí **phủ đủ 6 bẫy
nghiệp vụ** chứ không theo độ phức tạp giao diện:

| Màn | Bẫy nghiệp vụ nó gánh |
|---|---|
| SC4-01 Kiểm hàng nhập | ① ngưỡng 3 dải theo phiên bản · ② 賞味期限 ≠ 消費期限 · ⑤ truy xuất gạo/bò |
| SC4-02 Tồn kho 3 dải nhiệt | ① · ② |
| SC4-03 Đơn xuất và phân bổ lô | ③ quy tắc 1/3–1/2 là tập quán hợp đồng · ④ 日付逆転 theo cặp khách–SKU |
| SC4-04 Lập tuyến giao | ⑥ giờ lái là ràng buộc cứng chặn công bố tuyến |
| SC4-05 Cảnh báo nhiệt | ⑥ HACCP — bất biến hồ sơ, không đóng được khi thiếu nội dung xử lý |
| SC4-06 Truy xuất nguồn gốc | ⑤ chỉ gạo và thịt bò bắt buộc |
| SC4-07 Master và ngưỡng nhiệt | ① ngưỡng do khách tự công bố, có phiên bản |

Các màn còn lại của LAB-2 (Dashboard, Lịch sử giao, Dữ liệu cảm biến, các trang chi tiết đơn, tuyến,
phiếu) chỉ có một dòng trong [`_index.md`](_index.md) kèm lý do không viết spec chi tiết ở LAB-4.

## 3. Thêm và bớt so với LAB-1 — giữ nguyên quyết định của LAB-2

Mười lăm thay đổi ở `docs/scope.md` mục 5 **không mở lại**. Chúng vào specs theo đúng ba ràng buộc ở
mục 1: thân spec tả thiết kế đúng theo RFP, mỗi chỗ cắt gọn thành một dòng gap.

Hai chỗ phải nói riêng vì chạm bẫy nghiệp vụ, nên **không** được xếp vào gap mà phải tả đúng ngay:

- **Kiểm giờ lái** (`scope.md` 5.7): prototype chỉ kiểm trong một ngày tuyến, bỏ ngưỡng
  năm/tháng/tuần. Giờ lái là ràng buộc cứng (bẫy ⑥) nên specs tả đủ các ngưỡng của 改善基準告示;
  phần prototype chưa làm ghi rõ là *chưa làm*, không phải *ngoài phạm vi*.
- **Ngưỡng nhiệt có phiên bản** (`scope.md` 5.5): LAB-2 bỏ vòng đời duyệt master data nhưng giữ
  `effective_from` cho ngưỡng nhiệt và hợp đồng khách–SKU. Đúng, giữ nguyên — đây là lõi bẫy ① và ③.

## 4. Giả định tạm thời — 16 điểm chưa có câu trả lời của khách

`docs/scope.md` mục 6 liệt kê 16 điểm CẦN XÁC NHẬN kèm giả định prototype đang dùng. LAB-4 **giữ
nguyên các giả định đó**, không tự đổi; specs chạm vào điểm nào thì trích số hiệu điểm đó.

Bốn điểm ảnh hưởng nặng nhất tới specs, cần PM soát trước khi viết Bước 6:

| # | Điểm | Giả định đang dùng | Vì sao nặng |
|---|---|---|---|
| 1 | Công thức 1/3 – 1/2: mốc bắt đầu, thời điểm phán định, làm tròn | `production_date + floor((expiry_date − production_date) × tỷ lệ)` | **CHẶN BÁO GIÁ** — sai công thức là sai toàn bộ màn Đơn xuất |
| 3 | 日付逆転 khi hạn **bằng** lần giao trước | Bằng thì cho phép, chỉ chặn khi nhỏ hơn | Quyết định một dấu `<` hay `≤` trong luật trung tâm của hệ thống |
| 9 | Phút nghỉ tối thiểu để reset bộ đếm lái liên tục 4h | Tham số `min_break_minutes`, seed giá trị tạm | RFP chỉ ghi "lái liên tục tối đa 4 giờ", không ghi số phút nghỉ |
| 15 | SLA xác nhận cảnh báo nhiệt | 15 phút, lấy từ baseline S1-03 | Prototype để hằng số trong code; bản thật nên là cấu hình có phiên bản như ngưỡng nhiệt |

**[CẦN PM XÁC NHẬN]** — bốn điểm trên. Mười hai điểm còn lại giữ nguyên giả định, PM soát khi review
ở Bước 7.

## 5. Quy ước mã dùng xuyên suốt

| Loại | Dạng mã | Nguồn |
|---|---|---|
| Màn hình | `SC4-01` … `SC4-07` | File này, mục 2 |
| Yêu cầu nghiệp vụ / chức năng | `BR-xx`, `FR-xx`, `NFR-xx` | `docs/01_requirements-extract.md` (LAB-1) |
| Quyết định kiến trúc | `ADR-001` … | `architecture/ADR-index.md` |
| Chỗ prototype làm khác thiết kế | `GAP-01` … | `database/gap-list.md` |
| Mã API | `SER-xx` | `_common/api-list.md` |
| Mã thông báo trên màn | `M_xx` | `_common/error-codes.md` |
| Mã lỗi nghiệp vụ ở tầng CSDL | `ORD01`–`06`, `SHP01`, `TMP01`–`02`, `ALM01`–`05` | `supabase/migrations/` của LAB-2 |
