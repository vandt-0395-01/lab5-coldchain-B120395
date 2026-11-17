# Break task — từ specs LAB-4 ra backlog

**10 epic · 103 issue · 23 sub-issue.** Nguồn: 7 screen spec, 4 detail design, 29 dòng sổ gap và 6
quyết định ở [`PREMISE.md`](PREMISE.md). Dữ liệu gốc: [`backlog.csv`](backlog.csv).

Phân theo vai: 77 BE · 24 FE · 17 QA · 8 PM.

---

## 1. Nguyên tắc chia task

### Độ hạt — chia tới đâu thì dừng

| Luật | Nội dung |
|---|---|
| Trần thời gian | Đề bài yêu cầu một issue làm xong trong **≤ 2 ngày công (16 giờ)**, vượt thì tách sub-issue. **Backlog này chưa đạt trần đó** — xem mục *Trần 16 giờ: chưa đạt* ngay dưới |
| Một issue = một việc | Tiêu đề phải là một hành động. **Cấm** issue kiểu *"Làm màn Đơn xuất"* — đó là một epic, không phải một task |
| Một luật nghiệp vụ = một issue | Sáu bẫy nghiệp vụ không bao giờ gộp vào nhau, cũng không gộp vào issue dựng màn. Lý do: mỗi luật có ca biên riêng và người review khác nhau |
| Tách theo vai | Phần máy chủ, phần giao diện và phần kiểm thử là **ba issue**, không phải ba việc trong một issue. Trường `Role` trên Project ghi vai, và đó cũng là cơ sở quy SWP ra giờ |
| Mỗi dòng gap một issue | 21 dòng gap đã phân *"LAB-5"* đều có ít nhất một issue mang mã gap ở cột `spec`. Không dòng nào bị gộp chìm vào issue khác |

### Khi nào tách sub-issue

Tách khi việc **chia được theo tầng hoặc theo nhóm dữ liệu** mà vẫn chung một định nghĩa xong:

- Một luật phải phủ **nhiều cửa sổ thời gian** — `E10-I6` (#75) chia 3 sub cho ngưỡng nhiều ngày / tuần / tháng–năm.
- Một việc có **vế máy chủ và vế giao diện dính chặt** nhau, review cùng lúc — `E5-I9` (#91) và `E5-I9-S1` (#127).
- Một bảng cần **ràng buộc tầng CSDL kèm bài kiểm chứng** — `E4-I9` (#68) và 3 sub của nó. Ví dụ này **cũng vi phạm trần**: `E4-I9-S2` = 36 giờ và `E4-I9-S3` = 24 giờ, đều nằm trong nhóm 72 dòng vượt ở mục dưới. Nó minh hoạ *cách* tách, không minh hoạ một kết quả đã đạt trần.

### Trần 16 giờ: chưa đạt

**Đo trên `backlog.csv`.** Lọc dòng không phải `type=epic`, không có sub-issue, `hours > 16`: **72 trên 107 dòng được chấm trực tiếp** vượt trần. Theo vai: **53 BE · 16 QA · 3 FE**. Nhỏ nhất trong nhóm vượt là 17,2 giờ. Lớn nhất là `E10-I9` = **69,0 giờ**, gần 9 ngày công cho một issue. Vài dòng nặng khác: `E3-I5` 62,1 giờ · `E3-I9` 54,0 giờ · `E2-I4`, `E3-I14`, `E3-I15` đều 41,4 giờ.

**Nguyên nhân gốc: hai thước đo chưa bao giờ được đối chiếu với nhau.**

1. Lúc **bẻ task**, trần "≤ 2 ngày công" được áp bằng cảm nhận về *phạm vi* một issue.
2. Lúc **quy ra giờ** (`estimate.md`), công thức `giờ = SWP_cuối × hệ_số[vai] × buffer` mới cho ra *thời lượng*. Hệ số BE khoảng 5 giờ/SWP, nên một issue 5 SWP đã ra ~28,75 giờ — vượt trần ngay, dù phạm vi của nó vẫn gọn.

Chỉ khi review chéo đặt hai con số cạnh nhau thì mâu thuẫn mới lộ ra. Nó không phải lỗi đánh máy mà là lỗi quy trình: không bước nào kiểm "giờ ≤ 16" sau khi giờ được tính.

**Cách đã chọn: khai thật, giữ nguyên backlog và Project.** PM chốt không bẻ lại ở vòng này, để giữ số liệu Sprint 1 và báo cáo tiến độ đã khớp nhau. Hệ quả: backlog nộp đi vẫn còn 72 issue to hơn trần đề bài.

**Việc phải làm trước khi chạy thật:**

- Nhóm vượt **36 giờ** — **11 dòng**: `E2-I4`, `E3-I5`, `E3-I9`, `E3-I14`, `E3-I15`, `E4-I8`, `E5-I5`, `E5-I7`, `E5-I14`, `E10-I3`, `E10-I9`. Bẻ thành sub-issue ≤ 16 giờ, chấm lại SWP, đẩy lại Project, **trước sprint đầu**.
- Nhóm **17–36 giờ** — **61 dòng**: rà lại từng dòng khi lập sprint; tách khi issue vào sprint mà không nhét vừa một người trong 2 ngày công. (11 + 61 = 72, khớp con số ở trên.)

### Định nghĩa xong (Definition of Done)

Mọi issue có cột `dod` trong `backlog.csv`, viết **một câu kiểm chứng được**. Ba mức:

| Loại issue | Xong nghĩa là |
|---|---|
| BE / FE | Hành vi mô tả trong câu DoD chạy đúng trên môi trường thật, và đổi ngược lại thì có bài kiểm chuyển đỏ |
| QA | Bài kiểm **đỏ trên code trước khi sửa**, xanh sau khi sửa. Một bài kiểm chưa bao giờ đỏ thì chưa phải bài kiểm |
| PM (8 issue hỏi khách) | Khách trả lời **bằng văn bản**, và câu trả lời được ghi vào `PREMISE.md` |

### Epic → issue → sub-issue trên Project

- **Epic** = một issue mang nhãn `epic`, là vật chứa. Không chấm riêng và không gán vai. Trên Project, epic **có** giá trị `SWP` và `Hours`, nhưng đó là tổng cộng dồn của các con, không phải số ước lượng của chính epic (ví dụ `E10`).
- **Issue** = con của epic qua quan hệ sub-issue của GitHub, mang `SWP`, `Hours`, `Role`, `Status`, `Iteration`.
- **Sub-issue** = con của issue. Cũng mang đủ trường, vì nó cũng là việc ai đó phải làm.
- Nhãn: tên epic · `constraint-2024` cho 16 issue chịu ràng buộc giờ lái (cộng epic `E10`, tổng 17 dòng mang nhãn) · `trap` cho issue chạm bẫy nghiệp vụ.

---

## 2. Spec → issue

| Epic | Tên | Số item | Chia vai | Spec nguồn |
|---|---|---|---|---|
| `E1` | Kiểm hàng nhập | 12 | 9 BE · 2 FE · 1 QA | `SC4-01`, `DD-RCV-001`, `GAP-04`, `GAP-20` |
| `E2` | Tồn kho 3 dải nhiệt | 8 | 4 BE · 3 FE · 1 QA | `SC4-02`, `GAP-22` |
| `E3` | Đơn xuất và phân bổ lô | 23 | 15 BE · 3 FE · 4 QA · 1 PM | `SC4-03`, `DD-OUT-001`, `GAP-06/16/17/19/23` |
| `E4` | Vòng đời tuyến giao | 13 | 9 BE · 2 FE · 1 QA · 1 PM | `SC4-04`, `DD-RTE-001`, `GAP-03/13/28/29` |
| `E5` | Cảnh báo nhiệt → hồ sơ HACCP | 21 | 14 BE · 5 FE · 2 QA | `SC4-05`, `DD-ALM-001`, `GAP-02`, `PREMISE` |
| `E6` | Hàng đợi hồ sơ HACCP | 7 | 3 BE · 2 FE · 1 QA · 1 PM | `GAP-24`, `PREMISE` — **chưa có screen spec** |
| `E7` | Nền tảng, quyền, việc hỏi khách | 9 | 4 BE · 2 QA · 3 PM | `GAP-07/08/09/18/26`, `PREMISE` |
| `E8` | Truy xuất nguồn gốc | 9 | 4 BE · 3 FE · 2 QA | `SC4-06`, `GAP-14`, `GAP-21` |
| `E9` | Master và ngưỡng nhiệt | 8 | 4 BE · 3 FE · 1 QA | `SC4-07`, `GAP-05`, `GAP-15` |
| `E10` | **Giới hạn giờ lái xe 2024** | 16 | 11 BE · 1 FE · 2 QA · 2 PM | `SC4-04`, `DD-RTE-001`, `GAP-01`, `GAP-27` |

Chi tiết từng issue — tiêu đề, spec nguồn, định nghĩa xong, phụ thuộc, vai — ở
[`backlog.csv`](backlog.csv).

### Phần spec chưa thành issue, và vì sao

| Phần spec | Vì sao chưa thành issue |
|---|---|
| `FR-INV-01/02/03` — put-away và di chuyển trong kho | Không chạm bẫy nghiệp vụ nào. `PREMISE.md` mục 3 điểm 5 chốt để ngoài: đưa vào thì backlog phình gấp rưỡi mà không thêm giá trị tuân thủ nào cho khách |
| `FR-OUT-03/04` — danh sách lấy hàng trên thiết bị cầm tay | Như trên. Tốn công dựng giao diện thiết bị, không chứa luật nghiệp vụ nào của RFP |
| `FR-TRC-02` — thu hồi hàng loạt | Như trên. Là một luồng nghiệp vụ riêng, đáng một vòng đặc tả của chính nó |
| `FR-RPT-02` — xuất hồ sơ kiểm toán | Như trên |
| `NFR-SEC-01` — SSO/OIDC và xác thực hai lớp | `GAP-10` xếp mức Thấp, đã khai *Chấp nhận giữ nguyên có lý do*. Là việc hạ tầng, không phải việc sản phẩm |
| `NFR-AUD-01` — màn tra cứu nhật ký kiểm toán | Dữ liệu đã giữ chỉ-ghi-thêm ở tầng bảng (`E7-I1` (#103)); phần còn thiếu chỉ là màn tra cứu |
| `NFR-LOC-01` — giao diện tiếng Nhật | Quyết định sản phẩm, không phải việc kỹ thuật. Cần khách chốt trước |
| 12 mã yêu cầu phi chức năng (gồm ba mã nêu trên) | Sổ yêu cầu có **12 mã NFR** và bảng NFR **không có cột ưu tiên** — cột thứ ba là *cách nghiệm thu*. Nên không mã nào có mức ưu tiên xác minh được; mọi mức đã xếp là **suy luận, không phải trích dẫn** (`PREMISE.md` mục 3 điểm 4). Gom thành một issue hỏi khách (`E7`) thay vì đoán rồi tính tiền trên cái đoán |
| 3 dòng gap đã khai *Chấp nhận*: `GAP-10`, `GAP-11`, `GAP-12` | Sổ gap ghi rõ lý do chấp nhận cho từng dòng. Mở lại ở LAB-5 là xé quyết định đã chốt của LAB-4 |
| 3 dòng gap *Chờ khách*: `GAP-09`, `GAP-18`, `GAP-26` | Chờ khách trả lời. Đã có issue hỏi khách ở `E7`: `E7-I5` cho `GAP-09`, `E7-I4` cho `GAP-26`; `GAP-18` đã có `E7-I3` + `E7-I3-S1` cho phần mã hoá, phần còn lại chờ khách |
| 2 dòng gap *Chờ PM ký*: `GAP-24`, `GAP-25` | `PREMISE.md` đã chốt đưa cả hai vào LAB-5, nên **có** issue: `GAP-24` thành epic `E6`. `GAP-25` (chín yêu cầu P0 vắng khỏi thân spec) phủ rải qua các epic. Cột `spec` không mang chuỗi `GAP-25` mà mang **mã yêu cầu**, nên tra theo mã: `BR-HACCP-01` → `E6-I1`…`E6-I6` (#97–#102) · `FR-OUT-05` → `E3-I14`, `E3-I15`, `E3-I16`, `E3-I22` (#51–#53, #59) · `FR-TEMP-01` → `E5-I10`, `E5-I11` (#92, #93) · `FR-TEMP-04` → `E5-I12` (#94). Sáu mã còn lại (`FR-INV-03`, `FR-OUT-04`, `FR-TRC-02`, `FR-RPT-02`, `NFR-SEC-01`, `NFR-AUD-01`) `PREMISE.md` chốt để ngoài kèm lý do |
| Các màn ngoài 7 màn cốt lõi | Bảng điều khiển, lịch sử giao, dữ liệu cảm biến, các trang chi tiết — `specs/_index.md` đã ghi lý do không viết spec chi tiết ở LAB-4, nên không có gì để bẻ |

---

## 3. Hạng mục chịu ràng buộc đặc thù của đề

Ràng buộc của Product B là **giới hạn giờ lái xe tải từ 2024** (物流2024年問題, bộ ngưỡng 改善基準告示).
Nó là **epic `E10` độc lập**, không nằm trong `E4` Vòng đời tuyến giao.

| Ràng buộc | Issue | Vì sao tách riêng |
|---|---|---|
| Ba ngưỡng trong một ngày tuyến — prototype đã làm | `E10-I1` (#70) | Phần duy nhất đang chạy. Tách ra để thấy rõ phần còn lại là bao nhiêu |
| Bộ đếm lái liên tục, reset bằng quãng **休憩** đủ dài | `E10-I2` (#71) | Là một máy trạng thái chạy dọc chuỗi đoạn tuyến, không phải một phép so sánh. Sai nó là sai toàn bộ phép kiểm trong ngày |
| Bộ quy tắc giờ lái **có phiên bản**, không hồi tố tuyến đã công bố | `E10-I3` (#72) | Luật có thể đổi. Tuyến đã công bố phải giữ cách chấm cũ — cùng khuôn với `ADR-005` của ngưỡng nhiệt |
| Nguồn dữ liệu tích luỹ nhiều ngày | `E10-I5` (#74) | Sáu ngưỡng còn lại đều cần lịch sử tuyến của **cùng tài xế**, thứ hiện không có ai dựng |
| **Sáu ngưỡng chưa làm**, chia theo cửa sổ: nhiều ngày · tuần · tháng · năm | `E10-I6` (#75) + 3 sub | `GAP-01` mức **Cao**: prototype mới phủ 3/9 ngưỡng. Mỗi cửa sổ có nguồn dữ liệu và ca biên khác nhau nên không gộp được vào một issue ≤ 2 ngày công |
| Mã lỗi và mã thông báo cho vi phạm mới | `E10-I7` (#76) | Phải mở danh mục trước khi code, nếu không mỗi người tự chế một mã |
| Vi phạm tầng CSDL bắt được nghèo thông tin hơn tầng API | `E10-I8` (#77) | `GAP-27`. Trên nhánh đua, người dùng mất khoảng thời gian vi phạm — đúng thứ `FR-SCH-02` đòi hiển thị |
| Tầng CSDL kiểm lại sau khi khoá, đối chiếu với hàm thuần | `E10-I9` (#78) | Ràng buộc **cứng** thì không được chỉ sống ở tầng API. `ADR-001` và hai lỗ hổng mức Cao của LAB-2 đều sinh ra từ luật chỉ phủ một nửa đường ghi |
| Giao diện hiện vi phạm và khoá nút công bố | `E10-I10` (#79) | Vi phạm phải **chặn**, không phải cảnh báo bỏ qua được |
| Hai bài kiểm ca biên — trong ngày và tích luỹ | `E10-I11` (#80), `E10-I12` (#81) | Ca biên của giờ lái là chỗ dễ sai nhất: đúng biên là đạt hay không đạt |
| Chốt hai điểm `CẦN XÁC NHẬN` và `OPS-LAW-01` với khách | `E10-I13` (#82) | RFP ghi *"lái liên tục tối đa 4 giờ"* nhưng **không ghi số phút nghỉ** reset bộ đếm. Không có số này thì `E10-I2` (#71) không viết nổi |

**Tổng: 16 issue + 1 epic (`E10`) mang nhãn `constraint-2024`.**

Phụ thuộc chéo đã ghi trong `backlog.csv`: `E4-I8` (#67) (công bố tuyến) phụ thuộc `E10-I1` (#70) và `E10-I3` (#72) —
không có bộ luật giờ lái thì không công bố được tuyến nào.

### Một ràng buộc cố tình **không** đưa vào epic này

`PREMISE.md` mục 3 điểm 1 chốt **HACCP không chặn việc lập lịch giao hàng**. Sổ yêu cầu LAB-1 dòng
275 nói thẳng RFP không gắn hai thứ đó với nhau; HACCP chặn ở xác nhận nhập/xuất (`E1`, `E3`) và
sinh hàng đợi hồ sơ (`E6`). Nếu khách xác nhận cần gắn, phát sinh **1 issue** ở `E4`.

---

## 4. Chỗ hở hoặc mâu thuẫn của spec LAB-4 phát hiện khi break

**67 chỗ.** Không dòng nào chép lại từ `specs/database/gap-list.md` — sổ gap nói chỗ *prototype làm
khác thiết kế*; bảng này nói chỗ *thiết kế không đủ để một dev ngồi xuống làm mà không hỏi lại*.

Phân loại cột Xử lý, đếm lại bằng script trên 67 dòng của [`findings/`](findings/): **43** cần giả
định mới · **12** cần issue làm rõ với khách · **5** đã có trong `PREMISE.md` · **7** để mở có lý do.
Cộng lại đúng 67.

Con số 67 tự nó là một kết quả. Bộ specs LAB-4 đã qua một vòng review chéo bốn góc và xanh cả bốn
cổng kiểm tự động, mà bẻ ra task vẫn lộ ra 67 chỗ phải hỏi lại. Đọc tài liệu không bắt được chúng;
chỉ việc ngồi viết định nghĩa xong cho từng task mới bắt được.

*Căn cứ cho câu "xanh cả bốn cổng kiểm": `specs/AI-report.md` của LAB-4, mục bốn cổng kiểm. Bản ghi
chạy cổng nằm ở repo LAB-2 (private) và **không chép sang repo này**, nên người đọc repo công khai
này không tự đối chiếu được.*

### Năm chỗ nặng nhất

| # | Spec | Chỗ hở hoặc mâu thuẫn | Xử lý |
|---|---|---|---|
| 1 | `DD-OUT-001` §4.3 bước 2 vs §5 | **Mâu thuẫn trong cùng một file** về mốc so 日付逆転: §4.3 nói lấy dòng `completed_at` lớn nhất, §5 nói lấy hạn **nhỏ nhất** của chuyến gần nhất. Một chuyến nhiều lô thì hai cách ra hai kết quả — mà hàm thuần lúc phân bổ và trigger `SHP01` lúc giao **bắt buộc dùng chung một mốc**, không thì tầng bảng chặn đúng thứ tầng phân bổ vừa cho qua | **Đã sửa thiết kế** → `PREMISE.md` mục 1. Đối chiếu trigger `0011` (`order by completed_at desc, expiry_date asc limit 1`): luật đúng là **cả hai vế**. Còn một điều kiện chưa bảo đảm — mọi lô của cùng một lần giao phải mang cùng `completed_at` — đã ghi thành câu hỏi khách |
| 2 | `DD-RTE-001` §4.3 vs §5 | **拘束時間 đang tính theo *tuyến*, trong khi luật tính theo *ngày làm việc của tài xế***. Không gì cấm một tài xế chạy hai tuyến cùng ngày, không luật nào cộng dồn — hai tuyến 8 giờ đều "đạt" trong khi tài xế đã làm 16 giờ | **Cần giả định mới**: chấm theo tài xế/ngày, ghi trong DoD của `E10-I4` (#73). **Cần khách xác nhận trước khi chốt giá** — đây là lỗ hổng cho phép hệ thống báo đạt trên một ngày vi phạm luật |
| 3 | `SC4-03`, `DD-OUT-001` | **"Tồn khả dụng" không có định nghĩa ở bất kỳ spec nào**, trong khi `M_31` và bước đọc lại tồn trong giao dịch đều dựa vào nó | **Cần giả định mới**. Là bước đầu của chuỗi sáu phép loại — sai định nghĩa là sai cả chuỗi |
| 4 | `SC4-07`, `ADR-005`, `SER-16` | `temp_policies.effective_to` **không có đường ghi nào**: `SER-16` luôn ghi `null`, phiên bản cũ bị chặn cập nhật, giao diện không hiện cột này. Hàm phân giải *có* xử lý `effective_to` đúng, nhưng nhánh đó **chết**, nên trên thực tế việc chọn phiên bản chỉ dựa vào `effective_from` lớn nhất ≤ thời điểm đo. Không spec nào nói ai đóng kỳ hiệu lực | **Cần giả định mới** — ghi vào DoD của `E9-I4-S1` (#9). Đây là lõi của bẫy ①: hỏng chỗ này là chấm sai toàn bộ hồ sơ HACCP |
| 5 | `BR-HACCP-01`, `COLDCHAIN_DATABASE` | **Hai trong năm nhịp ghi chép HACCP không có bảng nào lưu, không màn nào nhập** — vệ sinh mỗi ca, và khách/tài xế mỗi lượt. Hàng đợi tính đầy đủ hồ sơ không thể tính trên thứ không tồn tại | **Cần issue làm rõ với khách** → `E6-I1` (#97), và nó **chặn** `E6-I2` (#98). Toàn bộ epic `E6` phụ thuộc câu trả lời này |

### Toàn bộ 67 chỗ

Mỗi epic một file, giữ nguyên văn của vòng bẻ task:

| File | Số chỗ hở | Phạm vi |
|---|---|---|
| [`findings/E1-E2.md`](findings/E1-E2.md) | 13 | Kiểm hàng nhập, tồn kho |
| [`findings/E3.md`](findings/E3.md) | 15 | Đơn xuất và phân bổ lô |
| [`findings/E4-E10.md`](findings/E4-E10.md) | 9 | Vòng đời tuyến, giờ lái 2024 |
| [`findings/E5-E6.md`](findings/E5-E6.md) | 22 | Cảnh báo nhiệt, hàng đợi HACCP |
| [`findings/E7-E8-E9.md`](findings/E7-E8-E9.md) | 8 | Nền tảng, truy xuất, master |

### Hai chỗ đã sửa thiết kế ngay trong vòng này

Cả hai là lỗi của LAB-4, ghi thành dòng trong [`PREMISE.md`](PREMISE.md) mục 1:

- **`M_76` gán sai ở `SC4-05` §6bis.** Trần 1000 bản ghi trả HTTP 422 — lỗi dữ liệu đầu vào — nhưng
  `M_76` là câu của lỗi 500 *"Hệ thống gặp lỗi"*. Người dùng gặp dữ liệu quá dày sẽ đi báo quản trị
  thay vì thu hẹp khoảng thời gian. Cấp mã riêng **`M_77`**.
- **Mốc so 日付逆転** — mục 1 của bảng trên.

### Một mâu thuẫn tài liệu còn để mở

`SC4-03` §3bis ghi `BR-EXP-02` và `BR-POD-01` *"chưa có dòng nào trong sổ gap"*, trong khi sổ gap đã
có `GAP-22` và `GAP-23`. Ai bẻ task theo §3bis sẽ mở issue trùng. **Để mở**: sổ gap là bản mới hơn,
và việc sửa §3bis không chặn ai làm gì — nhưng phải sửa trước vòng bẻ task tiếp theo.
