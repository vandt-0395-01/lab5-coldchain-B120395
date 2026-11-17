# LAB 5 — Backlog và báo cáo tiến độ (Product B, kho lạnh 3 dải nhiệt)

Mã học viên: `B120395` · Đề: **Product B** — 食品コールドチェーン業務支援システム, Công ty CP Logistics Lạnh Yuki

## Tổng quan

Backlog bẻ từ bộ specs **LAB-4 nộp ngày 16/11/2026** (7 screen spec `SC4-01`…`SC4-07`, 4 detail
design, 6 ADR, sổ gap 29 dòng). Toàn bộ bộ đó nằm trong [`specs/`](specs/) của repo này, chép
nguyên trạng ở bước đầu rồi chỉ sửa đúng những chỗ `PREMISE.md` ghi.

**`PREMISE.md` CÓ thay đổi so với LAB-4**: 9 dòng spec thêm/bỏ/sửa, 5 giả định bổ sung, và 6 điểm
LAB-4 để ngỏ nay đã chốt dứt khoát mỗi điểm một phương án.

Kết quả: **10 epic · 103 issue · 23 sub-issue · 428 SWP · 2 471,9 giờ ≈ 309 ngày công ≈ 15,45 MM**.
Đã chạy giả lập **Sprint 1 (02/11–15/11/2026, 10 ngày công)** với trễ thật: đóng 45/69 SWP, một
issue bị chặn vì chờ khách, 6 issue tồn sang Sprint 2.

**Ba chỗ bộ tài liệu này tự khai là chưa đạt**, không giấu:

1. **72 trên 107 issue được chấm trực tiếp vượt trần "1 issue ≤ 2 ngày công"** theo chính số giờ
   của mình — vì trần được áp lúc bẻ task bằng cảm nhận *phạm vi*, còn giờ lại suy từ SWP ra
   *thời lượng*, hai thước đo chưa bao giờ đối chiếu. Chi tiết và việc phải làm:
   [`task-breakdown.md`](task-breakdown.md) phần 1.
2. **Giả định "ngưỡng nhiệt khoá theo dải" là chọn một vế của hai câu RFP mâu thuẫn**
   (`BR-TEMP-01` nói theo dải, `FR-TEMP-02` mức P0 nói theo SKU/zone), không phải lấp chỗ RFP để
   ngỏ. Khai rõ ở [`PREMISE.md`](PREMISE.md) mục 2.
3. **Cơ cấu đội lệch so với backlog**: tính theo từng vai thì BE cần 9,8 sprint còn FE chỉ 3,1.
   Con số "6,9 sprint" ở [`progress-report.md`](progress-report.md) giả định điều phối được giờ
   giữa các vai, thực tế không.

Cả ba đều do vòng **review chéo** bắt được, không phải tự nhận lúc viết. Kết quả review và cách xử
lý từng lỗi: [`review-report.md`](review-report.md).

## Link

| Gì | Đâu |
|---|---|
| Repo (public) | <https://github.com/vandt-0395-01/lab5-coldchain-B120395> |
| GitHub Project (public) | <https://github.com/users/vandt-0395-01/projects/1> |
| Báo cáo SWP dạng HTML | [`reports/swp-lab5-backlog.html`](reports/swp-lab5-backlog.html) — 431 457 byte (≈ 421 KB), tự chứa, mở offline được |

**Về trạng thái công khai:** cả ba đường dẫn đã được gọi **không kèm cookie đăng nhập** và trả
`HTTP 200`; `gh` xác nhận `repo: PUBLIC` và `project public = true`. Đó là kiểm bằng máy —
**người nộp bài nên tự mở lại ba link bằng cửa sổ ẩn danh trước khi bấm nộp**, vì chỉ cách đó mới
thấy đúng cái người chấm sẽ thấy.

**Lệch một chỗ so với đề bài, nói trước cho người chấm khỏi phải tìm:** đề ghi thư mục
`swp-report/`, repo này để ở **`reports/`**. Lý do là bộ render của skill `tkm:estimate-swp` bắt
file HTML phải nằm dưới thư mục tên `reports`, không nhận tên khác. Đề cho phép folder tự đặt tên
nên không sai, nhưng tên khác với ví dụ trong đề.

## Cấu trúc repo

| File / thư mục | Nội dung |
|---|---|
| `README.md` | File này |
| `PREMISE.md` | 9 dòng spec thêm/bỏ/sửa so với LAB-4 · 5 giả định bổ sung · 6 điểm đã chốt, mỗi điểm một phương án |
| `task-breakdown.md` | Nguyên tắc chia task (gồm mục khai thật 72/107 issue vượt trần) · Spec → issue · Hạng mục chịu ràng buộc đặc thù · 67 chỗ hở phát hiện lúc bẻ task |
| `estimate.md` | Đường dẫn báo cáo HTML · 5 issue mẫu người soát · Cách quy SWP ra giờ · Tổng theo epic · So với estimate LAB-1 |
| `progress-report.md` | Báo cáo Sprint 1: trạng thái, burndown, 7 rủi ro trễ có người chịu trách nhiệm và hạn |
| `AI-report.md` | Báo cáo cách dùng AI: skill và prompt từng bước, điểm người soát, lỗi AI và cách xử lý |
| `review-report.md` | Kết quả review chéo: 12 lỗi Critical + 14 Warning, mỗi lỗi có trích dẫn hai đầu |
| `ai-log.md` | Nhật ký ghi ngay sau mỗi bước — cột "Vấn đề AI gặp / đã sửa" là cột chính |
| `backlog.csv` | 136 dòng, nguồn duy nhất của backlog: id, cha, loại, tiêu đề, spec, định nghĩa xong, phụ thuộc, vai, ràng buộc, Scope, Complexity, SWP, giờ, số issue GitHub |
| `specs/` | 114 file — bộ specs LAB-4 chép sang, đã sửa đúng những chỗ `PREMISE.md` ghi |
| `docs/` | `01_requirements-extract.md` (sổ yêu cầu trích từ RFP ở LAB-1) và `scope.md` |
| `reports/` | `swp-lab5-backlog.html` — báo cáo SWP do skill sinh ra |
| `images/` | `burndown.csv` (số liệu) · `burndown.svg` (hình gốc) · `burndown.png` (ảnh nhúng vào báo cáo) |
| `backlog/` | 5 file CSV thô, mỗi agent bẻ task sở hữu một file — giữ lại để lần ngược |
| `findings/` | 5 file ghi chỗ hở phát hiện lúc bẻ task, trước khi gộp vào `task-breakdown.md` phần 4 |
| `scripts/` | 6 script tự viết: `push-backlog-to-github.py` (tạo 136 issue) · `replace-temp-ids-with-issue-numbers.py` (thay id tạm bằng số issue thật) · `link-and-fill-project.py` (nối sub-issue và điền 6 trường trên Project) · `fetch-project-items.py` (đọc Project qua GraphQL — `gh project item-list` không trả về trường tự tạo) · `set-sprint1-status.py` (ghi Status cuối sprint, trạng thái vật chứa suy từ con) · `build-burndown.py` (dựng burndown) |
| `plans/reports/` | 4 báo cáo review gốc (mỗi file một người soát) + bản ghi quét bí mật toàn bộ lịch sử commit |
| `skills/` | **Trống.** Không tự viết skill nào; dùng nguyên các skill có sẵn của bộ Takumi |

## Spec → epic

Epic trên Project mang số issue GitHub thật. SWP của epic là **tổng cộng dồn từ các con**, không
chấm riêng.

| Spec (mã / file LAB-4, hoặc dòng PREMISE) | Epic trên Project | SWP | Ghi chú — ràng buộc đặc thù |
|---|---|---:|---|
| `SC4-01` · `DD-RCV-001` · `FR-REC-02`…`05` · `DR-LOT-01` | [#10 — E1 Kiểm hàng nhập](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/10) | 42 | **Bẫy ①** ngưỡng 3 dải tra theo mốc đo; nhiệt ngoài ngưỡng đi thẳng vào khu cách ly |
| `SC4-02` · `FR-INV-05/06` · `BR-TEMP-01` · `BR-EXP-01/02` · `NFR-SEC-02` · `NFR-AUD-01` | [#11 — E2 Tồn kho 3 dải nhiệt](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/11) | 33 | **Bẫy ②** 賞味期限 cảnh báo ≠ 消費期限 chặn — hai loại hạn xử lý khác nhau, không gộp |
| `SC4-03` · `DD-OUT-001` · `ADR-003/004` · `FR-OUT-01/02/05/06` · `BR-DELWIN-01` · `BR-DATE-01` · `BR-EXP-01/02` | [#12 — E3 Đơn xuất và phân bổ lô](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/12) | 104 | Epic nặng nhất. **Bẫy ③** quy tắc 1/3–1/2 là tập quán hợp đồng tính từ ngày sản xuất, để trống thì chuyển `business_review` chứ không tự điền · **Bẫy ④** 日付逆転 so theo **cặp khách × SKU** từ lịch sử giao, không so với hôm nay; bằng hạn thì cho qua |
| `SC4-04` · `DD-RTE-001` · `FR-SCH-01/04` · `DR-ROUTE-01` · `ADR-006` · `GAP-03/13/28/29` | [#13 — E4 Vòng đời tuyến giao](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/13) | 49 | Tuyến đã công bố bị khoá theo **phiên bản bộ quy tắc tại thời điểm công bố**; đổi luật không hồi tố tuyến cũ |
| `FR-SCH-02/03` · `OPS-LAW-01` · `ADR-006` · `DD-RTE-001` §4.2–4.3 · `SC4-04` §6 · `GAP-01/27` | [#14 — E10 Giới hạn giờ lái 2024](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/14) | 61 | **Epic độc lập theo yêu cầu của đề**, không gộp vào E4. 改善基準告示 / 物流2024年問題 là ràng buộc **pháp lý lao động**: tuyến vi phạm **cấm công bố**. 16 issue mang nhãn `constraint-2024`. Hiện [#71](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/71) **bị chặn**, chờ khách chốt số phút nghỉ tối thiểu mỗi đoạn |
| `SC4-05` · `DD-ALM-001` · `FR-TEMP-01`…`04` · `BR-TEMP-01` · `IF-LOG-01` · `ADR-005` | [#15 — E5 Cảnh báo nhiệt thành hồ sơ HACCP](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/15) | 50 | Cửa sổ đánh giá 24 giờ tính ngược từ **bản ghi đo mới nhất**, không từ đồng hồ máy chủ — cùng một tập dữ liệu phải cho cùng kết quả ở mọi lần chạy |
| `BR-HACCP-01` · `GAP-24` · PREMISE §1 dòng *Màn mới: Hàng đợi hồ sơ HACCP* | [#16 — E6 Hàng đợi hồ sơ HACCP](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/16) | 20 | **Màn LAB-4 không có**, PREMISE chốt thêm. **Bẫy ⑥** HACCP bắt buộc từ 6/2021; hàng đợi **không tự đóng** cho tới khi đủ hồ sơ |
| `SC4-06` · `FR-TRC-01` · `BR-TRACE-01/02/03` · `GAP-14/21` | [#18 — E8 Truy xuất nguồn gốc](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/18) | 28 | **Bẫy ⑤** truy xuất **bắt buộc theo luật chỉ với gạo và thịt bò**, mã nhận dạng bò đúng 10 chữ số; mặt hàng khác là khuyến khích — không siết nhầm thành bắt buộc |
| `SC4-07` · `BR-TEMP-01` · `BR-DELWIN-01` · `DR-MST-01` · `ADR-004/005` · `GAP-05/15` | [#1 — E9 Ngưỡng nhiệt có phiên bản & master](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/1) | 20 | **Bẫy ①** ngưỡng 3 dải là **chính sách khách tự công bố**, có phiên bản, tra theo mốc đo; đúng biên là ĐẠT. Epic duy nhất **đã đóng trọn** trong Sprint 1 |
| `GAP-07/08` · PREMISE §1 dòng `NFR-SEC-03` · PREMISE §2 ba dòng còn treo với khách | [#17 — E7 Khoá bảng sổ, siết vai, chốt điểm treo](https://github.com/vandt-0395-01/lab5-coldchain-B120395/issues/17) | 21 | Ba bảng chỉ-ghi-thêm bị khoá cả đường `TRUNCATE`; RPC tự đọc `profiles` kiểm vai thay vì tin tham số gọi vào. Chứa các issue vai PM đi hỏi khách |

Bảy mã màn `SC4-01`…`SC4-07` đều có issue. Hai epic không gắn thẳng vào một màn là **E10** (tách
riêng theo yêu cầu của đề) và **E7** (việc xuyên suốt: quyền, bất biến dữ liệu, câu hỏi cho khách).
