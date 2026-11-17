# ADR-006 — Giới hạn giờ lái khoá việc công bố tuyến; tối ưu tuyến để ngoài phạm vi

| | |
|---|---|
| **Trạng thái** | Đã áp dụng, có phần chưa làm đủ |
| **Ngày** | 2026-11-16 |
| **Mã liên quan** | FR-SCH-01 · FR-SCH-02 · FR-SCH-04 · OPS-LAW-01 |

## Bối cảnh

Từ 2024, quy định giờ làm việc tài xế xe tải ở Nhật siết lại (vấn đề thường gọi là 物流2024年問題).
Các ngưỡng nằm trong 改善基準告示 và là **quy định pháp luật**, không phải chỉ tiêu nội bộ: lái
liên tục tối đa 4 giờ, thời gian ràng buộc trong ngày 13 giờ (tối đa 15 giờ), cộng các ngưỡng
tuần, tháng, năm.

Một hệ thống lập lịch giao hàng có hai cách đối xử với ràng buộc này, và chọn sai là sai bản chất:

| Cách | Hệ quả |
|---|---|
| Coi là **chỉ tiêu tối ưu** | Hệ thống xếp tuyến "tốt nhất có thể", vi phạm thì cảnh báo. Điều phối viên bận sẽ bấm cho qua |
| Coi là **ràng buộc cứng** | Tuyến vi phạm **không công bố được**. Phải sửa tuyến mới đi tiếp |

## Quyết định

Giờ lái là **ràng buộc cứng khoá việc công bố tuyến**. Không có nút bỏ qua, không có quyền nào
vượt qua được — kể cả vai Quản trị.

Hai điểm kèm theo:

1. **Máy chủ tự kiểm lại trong CSDL khi công bố**, không tin kết quả kiểm mà client gửi lên. Client
   gửi kèm số hiệu phiên bản bộ quy tắc nó đã dùng; máy chủ tự chọn lại phiên bản theo ngày chạy
   tuyến và đối chiếu.
2. **Bộ ngưỡng có phiên bản** như ngưỡng nhiệt, chọn theo ngày chạy tuyến. Quy định pháp luật thay
   đổi được, và tuyến cũ phải giữ nguyên cách chấm.

**Tối ưu tuyến để ngoài phạm vi.** Hệ thống **kiểm** tuyến do người lập, không **đề xuất** tuyến.

## Phương án đã bỏ và lý do

| Phương án | Vì sao bỏ |
|---|---|
| **Cảnh báo nhưng vẫn cho công bố** | Biến một ràng buộc pháp lý thành một thông báo bỏ qua được. Dưới áp lực giao hàng, nút "vẫn công bố" sẽ luôn được bấm, và hệ thống thành công cụ tạo bằng chứng vi phạm |
| **Cho vai Quản trị vượt qua** | Vi phạm giờ lái là vi phạm luật lao động, không phải vấn đề phân quyền. Không ai trong công ty có thẩm quyền miễn trừ |
| **Chỉ kiểm ở client cho nhanh** | Client gửi lên kết quả kiểm là tin vào thứ mình không kiểm soát. Máy chủ phải tự tính lại từ dữ liệu đoạn thời gian |
| **Làm luôn tối ưu tuyến** | Tối ưu tuyến là bài toán riêng, cần dữ liệu quãng đường, thời gian di chuyển thật và cửa sổ nhận hàng của từng khách — RFP không cung cấp. Làm nửa vời sẽ cho ra tuyến trông hợp lý nhưng không chạy được ngoài đời |
| **Gộp đoạn nghỉ với khái niệm 休息期間** | Sai nghiệp vụ. RFP dùng 拘束時間 và 休息期間 cho **khái niệm luật lao động** tính theo ngày; đoạn "nghỉ" trong một tuyến giao là chuyện khác. Dịch gộp là sai từ, mà ở hồ sơ pháp lý thì sai từ là sai nghĩa |

## Hệ quả

**Được:** hệ thống không thể tạo ra bằng chứng vi phạm. Tuyến đã công bố luôn là tuyến hợp lệ theo
phiên bản quy định tại ngày chạy.

**Mất:** điều phối viên phải tự sửa tuyến cho đến khi hợp lệ. Màn lập tuyến vì thế phải chỉ rõ
**vi phạm ngưỡng nào** và **thiếu bao nhiêu**, không chỉ báo "tuyến không hợp lệ".

**Phần chưa làm đủ — `GAP-01`, mức Cao:** prototype mới kiểm trong phạm vi **một ngày tuyến** (lái
liên tục, thời gian ràng buộc ngày, nghỉ giữa hai đoạn lái). Các ngưỡng tuần, tháng, năm và quãng
nghỉ giữa hai ngày làm việc **chưa làm**, vì chúng cần dữ liệu tích luỹ nhiều ngày. Bộ ngưỡng đã
lưu đủ số trong bảng phiên bản để mở rộng sau.

Ghi rõ đây là **chưa làm**, không phải **ngoài phạm vi** — giờ lái là ràng buộc cứng, không được
đẩy vào sổ gap như một lựa chọn phạm vi (xem [`PREMISE.md`](../PREMISE.md) mục 3).
