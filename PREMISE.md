# Tiền đề LAB-5 — backlog khác bản LAB-4 ở đâu

Bản LAB-4 được break: nộp **16/11/2026**, bộ `specs/` chép nguyên vào repo này.

LAB-4 để lại **6 điểm chưa chốt** (`specs/PENDING.md`, cộng 5 dòng gap mang trạng thái *Chờ khách*
hoặc *Chờ PM ký*). Bẻ task thì không né được: mỗi điểm quyết định có hay không một nhóm issue. Mục
3 chốt cả 6; mục 1 ghi những chỗ vì thế mà spec phải đổi; mục 2 ghi những chỗ phải đặt giả định.

Mã issue trong file này là **mã tạm** (`E1-I3` (#21)…). Sau Bước 5 chúng được thay bằng `#số` thật trên
GitHub Project.

---

## 1. Spec thêm / bỏ / sửa so với LAB-4

| Spec (mã/file) | Thêm/Bỏ/Sửa | Trước → sau | Vì sao | Issue bị ảnh hưởng |
|---|---|---|---|---|
| **Màn mới: Hàng đợi hồ sơ HACCP** (LAB-4 không có) | **Thêm** | Không có màn nào cho `BR-HACCP-01` → thêm một màn và một epic riêng | `specs/database/gap-list.md` → `GAP-24` mức **Cao**, *Chờ PM ký*: *"`BR-HACCP-01` đòi sinh hàng đợi completeness, không tự đóng cho tới khi đủ hồ sơ"*. `specs/PREMISE.md` mục 1 cấm xếp yêu cầu **chạm bẫy nghiệp vụ** thành lựa chọn phạm vi. PM ký: đưa vào | `E6-*` |
| `SC4-03` Đơn xuất — kiểm nhiệt khi **XUẤT** | **Thêm** | Chỉ kiểm nhiệt chiều nhập → kiểm cả chiều xuất, lưu lại được kết quả | `GAP-16` mức **Cao**: *"Không kiểm nhiệt khi XUẤT hàng. Không bảng nào lưu kết quả kiểm trước xuất"*. Chạm bẫy ①; `BR-TEMP-02` và `FR-OUT-05` đều P0 | `E3-*` |
| `SC4-05` Cảnh báo nhiệt — nguồn dữ liệu đo | **Thêm** | Dữ liệu đo seed sẵn → nhập được tệp CSV của thiết bị ghi nhiệt | `FR-TEMP-01` nằm trong 9 mã P0 vắng mặt (`GAP-25`); `IF-LOG-01` được đưa vào cùng để bổ sung riêng, không thuộc 9 mã đó (xem mục 3 điểm 5). Không có đường nhập dữ liệu thật thì `SC4-05` không chạy được trên dữ liệu khách | `E5-*` |
| `SC4-05` + `ALM_EXCURSION_EVAL_DETAIL.md` — dung sai đợt vượt ngưỡng | **Sửa** | Một bản ghi đơn lẻ ngoài ngưỡng cũng sinh cảnh báo (0 phút) → thêm tham số dung sai có cấu hình, **mặc định 0 phút** | `specs/PENDING.md` → `P-12`. Mặc định 0 giữ nguyên nghĩa pháp lý của hồ sơ hiện tại; làm tham số để khách chỉnh được mà không sửa mã nguồn | `E5-*` |
| `SC4-05` — hồ sơ xử lý sai lệch | **Thêm** | Chỉ có ô "ghi xử lý" lúc đóng cảnh báo → hồ sơ sai lệch có vòng đời riêng | `FR-TEMP-04` P0, vắng mặt theo `GAP-25`. `specs/_common/error-codes.md` đã có `ALM03` (đóng cảnh báo phải có ghi chú) nhưng một dòng ghi chú chưa phải một hồ sơ | `E5-*` |
| `SC4-05` §6bis + `_common/error-codes.md` — mã thông báo cho cửa sổ quá dày | **Sửa** | Dùng `M_76` ("Hệ thống gặp lỗi, thao tác chưa được ghi") → cấp mã riêng **`M_77`** ("Khoảng thời gian cần chấm có quá nhiều bản ghi đo nên chưa chấm") | **Lỗi của LAB-4, phát hiện khi bẻ task `E5-I3` (#85).** Trần 1000 bản ghi trả HTTP 422 — lỗi của *dữ liệu đầu vào*, không phải lỗi hệ thống. Gán `M_76` thì người dùng đọc ra "hệ thống hỏng" và đi báo quản trị, trong khi việc cần làm là thu hẹp khoảng thời gian. **Việc còn treo:** `M_77` đã vào `specs/_common/error-codes.md` nhưng **chưa áp** vào `specs/alarms/detail-design/ALM_EXCURSION_EVAL_DETAIL.md` (`grep -c "M_77"` ra 0 ở file đó). Có người khác đang sửa file spec đó; PREMISE chỉ ghi nhận, không sửa | `E5-I3` (#85) |
| `docs/scope.md` | **Thêm** | Không chép sang repo LAB-5 ở Bước 0 → chép đủ | `SC4-05` §3bis/§5/§6 và `DD-ALM-001` §5 trỏ tới file này ở bốn chỗ để lấy căn cứ phạm vi. Thiếu nó thì mọi lập luận phạm vi của màn cảnh báo treo vào một đường dẫn chết | — |
| `specs/outbound/detail-design/OUT_ALLOCATION_DETAIL.md` — luật bẫy ④ 日付逆転 | **Sửa** | Luật so hạn lô chưa nói rõ lấy lần giao nào làm mốc → chọn lần giao gần nhất của đúng cặp khách × SKU; cùng mốc thời gian thì lấy hạn nhỏ nhất | Bẫy ④: so với lô đã giao trước đó cho **cùng khách**, không so với ngày hôm nay. Sửa ở commit `df6b647` (bước 2), cùng lượt với `error-codes.md` và `SC4-05` | `E3-I4`, `E3-I5`, `E3-I19` |
| `NFR-SEC-03` — mã hoá dữ liệu lưu trữ | **Thêm** | Chỉ mã hoá đường truyền → xét thêm mã hoá CSDL và tệp đính kèm | `GAP-18`: *"mã hoá CSDL, file đính kèm và hàng đợi offline **chưa xét**"*. Sổ yêu cầu **không ghi mức ưu tiên** cho mã này (bảng NFR không có cột đó). Giữ trong phạm vi vì mã hoá dữ liệu cá nhân là nghĩa vụ pháp định, không phụ thuộc mức ưu tiên khách xếp. Vế hàng đợi ngoại tuyến để ngoài vì bản này không có chế độ đó | `E7-*` |

**Không sửa gì khác ngoài các dòng trên.** Các screen spec và detail design còn lại của LAB-4 giữ nguyên nội dung; LAB-5
chỉ bẻ chúng ra task.

---

## 2. Giả định bổ sung

Có hai loại dòng, tách riêng cho khỏi nhầm.

**Giả định lấp chỗ để ngỏ** (đề cho phép): mỗi dòng lấp một chỗ RFP hoặc spec không nói tới.

**Chọn giữa hai câu RFP mâu thuẫn** (không phải giả định lấp chỗ trống): điểm 2 ngay dưới đây. Đề chỉ cho
giả định lấp chỗ để ngỏ, nên điểm này được khai riêng, kèm rủi ro, không giấu trong bảng giả định.

### 2.1 Chọn tạm một vế của câu RFP tự mâu thuẫn

RFP nêu hai câu không khớp nhau về khoá của ngưỡng nhiệt:

- `BR-TEMP-01`: ngưỡng nhiệt theo **dải** nhiệt độ.
- `FR-TEMP-02` (mức **P0**, `docs/01_requirements-extract.md:97`): *"Đánh giá từng reading theo chính sách SKU/zone hiệu lực; lưu first/last/peak/duration, phiên bản ngưỡng, danh sách lô bị ảnh hưởng"*, tức theo SKU/khu.

**Chọn tạm vế `BR-TEMP-01`** (khoá theo dải, `ADR-005`, bảng `temp_policies`) để backlog chạy được. Đây là chọn một
trong hai câu RFP, không phải lấp chỗ trống. Đi kèm issue hỏi khách `E7-I4`, phải có trả lời trước khi chốt giá.
**Rủi ro đổi mô hình dữ liệu:** nếu khách chốt theo SKU/khu thì phải đổi khoá bảng `temp_policies` và mọi chỗ
đọc ngưỡng, ước thêm 15–20 SWP, chưa tính trong LAB-5.

### 2.2 Giả định lấp chỗ để ngỏ

| Giả định | Chỗ spec/RFP để ngỏ | Ảnh hưởng tới issue / estimate |
|---|---|---|
| Dung sai đợt vượt ngưỡng **mặc định 0 phút**, đặt thành tham số cấu hình | RFP không nêu dung sai nào cho cảnh báo nhiệt (`P-12`) | +1 issue ở `E5` (`E5-I13`). Khách chốt số khác thì chỉ đổi dữ liệu cấu hình, **không đổi estimate** |
| Nhân viên kho **sửa chéo phiếu nhập của nhau là hợp lệ** | `GAP-09` ghi hai vế: *"**Có thể là thiết kế đúng** — kho chạy ca kíp thì ca sau sửa phiếu ca trước là bình thường"*, và hệ quả là sửa chéo thì **ghi đè được cột người kiểm trong hồ sơ HACCP** `[CẦN XÁC NHẬN]` | +1 issue làm rõ ở `E7` (`E7-I5`). Không siết quyền ở LAB-5: siết nhầm là chặn nghiệp vụ thật đang chạy. **Rủi ro:** giữ nguyên thì hồ sơ HACCP có thể bị ghi đè người kiểm. Điểm này cũng sát `NFR-SEC-02` của RFP (quyền tối thiểu, tách người lập – người duyệt), nên hỏi khách trước khi coi là xong |
| **11 trong 12 mã NFR không vào backlog**, chỉ `NFR-SEC-03` vào; hỏi khách mức ưu tiên | Sổ yêu cầu có đúng **12 mã NFR** (`NFR-ACC-01`, `NFR-AUD-01`, `NFR-AVL-01`, `NFR-AVL-02`, `NFR-BCP-01`, `NFR-LOC-01`, `NFR-OPS-01`, `NFR-PERF-01`, `NFR-PERF-02`, `NFR-SEC-01`, `NFR-SEC-02`, `NFR-SEC-03`) và bảng NFR **không có cột ưu tiên**, nên không mã nào có mức ưu tiên xác minh được (`P-04`) | +1 issue làm rõ ở `E7` (`E7-I6`) gom 11 mã còn lại. Không bẻ task cho chúng ở LAB-5 |
| Sprint 2 tuần = **10 ngày công**, đội phát triển 4 người (2 BE, 1 FE, 1 QA). **PM/BrSE là chính người làm bài (PL)**, không phải đầu người thứ 5 của đội | Đề LAB-5 không quy định quy mô đội hay độ dài sprint | Quyết định sức chứa Sprint 1, và do đó quyết định issue nào rơi sang Sprint 2. Project có 8 item `Role = PM`: giờ việc PM tính **tách riêng**, không cộng vào năng lực đội |
| Người phụ trách ghi trong thân issue là **vai trò giả định**, không phải người thật | Project V2 chỉ gán được tài khoản có quyền trên repo | Không ảnh hưởng estimate. Trường `Assignees` để trống; vai trò ghi ở thân issue và ở trường `Role` |

---

## 3. Hướng đã chốt

Sáu điểm LAB-4 để ngỏ. Mỗi điểm chốt **một** phương án.

| Vấn đề | Các phương án ở LAB-4 | Phương án chốt | Vì sao |
|---|---|---|---|
| **1. HACCP có chặn việc lập lịch giao hàng không?** | (a) Chặn — theo câu chữ bẫy ⑥ của chỉ dẫn nội bộ. (b) Không chặn ở cổng đó — suy ra từ sổ yêu cầu LAB-1 | **(b) Không chặn lập lịch.** HACCP vẫn là ràng buộc **cứng**, nhưng ở hai cổng của nó: chặn **xác nhận nhập/xuất** (`BR-TEMP-02`, `FR-OUT-05`) và sinh **hàng đợi hồ sơ không tự đóng** (`BR-HACCP-01`) | `docs/01_requirements-extract.md` dòng 275: đoạn *"Hiểu đúng"* mang nhãn **`[SUY LUẬN]`**, là suy luận của người trích LAB-1, **không phải câu RFP**. Dòng đó tự kết bằng việc câu của chỉ dẫn nội bộ *"chưa có trong RFP → cần hỏi khách"*. Vậy (b) là suy ra từ sổ yêu cầu, **`[CẦN XÁC NHẬN]`**. Chọn (a) là thêm vào luồng công bố tuyến một phép kiểm chưa có căn cứ trong RFP → có thể sai báo giá. Nếu khách xác nhận cần, phát sinh 1 issue ở `E4`. **Việc còn treo:** backlog hiện **không có issue nào hỏi khách điểm này** (epic `E7` chỉ có `E7-I4`, `E7-I5`, `E7-I6`), trong khi `specs/PENDING.md` nói `P-10` phải hỏi trước vì ảnh hưởng báo giá |
| **2. Ngưỡng nhiệt tra theo dải hay theo mã hàng/khu?** (RFP tự mâu thuẫn, xem 2.1) | (a) Theo dải — `BR-TEMP-01`, `ADR-005`, bảng `temp_policies` hiện tại. (b) Theo mã hàng/khu — câu chữ `FR-TEMP-02` (P0) | **(a) Theo dải**, chọn tạm vế `BR-TEMP-01` để chạy được, kèm issue hỏi khách `E7-I4` | Bẫy ① của RFP nói ngưỡng 3 dải là **chính sách công ty tự công bố** — đơn vị công bố là dải, không phải mã hàng. `GAP-26` xếp mức Trung bình và ghi rõ đây là lệch **mô hình dữ liệu**. Đây là chọn một trong hai câu RFP, không phải lấp chỗ trống, nên là rủi ro đổi mô hình dữ liệu nếu khách chốt ngược lại. Đổi khoá bảng ngưỡng khi chưa có câu trả lời của khách là rước việc lớn nhất của dự án vào sprint đầu |
| **3. Dung sai cho đợt vượt ngưỡng nhiệt** | (a) Giữ nguyên — mọi bản ghi ngoài ngưỡng đều sinh cảnh báo. (b) Đặt ngưỡng cứng trong mã nguồn. (c) Tham số cấu hình, mặc định 0 | **(c) Tham số cấu hình, mặc định 0 phút** | RFP không nêu dung sai → giả định chỉ được **lấp chỗ để ngỏ**. Mặc định 0 giữ nguyên hành vi hiện tại nên không đổi nghĩa pháp lý hồ sơ HACCP; làm tham số để khách chốt số sau mà không phải sửa mã. (b) bị loại vì chôn một con số không ai kiểm chứng được vào mã nguồn — đúng loại lỗi `ADR-005` dựng ra để chặn |
| **4. Có bẻ task cho 12 mã yêu cầu phi chức năng không?** | (a) Đưa hết vào backlog. (b) Để ngoài hết. (c) Để ngoài, trừ mã nào có căn cứ P0 | **(c)** — sổ yêu cầu có **12 mã NFR, không mã nào có mức ưu tiên xác minh được**. Vào backlog: `NFR-SEC-03` (`E7-I3`). Không vào: 11 mã còn lại (`NFR-ACC-01`, `NFR-AUD-01`, `NFR-AVL-01`, `NFR-AVL-02`, `NFR-BCP-01`, `NFR-LOC-01`, `NFR-OPS-01`, `NFR-PERF-01`, `NFR-PERF-02`, `NFR-SEC-01`, `NFR-SEC-02`), gom thành **một issue hỏi khách mức ưu tiên** (`E7-I6`) | `P-04`: bảng NFR không có cột ưu tiên, nên mọi mức ưu tiên gán cho chúng là **suy luận, không có trích dẫn**. Đưa hết vào là đoán ưu tiên rồi tính tiền trên cái đoán đó. `NFR-SEC-03` là ngoại lệ vì lý do khác: mã hoá dữ liệu cá nhân là nghĩa vụ pháp định, không phụ thuộc mức ưu tiên khách xếp, và phần lớn làm được bằng cấu hình. Lưu ý: `NFR-SEC-01` và `NFR-AUD-01` có mặt trong danh sách 9 mã P0 vắng mặt ở LAB-2 (điểm 5), nhưng nhãn P0 đó **không kiểm được trong sổ yêu cầu của repo này** `[CẦN XÁC NHẬN]` |
| **5. `BR-HACCP-01` và 9 mã P0 vắng mặt, cùng vài mã khác — có vào LAB-5 không?** | (a) Để ngoài hết, vì đã khai "ngoài phạm vi prototype". (b) Đưa hết vào. (c) Đưa phần **chạm bẫy nghiệp vụ**, phần còn lại ghi lý do để ngoài | **(c)**, chia hai nhóm. **Nhóm 9 mã P0 vắng mặt** (`FR-INV-03`, `FR-OUT-04`, `FR-OUT-05`, `FR-TEMP-01`, `FR-TEMP-04`, `FR-TRC-02`, `FR-RPT-02`, `NFR-SEC-01`, `NFR-AUD-01`), cộng `BR-HACCP-01` nêu riêng ở tiêu đề: vào backlog `BR-HACCP-01`, `FR-OUT-05`, `FR-TEMP-01`, `FR-TEMP-04`; để ngoài `FR-INV-03`, `FR-OUT-04`, `FR-TRC-02`, `FR-RPT-02`, `NFR-SEC-01`, `NFR-AUD-01`. **Nhóm khác, không thuộc 9 mã P0:** `BR-TEMP-02` và `IF-LOG-01` cũng vào backlog nhưng là bổ sung riêng; `FR-INV-01`, `FR-INV-02`, `FR-OUT-03`, `NFR-LOC-01` để ngoài và **không phải P0**. Danh sách gốc của 9 mã nằm ở `plans/reports/review-lab4-traceability.md` mục 5 của repo LAB-2 (private), nên người đọc repo này không tự đối chiếu được | `specs/PREMISE.md` mục 1: *"Chạm **6 bẫy nghiệp vụ** thì **không được gọi là gap** — đó là lỗi phải sửa, không phải lựa chọn phạm vi"*. Sáu mã được chọn (`BR-HACCP-01`, `BR-TEMP-02`, `FR-OUT-05`, `FR-TEMP-01`, `IF-LOG-01`, `FR-TEMP-04`) đều chạm bẫy ① hoặc ⑥. (a) bị loại vì "ngoài phạm vi" ở đó là phạm vi **prototype LAB-2**, không phải phạm vi sản phẩm. (b) bị loại vì nhóm còn lại — put-away, picking, thu hồi, xuất hồ sơ kiểm toán, SSO/MFA, UI tiếng Nhật — không chạm bẫy nào và sẽ làm backlog phình gấp rưỡi |
| **6. Hai điểm chờ khách: quyền sửa phiếu nhập và `NFR-SEC-03`** | (a) Siết quyền ngay. (b) Giữ nguyên, hỏi khách. (c) Tách đôi, xử lý khác nhau | **(c)** — `GAP-09` giữ nguyên kèm issue hỏi khách; `GAP-18` / `NFR-SEC-03` đưa vào backlog | `GAP-09` tự ghi *"Có thể là thiết kế đúng"* với lý do kho chạy ca kíp — siết quyền khi chưa hỏi là chặn nghiệp vụ thật; nhưng vế hệ quả (ghi đè cột người kiểm HACCP) là lý do phải hỏi. `GAP-18` thì khác: mã hoá dữ liệu cá nhân là nghĩa vụ pháp định, và hai vế mã hoá CSDL + tệp đính kèm làm được ngay bằng cấu hình |

### Tổng ảnh hưởng tới backlog

| Nhóm | Issue phát sinh | Rơi vào epic |
|---|---|---|
| `BR-HACCP-01` — hàng đợi hồ sơ | 6 | `E6` Hàng đợi hồ sơ HACCP (**epic mới**) |
| Kiểm nhiệt khi xuất (`BR-TEMP-02`, `FR-OUT-05`) | 4 | `E3` Đơn xuất |
| Nhập dữ liệu thiết bị ghi nhiệt (`FR-TEMP-01`, `IF-LOG-01`) | 2 | `E5` Cảnh báo nhiệt |
| Hồ sơ xử lý sai lệch (`FR-TEMP-04`) | 1 | `E5` |
| Dung sai cảnh báo (`P-12`) | 1 | `E5` |
| `NFR-SEC-03` | 1 | `E7` Nền tảng |
| Ba issue làm rõ với khách — ngưỡng theo dải · quyền sửa phiếu · mức ưu tiên 11 mã NFR | 3 | `E7` |
| **Cộng** | **18** | — |

### Rủi ro lớn nhất của bộ quyết định này

**Điểm 1 đi ngược một câu trong chỉ dẫn nội bộ.** Nếu người đọc coi *"HACCP là ràng buộc cứng khi
lập lịch giao hàng"* là chân lý không cần kiểm, thì cách chốt ở đây trông như hiểu sai bẫy ⑥. Căn
cứ ở đây là suy luận có nhãn `[SUY LUẬN]` của sổ yêu cầu LAB-1, chưa phải câu RFP; chính sổ đó đánh dấu câu kia chưa
có nguồn. Vì vậy điểm này còn `[CẦN XÁC NHẬN]`. Nếu khách trả lời ngược lại, chi phí sửa là **1 issue** ở `E4` — rẻ hơn nhiều so với việc
xây một phép kiểm không ai yêu cầu rồi phải gỡ.

**Rủi ro đứng thứ hai là điểm 2.** Giữ mô hình theo dải hợp với bẫy ① và `BR-TEMP-01`, nhưng `FR-TEMP-02` (P0) có
câu chữ ngược lại. Đây là điểm duy nhất trong sáu điểm mà câu trả lời của khách có thể làm **đổi
khoá một bảng** và kéo theo mọi màn đọc ngưỡng. Đã khai ở mục 2.1 là chọn giữa hai câu RFP mâu thuẫn, rủi ro báo giá, cần hỏi trước
khi chốt giá.
