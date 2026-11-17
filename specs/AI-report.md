# Cách dùng AI trong LAB-4

Người thực hiện: PL · 16/11/2026 · Claude Code + Takumi kit · 11 commit trên nhánh `lab4-specs`

Nhật ký thô từng bước: [`ai-log.md`](ai-log.md). Báo cáo review: [`review-report.md`](review-report.md).

---

## 1. Skill đã dùng theo từng bước

| Bước | Skill | Cách viết prompt — điểm chính | Output |
|---|---|---|---|
| 0 | `/tkm:manage-docs` | Nêu rõ cấu trúc cây mong muốn và lý do tách hai nhóm kế thừa / tạo mới | Khung `specs/`, 6 biểu mẫu BM, `_template-list.md` |
| 1 | `/tkm:brainstorm --role cpo` | Đưa **ba hướng** kèm ràng buộc thật của đề bài, yêu cầu khuyến nghị dứt khoát và nêu rõ hướng bị loại mất gì | [`PREMISE.md`](PREMISE.md) |
| 2a | `/tkm:automate-browser` | Liệt kê đúng 7 đường dẫn, 7 vai, 7 nơi lưu | 7 ảnh hiện trạng |
| 2b | `/tkm:design-ui` | Mô tả từng màn theo **bẫy nghiệp vụ nó gánh**, không theo độ phức tạp giao diện | 7 wireframe × 5 file |
| 3 | Mermaid viết thẳng | Nhấn "KHÔNG vẽ thành luồng tuyến tính chung" — yêu cầu riêng của đề bài | [`architecture/architecture.md`](architecture/architecture.md) |
| 4 | `/tkm:manage-docs` | Bắt mỗi ADR phải có mục *Phương án đã bỏ và lý do* | 6 ADR + index |
| 5 | `/tkm:up-create-database-design` | Giới hạn phạm vi: viết đầy đủ các bảng mang bẫy, bảng còn lại chỉ vào danh mục | [`database/`](database/) |
| 6 | `/tkm:manage-docs` + 6 agent song song | Viết **một màn mẫu trước**, rồi giao 6 màn còn lại kèm quyền sở hữu file tách bạch | 7 screen spec |
| 7 | `/tkm:review-doc --level high` | 4 agent context sạch, mỗi agent một góc; bắt **mọi phát hiện phải trích dẫn nguyên văn hai đầu** | [`review-report.md`](review-report.md) |
| 8 | `/tkm:manage-docs` | — | [`README.md`](README.md) |
| 9 | `/tkm:write-journal` | — | File này |

**Ba skill trong kế hoạch ban đầu không tồn tại** trong kit đang cài — `draw-diagram`,
`design-database`, `run-retro`. Đã đối soát trước khi chạy và thay bằng thứ có thật. Bước 7 còn
đổi từ `/tkm:review-code` sang `/tkm:review-doc`: cái đầu review **code**, cái sau review **tài
liệu** và có sẵn cơ chế bắt trích dẫn verbatim — khác nhau hẳn.

---

## 2. Con người review ở giai đoạn nào

Quy trình đặt sẵn **năm điểm dừng**, mỗi điểm PM phải duyệt mới đi tiếp:

| Điểm dừng | PM soát cái gì | Kết quả thật |
|---|---|---|
| Sau Bước 1 | Hướng đi và 4 giả định nặng nhất | Duyệt giữ nguyên cả bốn |
| Sau Bước 2 | Danh sách màn; màn Đơn xuất có hiện lô đã giao trước khi chặn đảo ngày không | Duyệt |
| Sau Bước 5 | Sổ gap — gap nào vào LAB-5, gap nào chấp nhận | Duyệt |
| Sau Bước 7 | Điền quyết định cho từng lỗi | **Chốt: làm hết nhóm Cao, nhóm C ghi nợ** |
| Sau Bước 9 | Tự đánh giá | — |

Điểm dừng sau Bước 7 là điểm có giá trị nhất: 12 lỗi mức Cao được PM chốt **làm ngay** thay vì
đẩy sang LAB-5, trong đó có chỗ nếu để nguyên thì LAB-5 sẽ đi **xoá chức năng đang chạy đúng**.

---

## 3. Lỗi AI sinh ra — phát hiện và xử lý thế nào

Mười lỗi đáng kể. Điểm chung: **không lỗi nào bị bắt bởi việc đọc lại tài liệu** — tất cả lộ ra
khi đem đối chiếu với nguồn sự thật.

| # | Lỗi | Phát hiện bằng cách nào | Xử lý |
|---|---|---|---|
| 1 | **7 tên cột không tồn tại** trong tài liệu CSDL: `measured_c`, `label_expiry_date`, `rice_origin_info`… Tên nào cũng nghe rất hợp lý | Đối chiếu từng tên với `information_schema` thay vì tin trí nhớ | Sửa, rồi viết `check-schema-refs` đối chiếu tự động |
| 2 | **Cột có thật nhưng gán nhầm bảng**: tài liệu ghi `lots` có cột loại hạn, thật ra nằm ở `skus`. **Bộ kiểm lúc đó cho qua** vì nó chỉ hỏi "tên có tồn tại không" | Agent viết screen spec đi tra schema rồi báo ngược lại | Thêm **lớp kiểm thứ hai**: cột phải thuộc đúng bảng. Gài lại lỗi để chứng minh lớp mới chuyển đỏ |
| 3 | **6 mã yêu cầu bịa**: `FR-MST-01/02`, `BR-EXP-03`, `FR-ALM-01/02`, `OPS-HACCP-01`. Bốn mã trong số đó **đã in lên ảnh wireframe** từ Bước 2 | Người soát ma trận truy vết grep từng mã trong sổ đăng ký | Thay bằng mã thật, rồi viết `check-req-codes` quét cả `.md` lẫn `.mjs`. **Chạy lần đầu nó bắt thêm mã bịa trong chính các ADR tôi tự viết** |
| 4 | **Sai một chữ Hán**: `M_21` viết **賢**味期限 thay vì **賞**味期限 | Đọc lại chính dòng vừa viết | Sửa, quét toàn repo xác nhận không còn chỗ nào |
| 5 | **Gán ngược luật cho hai mã lỗi**: `ORD04` và `ORD06` đổi chỗ nhau ở hai spec | Người soát mâu thuẫn đọc migration | Sửa, và **tách dòng gộp `ORD01`–`ORD06`** trong danh mục — chính chỗ gộp đó che mất lỗi |
| 6 | **`LS001`/`LS002` viết ngược nhau** trong danh mục mã lỗi | Agent dẫn **hai nguồn độc lập** cùng chỉ ra chiều ngược lại | Sửa theo code |
| 7 | **Bảng item đánh 3 trường truy xuất `Required = Có` vô điều kiện** → dev bẻ task từ bảng đó sẽ bắt buộc cả ba cho **mọi** mặt hàng, đúng bẫy ⑤. Mà gạo và bò loại trừ nhau nên điều kiện đó còn không ai thoả được | Người soát 6 bẫy đọc **file mà dev thực sự dùng**, không chỉ thân spec | Đổi thành "CHỈ với thịt bò" / "CHỈ với gạo" |
| 8 | **Spec thu hẹp yêu cầu so với RFP**: màn Truy xuất chốt 3 khoá trong khi RFP đòi nhiều hơn, rồi gọi bản đầy đủ của prototype là *"mở rộng"* | Đối chiếu nguyên văn `FR-TRC-01` với code | Viết lại theo RFP. **Để nguyên thì LAB-5 đi xoá chức năng đang chạy đúng** |
| 9 | **Tên trường API sai kiểu đặt tên**: snake_case trong khi thân yêu cầu dùng camelCase | Bộ kiểm schema báo tên không có trong CSDL | Tra schema ở biên rồi sửa |
| 10 | **Hai công thức số lượng mâu thuẫn nhau** — do tôi thêm một ô vào wireframe **sau khi** spec đã viết xong | Người soát tính làm được đọc cả hai mục rồi đối chiếu | Gộp thành một bảng duy nhất |

**Một lỗi tự gây ra khi vá lỗi khác:** bảng thiết kế mới `predispatch_checks` làm bộ kiểm schema
báo 7 lỗi cho đúng thứ hợp lệ. Nếu để vậy, lần sau ai thấy bộ kiểm đỏ sẽ tắt nó đi. Đã dạy bộ kiểm
hiểu khái niệm *bảng thiết kế chưa dựng*, rồi **gài lại lỗi để chắc đường miễn trừ không làm thủng
nó** — vẫn bắt được cả tên bịa lẫn cột gán nhầm bảng.

---

## 4. Điểm đặc biệt trong cách dùng AI lần này

**Một nguồn sinh ra cả ảnh lẫn bảng.** Biểu mẫu BM-51 bắt mục validation, data mapping và event
trỏ tới item bằng mã dạng `A-2`, và ảnh đánh số phải mang đúng mã đó. Vẽ tay trước rồi viết spec
sau thì chỉ cần thêm một ô là lệch. Nên một file `screens.mjs` sinh ra cả wireframe, bản đánh số,
lẫn bảng item — **không còn đường nào để chúng lệch nhau**.

**Bốn cổng kiểm, mỗi cổng ra đời từ một lỗi có thật.** Không cổng nào dựng cho đủ hình thức: mỗi
cái sinh ra sau khi một loại lỗi đã lọt qua. Hiện `165 lần trích mã · 0 bịa` · `161 link · 0 gãy`
· `378 tham chiếu schema · 0 sai` · `10 sơ đồ · 0 lỗi`.

**Agent soát ngược lại người giao việc.** Ba agent sửa bài không chỉ làm phần được giao mà còn tìm
ra bốn lỗi trong file của tôi — lỗi số 2, 6 và hai chỗ sai lệch spec với code. Điều kiện để chuyện
đó xảy ra: giao **quyền sở hữu file tách bạch** và yêu cầu báo lại chỗ nghi ngờ thay vì tự sửa
ngoài phạm vi.

**Review chạy với context sạch, chia theo góc nhìn chứ không theo file.** Bốn người soát: ma trận
truy vết, mâu thuẫn, sáu bẫy, và *"dev đọc xong có làm được không"*. Góc cuối là góc tìm ra nhiều
vấn đề chặn nhất, vì nó hỏi một câu mà ba góc kia không hỏi.

**Yêu cầu báo cả mặt tốt.** Người soát 6 bẫy được yêu cầu liệt kê cả chỗ specs nói **đúng**. Một
báo cáo chỉ toàn lỗi thì không biết phần còn lại đã được soi hay chưa soi tới.

---

## 4bis. Vòng detail design — chỗ tìm ra lỗi đắt nhất

Ba agent viết detail design cho xác nhận phiếu nhập, đánh giá vượt ngưỡng nhiệt và công bố tuyến.
Điểm khác biệt duy nhất so với các vòng trước: prompt **buộc đọc thẳng hàm, migration và script
kiểm chứng**, cấm suy diễn từ tài liệu. Vòng này tìm ra bốn lỗi trong tài liệu **đã qua review
chéo và đã xanh cả bốn cổng kiểm**:

| # | Lỗi | Vì sao các vòng trước không bắt được |
|---|---|---|
| 1 | Danh mục mô tả `RC001` là "dòng đã xác nhận thì không sửa được". Code ném mã này khi **dòng bị sửa giữa lúc đánh giá và lúc ghi** — hai luật khác hẳn | Mô tả nghe hợp lý và khớp tên màn. Chỉ lộ ra khi đọc `raise exception … using errcode` trong migration |
| 2 | `SC4-05` ghi cửa sổ đánh giá "24 giờ từ thời điểm bấm". Code lấy mốc từ **bản ghi đo mới nhất trong bảng** | Hai mốc trùng nhau khi bộ ghi chạy đều, nên đọc tài liệu không thấy sai. Lệch hẳn đúng lúc nguy hiểm nhất: khi bộ ghi ngừng |
| 3 | Cùng mục đó ghi trần "quá 1000 bản ghi". Code chặn ở **đủ 1000 trở lên** | Lệch một đơn vị ở biên — đúng loại lỗi mà đọc lại không bao giờ bắt |
| 4 | README và PREMISE gộp HACCP với giờ lái vào cùng cổng công bố tuyến | `CLAUDE.md` của workspace nói vậy. Nhưng sổ yêu cầu LAB-1 nói thẳng RFP **không** gắn HACCP với lập lịch, và tự đánh dấu câu kia "chưa có trong RFP → cần hỏi khách" |

Lỗi số 4 là lỗi đáng nói nhất về cách dùng AI: **hai nguồn chỉ dẫn đá nhau, và agent chọn đúng
nguồn** — vì prompt nêu rõ nguồn sự thật là gì, chứ không phải vì nó thông minh hơn. Khi prompt
không xếp thứ tự ưu tiên giữa các nguồn, mô hình sẽ chọn nguồn nào nghe thuận tai hơn.

Ba agent còn tìm thêm bốn chỗ prototype làm khác thiết kế (`GAP-26`…`GAP-29`), trong đó **ba cái
không màn hình nào nhìn thấy**: khoá của bảng ngưỡng nhiệt, dữ liệu vi phạm trả về trên nhánh đua,
và ràng buộc chồng thời gian giữa các đoạn tuyến. Vòng review tài liệu trước đó không có cách nào
bắt được chúng, vì chúng không xuất hiện trên bất kỳ tài liệu nào để mà đối chiếu.

---

## 5. Tự đánh giá

### Chỗ tự tin là hiệu quả

**Đối chiếu thay vì đọc lại.** Mười lỗi ở mục 3 không lỗi nào bị bắt bằng cách đọc lại tài liệu.
Đọc lại chỉ xác nhận thứ mình đã tin. Đem từng tên cột tra `information_schema`, từng mã yêu cầu
grep trong sổ đăng ký, từng mã lỗi đọc trong migration — đó mới là chỗ lỗi lộ ra.

**Biến lỗi thành cổng kiểm.** Mỗi loại lỗi bắt được đều kết thúc bằng một bộ kiểm chạy lại được,
không phải bằng một ghi chú "lần sau cẩn thận". Và mỗi bộ kiểm đều được **gài lại lỗi cũ để chứng
minh nó chuyển đỏ** — không làm bước đó thì không biết mình có một bộ kiểm hay một thứ trang trí.

**Nói thẳng chỗ skill không khớp việc.** Ba skill không tồn tại, một skill dùng sai loại, một
skill không chạy được vì thiếu thư viện. Tất cả ghi vào nhật ký thay vì giấu đi — đó là dữ liệu
thật về việc dùng AI, có giá trị hơn một bảng toàn dấu tích.

### Chỗ chưa tốt, cần cải thiện

**Bộ kiểm cho tôi cảm giác an toàn giả.** Lỗi số 2 là bài học đau nhất: tôi có bộ kiểm, nó báo
xanh, và tôi tin. Nhưng nó chỉ kiểm được một nửa câu hỏi — "tên này có tồn tại không" chứ không
phải "có thuộc đúng bảng không". Lần sau, khi viết một bộ kiểm, phải viết luôn **câu hỏi mà nó
KHÔNG trả lời được** vào ngay đầu file.

**Chạy song song rồi sửa nguồn chung giữa chừng.** Tôi thêm item vào wireframe sau khi agent đã
viết spec, tạo ra lỗi số 10. Lẽ ra phải đóng băng nguồn chung trước khi phát việc.

**Bốn cổng kiểm không bắt được lỗi nội dung.** Mười hai lỗi mức Cao của vòng review đều lọt qua cả
bốn: gán sai luật cho mã lỗi, thu hẹp yêu cầu so với RFP, bỏ trống đường ra của trạng thái. Đây
không phải lỗi của cổng kiểm mà là giới hạn của loại công cụ đó — nhưng tôi mất khá lâu mới hiểu
rằng chạy thêm cổng kiểm không thay được một người đọc kỹ với câu hỏi đúng.

**Viết tài liệu từ trí nhớ.** Lỗi số 1 và 3 cùng một gốc: viết ra tên nghe hợp lý rồi đi tiếp.
Nguy hiểm vì tên bịa trông y hệt tên thật, và tài liệu vẫn hiển thị đẹp. Lần sau nên tra **trước
khi** viết, không phải kiểm **sau khi** viết.

**Chín việc còn tồn**, ghi ở [`PENDING.md`](PENDING.md): bốn việc cần PM quyết, năm việc làm được
ngay. Không việc nào chặn LAB-5 bẻ task, nhưng để lại thì tài liệu còn chỗ tự mâu thuẫn.
