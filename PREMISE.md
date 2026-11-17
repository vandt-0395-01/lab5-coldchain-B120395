# Tiền đề LAB-5 — backlog khác bản LAB-4 ở đâu

Bản LAB-4 được break: nộp **16/11/2026**, bộ `specs/` chép nguyên vào repo này.

LAB-4 để lại **6 điểm chưa chốt** (`specs/PENDING.md`, cộng 5 dòng gap mang trạng thái *Chờ khách*
hoặc *Chờ PM ký*). Bẻ task thì không né được: mỗi điểm quyết định có hay không một nhóm issue. Mục
3 chốt cả 6; mục 1 ghi những chỗ vì thế mà spec phải đổi; mục 2 ghi những chỗ phải đặt giả định.

Mã issue trong file này là **mã tạm** (`E1-I3`…). Sau Bước 5 chúng được thay bằng `#số` thật trên
GitHub Project.

---

## 1. Spec thêm / bỏ / sửa so với LAB-4

| Spec (mã/file) | Thêm/Bỏ/Sửa | Trước → sau | Vì sao | Issue bị ảnh hưởng |
|---|---|---|---|---|
| **Màn mới: Hàng đợi hồ sơ HACCP** (LAB-4 không có) | **Thêm** | Không có màn nào cho `BR-HACCP-01` → thêm một màn và một epic riêng | `specs/database/gap-list.md` → `GAP-24` mức **Cao**, *Chờ PM ký*: *"`BR-HACCP-01` đòi sinh hàng đợi completeness, không tự đóng cho tới khi đủ hồ sơ"*. `specs/PREMISE.md` mục 1 cấm xếp yêu cầu **chạm bẫy nghiệp vụ** thành lựa chọn phạm vi. PM ký: đưa vào | `E6-*` |
| `SC4-03` Đơn xuất — kiểm nhiệt khi **XUẤT** | **Thêm** | Chỉ kiểm nhiệt chiều nhập → kiểm cả chiều xuất, lưu lại được kết quả | `GAP-16` mức **Cao**: *"Không kiểm nhiệt khi XUẤT hàng. Không bảng nào lưu kết quả kiểm trước xuất"*. Chạm bẫy ①; `BR-TEMP-02` và `FR-OUT-05` đều P0 | `E3-*` |
| `SC4-05` Cảnh báo nhiệt — nguồn dữ liệu đo | **Thêm** | Dữ liệu đo seed sẵn → nhập được tệp CSV của thiết bị ghi nhiệt | `FR-TEMP-01` + `IF-LOG-01` nằm trong 9 mã P0 vắng mặt (`GAP-25`). Không có đường nhập dữ liệu thật thì `SC4-05` không chạy được trên dữ liệu khách | `E5-*` |
| `SC4-05` + `ALM_EXCURSION_EVAL_DETAIL.md` — dung sai đợt vượt ngưỡng | **Sửa** | Một bản ghi đơn lẻ ngoài ngưỡng cũng sinh cảnh báo (0 phút) → thêm tham số dung sai có cấu hình, **mặc định 0 phút** | `specs/PENDING.md` → `P-12`. Mặc định 0 giữ nguyên nghĩa pháp lý của hồ sơ hiện tại; làm tham số để khách chỉnh được mà không sửa mã nguồn | `E5-*` |
| `SC4-05` — hồ sơ xử lý sai lệch | **Thêm** | Chỉ có ô "ghi xử lý" lúc đóng cảnh báo → hồ sơ sai lệch có vòng đời riêng | `FR-TEMP-04` P0, vắng mặt theo `GAP-25`. `specs/_common/error-codes.md` đã có `ALM03` (đóng cảnh báo phải có ghi chú) nhưng một dòng ghi chú chưa phải một hồ sơ | `E5-*` |
| `NFR-SEC-03` — mã hoá dữ liệu lưu trữ | **Thêm** | Chỉ mã hoá đường truyền → xét thêm mã hoá CSDL và tệp đính kèm | `GAP-18`: *"mã hoá CSDL, file đính kèm và hàng đợi offline **chưa xét**"*. Là yêu cầu P0. Vế hàng đợi ngoại tuyến để ngoài vì bản này không có chế độ đó | `E7-*` |

**Không sửa gì khác.** Bảy screen spec và bốn detail design của LAB-4 giữ nguyên nội dung; LAB-5
chỉ bẻ chúng ra task.

---

## 2. Giả định bổ sung

Mỗi dòng dưới đây lấp một chỗ **RFP hoặc spec để ngỏ**. Không dòng nào ghi đè khối RFP đã nêu rõ —
chỗ nào RFP nói thẳng thì theo RFP, kể cả khi trái với chỉ dẫn nội bộ (mục 3 điểm 1).

| Giả định | Chỗ spec/RFP để ngỏ | Ảnh hưởng tới issue / estimate |
|---|---|---|
| Dung sai đợt vượt ngưỡng **mặc định 0 phút**, đặt thành tham số cấu hình | RFP không nêu dung sai nào cho cảnh báo nhiệt (`P-12`) | +2 issue ở `E5`. Khách chốt số khác thì chỉ đổi dữ liệu cấu hình, **không đổi estimate** |
| Ngưỡng nhiệt khoá theo **dải**, không theo mã hàng/khu | `FR-TEMP-02` viết "theo chính sách SKU/khu"; `ADR-005` và bảng `temp_policies` khoá theo dải (`GAP-26`) | +1 issue làm rõ ở `E7`. **Rủi ro báo giá**: nếu khách xác nhận cần theo mã hàng/khu thì phải đổi khoá bảng ngưỡng và mọi chỗ đọc ngưỡng — ước thêm 15–20 SWP, chưa tính trong LAB-5 |
| Nhân viên kho **sửa chéo phiếu nhập của nhau là hợp lệ** | `GAP-09` tự ghi: *"**Có thể là thiết kế đúng** — kho chạy ca kíp thì ca sau sửa phiếu ca trước là bình thường"* | +1 issue làm rõ ở `E7`. Không siết quyền ở LAB-5: siết nhầm là chặn nghiệp vụ thật đang chạy |
| **8 yêu cầu phi chức năng nằm ngoài tập P0**, trừ `NFR-SEC-03` | `P-04`: bảng NFR không có cột ưu tiên, danh sách tính năng không trỏ tới. Xếp ngoài P0 là **suy luận, không có trích dẫn** | +1 issue làm rõ gom cả 8 mã ở `E7`. Không bẻ task cho chúng ở LAB-5 |
| Sprint 2 tuần = **10 ngày công**, đội 4 người (2 BE, 1 FE, 1 QA) | Đề LAB-5 không quy định quy mô đội hay độ dài sprint | Quyết định sức chứa Sprint 1, và do đó quyết định issue nào rơi sang Sprint 2 |
| Người phụ trách ghi trong thân issue là **vai trò giả định**, không phải người thật | Project V2 chỉ gán được tài khoản có quyền trên repo | Không ảnh hưởng estimate. Trường `Assignees` để trống; vai trò ghi ở thân issue và ở trường `Role` |

---

## 3. Hướng đã chốt

Sáu điểm LAB-4 để ngỏ. Mỗi điểm chốt **một** phương án.

| Vấn đề | Các phương án ở LAB-4 | Phương án chốt | Vì sao |
|---|---|---|---|
| **1. HACCP có chặn việc lập lịch giao hàng không?** | (a) Chặn — theo câu chữ bẫy ⑥ của chỉ dẫn nội bộ. (b) Không chặn ở cổng đó — theo sổ yêu cầu LAB-1 | **(b) Không chặn lập lịch.** HACCP vẫn là ràng buộc **cứng**, nhưng ở hai cổng của nó: chặn **xác nhận nhập/xuất** (`BR-TEMP-02`, `FR-OUT-05`) và sinh **hàng đợi hồ sơ không tự đóng** (`BR-HACCP-01`) | `docs/01_requirements-extract.md` dòng 275 nói thẳng: *"RFP không gắn HACCP với việc lập lịch/publish tuyến"*, và tự đánh dấu câu của chỉ dẫn nội bộ là *"chưa có trong RFP → cần hỏi khách"*. Đề LAB-5 cấm giả định ghi đè khối RFP đã nêu rõ. Chọn (a) là thêm một phép kiểm **không có căn cứ** vào luồng công bố tuyến → sai báo giá. Nếu khách xác nhận cần, phát sinh 1 issue ở `E4` |
| **2. Ngưỡng nhiệt tra theo dải hay theo mã hàng/khu?** | (a) Theo dải — `ADR-005`, bảng `temp_policies` hiện tại. (b) Theo mã hàng/khu — câu chữ `FR-TEMP-02` | **(a) Theo dải**, kèm một issue hỏi khách | Bẫy ① của RFP nói ngưỡng 3 dải là **chính sách công ty tự công bố** — đơn vị công bố là dải, không phải mã hàng. `GAP-26` xếp mức Trung bình và ghi rõ đây là lệch **mô hình dữ liệu**. Đổi khoá bảng ngưỡng khi chưa có câu trả lời của khách là rước việc lớn nhất của dự án vào sprint đầu |
| **3. Dung sai cho đợt vượt ngưỡng nhiệt** | (a) Giữ nguyên — mọi bản ghi ngoài ngưỡng đều sinh cảnh báo. (b) Đặt ngưỡng cứng trong mã nguồn. (c) Tham số cấu hình, mặc định 0 | **(c) Tham số cấu hình, mặc định 0 phút** | RFP không nêu dung sai → giả định chỉ được **lấp chỗ để ngỏ**. Mặc định 0 giữ nguyên hành vi hiện tại nên không đổi nghĩa pháp lý hồ sơ HACCP; làm tham số để khách chốt số sau mà không phải sửa mã. (b) bị loại vì chôn một con số không ai kiểm chứng được vào mã nguồn — đúng loại lỗi `ADR-005` dựng ra để chặn |
| **4. Có bẻ task cho 8 yêu cầu phi chức năng không?** | (a) Đưa hết vào backlog. (b) Để ngoài hết. (c) Để ngoài, trừ mã nào có căn cứ P0 | **(c)** — chỉ `NFR-SEC-03` vào backlog; 7 mã còn lại gom thành **một issue làm rõ** | `P-04`: mức ưu tiên của chúng xếp bằng **suy luận, không bằng trích dẫn**. Đưa hết vào là đoán ưu tiên rồi tính tiền trên cái đoán đó. `NFR-SEC-03` là ngoại lệ vì có mức P0 ghi rõ ở dòng 183 sổ yêu cầu, và phần lớn làm được bằng cấu hình |
| **5. `BR-HACCP-01` và 9 yêu cầu P0 vắng mặt — có vào LAB-5 không?** | (a) Để ngoài hết, vì đã khai "ngoài phạm vi prototype". (b) Đưa hết vào. (c) Đưa phần **chạm bẫy nghiệp vụ**, phần còn lại ghi lý do để ngoài | **(c)** — vào backlog: `BR-HACCP-01`, `BR-TEMP-02`, `FR-OUT-05`, `FR-TEMP-01`, `IF-LOG-01`, `FR-TEMP-04`. Để ngoài: `FR-INV-01/02/03`, `FR-OUT-03/04`, `FR-TRC-02`, `FR-RPT-02`, `NFR-SEC-01`, `NFR-AUD-01`, `NFR-LOC-01` | `specs/PREMISE.md` mục 1: *"Chạm **6 bẫy nghiệp vụ** thì **không được gọi là gap** — đó là lỗi phải sửa, không phải lựa chọn phạm vi"*. Sáu mã được chọn đều chạm bẫy ① hoặc ⑥. (a) bị loại vì "ngoài phạm vi" ở đó là phạm vi **prototype LAB-2**, không phải phạm vi sản phẩm. (b) bị loại vì nhóm còn lại — put-away, picking, thu hồi, xuất hồ sơ kiểm toán, SSO/MFA, UI tiếng Nhật — không chạm bẫy nào và sẽ làm backlog phình gấp rưỡi |
| **6. Hai điểm chờ khách: quyền sửa phiếu nhập và `NFR-SEC-03`** | (a) Siết quyền ngay. (b) Giữ nguyên, hỏi khách. (c) Tách đôi, xử lý khác nhau | **(c)** — `GAP-09` giữ nguyên kèm issue hỏi khách; `GAP-18` / `NFR-SEC-03` đưa vào backlog | `GAP-09` tự ghi *"Có thể là thiết kế đúng"* với lý do kho chạy ca kíp — siết quyền khi chưa hỏi là chặn nghiệp vụ thật. `GAP-18` thì khác: `NFR-SEC-03` là P0, và hai vế mã hoá CSDL + tệp đính kèm làm được ngay bằng cấu hình |

### Tổng ảnh hưởng tới backlog

| Nhóm | Issue phát sinh | Rơi vào epic |
|---|---|---|
| `BR-HACCP-01` — hàng đợi hồ sơ | ~5 | `E6` Hàng đợi hồ sơ HACCP (**epic mới**) |
| Kiểm nhiệt khi xuất (`BR-TEMP-02`, `FR-OUT-05`) | ~4 | `E3` Đơn xuất |
| Nhập dữ liệu thiết bị ghi nhiệt (`FR-TEMP-01`, `IF-LOG-01`) | ~3 | `E5` Cảnh báo nhiệt |
| Hồ sơ xử lý sai lệch (`FR-TEMP-04`) | ~2 | `E5` |
| Dung sai cảnh báo (`P-12`) | ~2 | `E5` |
| `NFR-SEC-03` | ~1 | `E7` Nền tảng |
| Ba issue làm rõ với khách — ngưỡng theo dải · quyền sửa phiếu · 8 NFR | 3 | `E7` |
| **Cộng** | **~20** | — |

### Rủi ro lớn nhất của bộ quyết định này

**Điểm 1 đi ngược một câu trong chỉ dẫn nội bộ.** Nếu người đọc coi *"HACCP là ràng buộc cứng khi
lập lịch giao hàng"* là chân lý không cần kiểm, thì cách chốt ở đây trông như hiểu sai bẫy ⑥. Căn
cứ bảo vệ đã trích nguyên văn ở bảng trên, và chính sổ yêu cầu LAB-1 là bên đánh dấu câu kia chưa
có nguồn. Nếu khách trả lời ngược lại, chi phí sửa là **1 issue** ở `E4` — rẻ hơn nhiều so với việc
xây một phép kiểm không ai yêu cầu rồi phải gỡ.

**Rủi ro đứng thứ hai là điểm 2.** Giữ mô hình theo dải là đúng với bẫy ①, nhưng `FR-TEMP-02` có
câu chữ ngược lại. Đây là điểm duy nhất trong sáu điểm mà câu trả lời của khách có thể làm **đổi
khoá một bảng** và kéo theo mọi màn đọc ngưỡng. Đã ghi ở mục 2 là rủi ro báo giá, cần hỏi trước
khi chốt giá.
