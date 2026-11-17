# Báo cáo review bộ specs LAB-4

Ngày 16/11/2026 · bốn người soát độc lập, context sạch, mỗi người một góc.
Mọi phát hiện đều có trích dẫn nguyên văn hai đầu kèm `file:dòng` trong báo cáo gốc ở
[`../plans/reports/`](../plans/reports/).

## Phán quyết

**CHƯA ĐẠT để bẻ task ở LAB-5.** Hai màn chưa làm được, và truy vết yêu cầu gần như không tồn tại.

| Góc soát | Kết quả | Báo cáo gốc |
|---|---|---|
| Sáu bẫy nghiệp vụ | **ĐẠT cả 6** · 0 lỗi mức Cao · 5 mức Trung bình | `review-lab4-traps.md` |
| Mâu thuẫn tài liệu ↔ code | 18 mâu thuẫn: 6 Cao · 7 Trung bình · 5 Thấp | `review-lab4-contradictions.md` |
| Ma trận truy vết | **13/88 mã yêu cầu** có mặt; **5/7 screen spec không chứa mã nào** | `review-lab4-traceability.md` |
| Tính làm được | 1 màn đủ · 4 thiếu ít · **2 chưa làm được** (SC4-03, SC4-07 phần D) | `review-lab4-buildability.md` |

Điểm sáng đáng ghi nhận: **không chỗ nào rơi vào 6 bẫy nghiệp vụ.** Cả bốn người soát đều xác nhận
riêng điều đó — kể cả những chi tiết dễ trượt nhất: đúng biên là ĐẠT, hạn bằng nhau thì cho qua,
không suy ra quy tắc 1/3 mặc định, và không chỗ nào dịch "nghỉ" thành 休息期間.

---

## A. Đã sửa ngay trong vòng review

| # | File | Vấn đề | Mức | Đã làm gì |
|---|---|---|---|---|
| A1 | `receiving/.../SC4-01_SPEC.md` | Hai công thức số lượng mâu thuẫn nhau (do tôi thêm ô "số lượng từ chối" sau khi spec đã viết) | Cao | Gộp thành một bảng bốn cột duy nhất, nói rõ `qty_accepted` là **máy chủ tính**, không có ô nhập |
| A2 | `receiving/assets/SC4-01_items.md` | Ba trường truy xuất đánh `Required = Có` **vô điều kiện** → dev bẻ task từ bảng này sẽ bắt buộc cả ba cho **mọi** mặt hàng, đúng bẫy ⑤. Mà bò và gạo loại trừ nhau nên điều kiện đó không thoả được | Cao | Đổi thành "Có — CHỈ với thịt bò" / "CHỈ với gạo", thêm cảnh báo đọc kỹ cột Required |
| A3 | `_common/error-codes.md` | `M_32` mất vế "cùng mặt hàng" — mà specs không được tự chế mã, nên dev render đúng chuỗi sai đó | Cao | Thêm cả hai vế khách và mặt hàng vào câu thông báo |
| A4 | `master/.../SC4-07_SPEC.md` | Trích **hai mã yêu cầu không tồn tại** (`FR-MST-01`, `FR-MST-02`). Mã thật là `DR-MST-01` | Cao | Thay bằng mã thật ở cả spec lẫn wireframe |
| A5 | `architecture.md`, `gap-list.md` | Kể "nghỉ giữa hai đoạn lái" là ngưỡng **khoá công bố** — thật ra phút nghỉ chỉ là điều kiện **reset bộ đếm**, nghỉ 10 phút không sinh vi phạm | Trung bình | Sửa thành đúng ba phép kiểm khoá công bố, nói rõ vai trò của phút nghỉ |
| A6 | `OUT_ALLOCATION_DETAIL.md` | Trích sai số hiệu điểm CẦN XÁC NHẬN — `#8` thật là "bò 9 chữ số", không phải câu hỏi về mốc hạn | Trung bình | Ghi rõ câu hỏi này **chưa nằm trong 16 điểm**, phải bổ sung vào danh sách hỏi khách |

---

## B. Phải sửa trước khi bẻ task ở LAB-5

| # | File | Vấn đề | Mức | Cách sửa đề xuất | PM quyết định |
|---|---|---|---|---|---|
| B1 | 5 screen spec (SC4-02/03/04/05/06) | **Không chứa một mã yêu cầu nào trong thân bài.** Mã chỉ nằm trên ảnh wireframe, nên grep không ra và LAB-5 không truy vết được. RFP đòi ma trận tuân thủ 88 yêu cầu | **Cao** | Thêm vào mỗi spec một bảng "Yêu cầu màn này thực hiện": mã · nội dung · mục nào của spec đáp ứng | |
| B2 | `SC4-03_SPEC.md`, `SC4-07_SPEC.md` | **Gán ngược hai mã lỗi.** Hai spec ghi `ORD06` cho luật "hợp đồng chưa chốt quy tắc → duyệt tay". Trigger thật: `ORD06` = *đơn không gắn hợp đồng*; luật kia là **`ORD04`** | **Cao** | Sửa thành `ORD04`. Tách dòng gộp `ORD01`–`ORD06` trong `_common/` thành sáu dòng riêng — chính chỗ gộp đó che mất lỗi | |
| B3 | `SC4-01`, `SC4-04` | Khai **tên trường API theo snake_case** trong khi thân yêu cầu thật là camelCase (`routeDate`, `qtyReported`…). Bốn spec còn lại viết đúng | **Cao** | Sửa theo schema Zod ở biên. Lưu ý `SER-10` **không nhận** `seq` — máy chủ tự đánh thứ tự | |
| B4 | `SC4-04_SPEC.md` | Khai `SER-13` nhận tham số phiên bản bộ quy tắc từ client. Thật: **thân yêu cầu bị bỏ qua hoàn toàn**, máy chủ tự lấy | **Cao** | Xoá tham số đó; sửa cả mô tả `RULE_VERSION_MISMATCH` trong `_common/` | |
| B5 | `SC4-01`, `SC4-02`, `SC4-05` | Ba spec báo "danh mục thiếu mã cho trường hợp chưa có phiên bản ngưỡng" và mượn `M_02`/`M_05`. **`M_16` đã có sẵn** — kết quả: mã định nghĩa rồi mà không màn nào dùng, còn người dùng nhận thông báo sai | **Cao** | Thay bằng `M_16` ở cả ba màn | |
| B6 | `SC4-03_SPEC.md` | **Không có máy trạng thái đơn.** `business_review` vào được nhưng không có đường ra: không màn duyệt, không API duyệt, không ai duyệt | **Cao** | Thêm bảng chuyển trạng thái + chốt đường ra cho `business_review` (có thể là một màn mới ở LAB-5) | |
| B7 | `SC4-07_SPEC.md` phần D | Form thêm/sửa master cho 5 bảng **không có đặc tả trường nào**, và 3 trong 5 bảng (`customers`, `suppliers`, `locations`) không được định nghĩa ở bất cứ đâu trong `specs/` | **Cao** | Bổ sung định nghĩa ba bảng vào BM-50, rồi đặc tả form | |
| B8 | `COLDCHAIN_DATABASE.md` | Enum trạng thái đơn liệt **4 giá trị**, thật có **5** — thiếu `cancelled`, và không spec nào nói tới trạng thái huỷ đơn | **Cao** | Bổ sung giá trị và đặc tả luồng huỷ đơn, hoặc ghi gap nếu cố ý chưa làm | |
| B9 | `SC4-06_SPEC.md` | Thu hẹp yêu cầu tra cứu từ 5 khoá (RFP) xuống 3, rồi gọi bản đầy đủ của prototype là "mở rộng". **Prototype đang đúng hơn spec** — LAB-5 đọc spec sẽ đi xoá bớt chức năng đang chạy đúng | **Cao** | Sửa spec theo RFP: bổ sung khoá nhà cung cấp, xuất xứ gạo, mã cá thể bò | |
| B10 | `specs/` + `gap-list.md` | **`FR-OUT-05` và nửa chiều xuất của `BR-TEMP-02` biến mất hoàn toàn** — không có kiểm nhiệt trước khi xuất hàng, không bảng nào lưu kết quả. `BR-TEMP-02` đòi "tại **mọi** lần nhập/xuất" | **Cao** | Chạm bẫy ① nên theo `PREMISE.md` mục 1 **không được xếp vào gap**: phải đặc tả, hoặc nếu giữ ngoài phạm vi thì cần một dòng gap mức Cao có PM ký | |
| B11 | `specs/` | **`NFR-SEC-03` vắng mặt ở cả ba nơi**: specs, `scope.md` mục 5, và sổ gap | **Cao** | Đưa vào một trong ba nơi | |
| B12 | CSDL thật | `temp_policies` đang có **13 phiên bản AMBIENT** cùng ngày hiệu lực — rác do `npm run verify:master` sinh ra. Việc này làm sụp cơ sở xếp `GAP-04` là "chưa khai thác được" | **Cao** | Dọn CSDL, hoặc nâng mức `GAP-04`. Và sửa script kiểm để nó tự dọn | |

---

## C. Nên sửa, chưa chặn LAB-5

| # | File | Vấn đề | Mức | Cách sửa | PM quyết định |
|---|---|---|---|---|---|
| C1 | 4 file | Mô tả `TMP01` là "không được nằm trong quá khứ"; trigger thật chặn cả **hôm nay** (sớm nhất là ngày mai). Dev viết lại luật từ ADR sẽ cho phiên bản hiệu lực ngay trong ngày — đúng tình huống ADR-005 dựng ra để chặn | Trung bình | Sửa bốn chỗ cho khớp trigger, hoặc nới trigger rồi sửa `GAP-15` | |
| C2 | `SC4-01`, `SC4-02`, `SC4-05`, `SC4-06` | Mục 6 viết như **nhật ký công việc** ("bổ sung ở Bước 7"), và nhiều việc trong đó **đã làm xong rồi**. Dev không biết tin bảng hay tin ghi chú; LAB-5 sẽ sinh task rỗng | Trung bình | Dọn mục 6: bỏ việc đã xong, chuyển việc còn lại thành dòng gap có mã | |
| C3 | 4 spec | **Trường do máy sinh không có luật sinh**: `affected_lot_ids`, `reference` của đơn, `seq` của đoạn, `qty_accepted`. Màn tả kỹ ô người nhập, bỏ trống ô máy điền — đúng chỗ dev buộc phải tự bịa | Trung bình | Bổ sung luật sinh cho từng trường | |
| C4 | `SC4-03_SPEC.md` | Nói "vai khác bị proxy chặn", nhưng `admin` **vào được** `/orders`. Ba spec kia đều tả chế độ chỉ-xem cho admin, riêng SC4-03 bỏ sót | Trung bình | Thêm dòng chế độ chỉ-xem cho admin | |
| C5 | `_common/error-codes.md` | `RC001`, `LS001`, `LS002` có thật trong migration nhưng **không có** trong danh mục; `ORD05` khai mà không màn nào dùng | Trung bình | Bổ sung ba mã thiếu; rà ngược mã thừa | |
| C6 | `SC4-03`, `SC4-05` | `SHP01` (chặn lúc **giao**) đang hiển thị bằng `M_32` — mã loại "Thông tin" viết cho bảng giải trình lúc **phân bổ**. Trộn hai thời điểm mà ADR-003 cố ý tách | Trung bình | Thêm một mã riêng cho thời điểm giao | |
| C7 | `gap-list.md` | Thống kê sai: Trung bình ghi 9 (thật 8), Thấp ghi 5 (thật 6), "Mười hai gap vào LAB-5" (thật 11) | Thấp | Đếm lại | |
| C8 | `_common/error-codes.md` | `M_52` nhét cứng "15 phút" vào câu thông báo, trong khi chính spec nói đó là **giả định** phải thành cấu hình có phiên bản | Thấp | Tham số hoá như `M_10` đã làm | |
| C9 | `gap-list.md` | `SC4-03` hẹn đưa "chưa chặn ngày giao quá khứ" vào sổ gap — **sổ gap chưa có dòng nào** cho chỗ này | Thấp | Thêm một dòng gap | |
| C10 | Toàn bộ | **Trùng không gian mã màn giữa LAB-1 và LAB-4.** LAB-1 `SC4-01` = Đăng nhập, LAB-4 `SC4-01` = Kiểm hàng nhập. Một câu khai báo ngoài phạm vi đang trỏ nhầm hệ | Trung bình | Chốt một hệ, hoặc đổi tiền tố cho LAB-4 trước khi LAB-5 bẻ task | |

---

## D. PM phải quyết, không phải lỗi

| # | Việc | Bối cảnh |
|---|---|---|
| D1 | **9 yêu cầu P0 nằm ngoài thiết kế nhưng đã khai báo ngoài phạm vi** | Mọi khai báo đó là về phạm vi **prototype LAB-2**, trong khi `PREMISE.md` chốt specs tả **hệ thống đúng theo RFP**. Theo đúng nguyên tắc đó, chín mã này đáng ra phải có trong thân spec + một dòng gap; hiện vắng cả hai nơi |
| D2 | **Hai yêu cầu chạm bẫy nghiệp vụ nhưng đã khai ngoài phạm vi** (`FR-OUT-05`, `BR-HACCP-01`) | `PREMISE.md` mục 1 tự cấm xếp loại như vậy. Giữ quyết định phạm vi thì cần một dòng gap mức Cao có PM ký, không thể để trống cả hai nơi |
| D3 | **Mức ưu tiên của 8 yêu cầu phi chức năng chưa xác minh được** | Bảng NFR không có cột ưu tiên, danh sách tính năng không trỏ tới. Người soát xếp ngoài tập P0 bằng suy luận, **không bằng trích dẫn** — cần đối chiếu RFP gốc |

---

## Bài học rút ra từ vòng review này

**Lỗi tập trung ở một chỗ duy nhất: `_common/` được cập nhật SAU khi screen spec viết xong, và không ai rà ngược.** Ba trong sáu lỗi mức Cao đều từ gốc đó — `M_16` định nghĩa rồi mà ba màn vẫn báo thiếu, `ORD05` khai mà không ai dùng, `M_32` sửa muộn.

Cách chặn: thêm một phép **rà ngược** vào bộ kiểm tự động — *mã nào khai trong `_common/` mà không màn nào dùng, và mã nào màn dùng mà `_common/` không có*. Chính phép rà đó là thứ tìm ra `M_16` và `ORD05`.

**Ba cổng kiểm hiện có không bắt được loại lỗi nào trong báo cáo này.** Chúng kiểm *hình thức* (link, cú pháp sơ đồ, tên định danh có thật), còn mọi lỗi ở đây là lỗi *nội dung*: gán sai luật cho mã lỗi, thu hẹp yêu cầu, bỏ trống đường ra của trạng thái. Không có bộ kiểm tự động nào thay được một người đọc kỹ với câu hỏi đúng.
