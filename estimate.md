# Estimate — SWP và giờ

Báo cáo HTML của skill chấm SWP: [`reports/swp-lab5-backlog.html`](reports/swp-lab5-backlog.html)
— tự chứa, mở offline được, không tải tài nguyên ngoài.

**428 SWP · 2 472 giờ · 309 MD · 15,45 MM** trên 107 item chấm trực tiếp.

Skill dùng: `/tkm:estimate-swp --level medium`. Mô hình là `Scope × Complexity → SWP` tra một ma
trận cố định, **không bao giờ cộng hai trục** — độ khó nhân lên theo từng đơn vị bề rộng:

```
            C0   C1   C2   C3   C5   C8
S1           1    1    2    2    3    5
S2           2    3    3    4    6   10
S3           3    4    5    6    9   15
S5           5    6    8   10   15   25
S8           8   10   12   16   24   40
S13         13   16   20   26   39   65
```

Bộ chọn tất định của skill tách **29 vật chứa** (10 epic + 19 issue có sub-issue) ra khỏi diện
chấm: điểm của chúng là **tổng của con**, chấm lại là đếm hai lần. Số học của cả 107 dòng đã đối
chiếu lại bằng chính `SWP_MATRIX` trong mã nguồn skill — **lệch 0 dòng**.

---

## 1. Issue mẫu skill chọn để kiểm

Năm issue dưới đây **không phải tôi chọn** — bộ chọn tất định của skill lấy ra theo năm tiêu chí
cố định: thấp nhất, trung vị, cao nhất, ngoại lai, và tin cậy thấp nhất. Đây là chốt chặn người
soát.

| Issue | Việc | Skill chấm | Bạn chốt | Lý do |
|---|---|---|---|---|
| **E10-I9** *(cao nhất)* | Kiểm lại toàn bộ giờ lái bên trong RPC sau khi khoá hàng tuyến, đối chiếu với hàm thuần | S5 × C3 = **10** | **Giữ 10** | Phủ chín ngưỡng trên **hai hiện thực** cộng công cụ đối chiếu — đúng là một phân hệ trọn vẹn trải nhiều tầng. Độ khó C3 đến từ khoá hàng và ca biên ngưỡng, chưa tới mức C5 vì không có dữ liệu không hoàn tác được |
| **E3-I5** *(ngoại lai)* | Trigger tầng bảng chặn 日付逆転 lúc giao (`SHP01`) kèm khoá theo cặp khách–SKU | S3 × C5 = **9** | **Giữ 9** | C5 bám **dấu hiệu tương tranh cụ thể trong mô tả**, không phải nâng vì thấy nhãn bẫy ④. Có tiền lệ thật: LAB-2 phải thêm khoá theo cặp ở migration `0016` đúng vì hai lời gọi giao đồng thời lọt qua được |
| **E10-I1** *(trung vị)* | Tách ba phép kiểm trong ngày prototype đã có thành hàm thuần đọc ngưỡng từ bảng | S2 × C2 = **3** | **Giữ 3** | Một thành phần, ba phép kiểm đã có sẵn. C2 vì hàm phải thuần (không chạm CSDL, không chạm mạng) và mọi ngưỡng chuyển sang đọc từ bảng phiên bản |
| **E6-I1** *(tin cậy thấp nhất)* | Hỏi khách nguồn dữ liệu cho hai nhịp ghi chép HACCP còn thiếu | S1 × C1 = **1** | **NÂNG lên 3** (S2 × C1) | **Chỗ duy nhất tôi sửa.** Máy chấm đúng theo mô hình — SWP đo khối lượng, không đo mức chặn. Nhưng issue này **chặn cả epic E6**: sáu issue còn lại không làm được nếu thiếu câu trả lời. Và nó không chỉ là soạn câu hỏi: hai nhịp đó **không có bảng nào lưu, không màn nào nhập**, nên phải dựng hai phương án nhập liệu cho khách chọn. Đánh dấu **issue-specific**, không lan sang năm issue PM còn lại vì chúng chỉ hỏi chứ không phải thiết kế phương án |
| **E3-I17** *(thấp nhất)* | Chốt với khách luật huỷ đơn: trạng thái nào huỷ được, lô đã phân bổ có trả lại tồn không | S1 × C1 = **1** | **Giữ 1** | Ba câu hỏi đã rõ sẵn, khối lượng đúng bằng một văn bản. Khác `E6-I1` (#97) ở chỗ không phải thiết kế phương án nào |

Trạng thái hiệu chỉnh của lần chạy: **`calibrated`** — một dòng đổi điểm, bốn dòng giữ nguyên
**kèm lý do** (đề bắt ghi lý do cả khi không sửa).

### Một giới hạn thật của mô hình chấm, không phải lỗi dữ liệu

Tám issue vai PM không có chỗ đứng trong từ vựng của mô hình: `primaryDiscipline` là một tập đóng
`UI|API|DB|Migration|Deploy|QA|Infra|Bugfix|Integration|Unknown`, **không có mục nào cho việc hỏi
khách**. Sáu issue phải gán `Unknown`, mà hợp đồng của skill quy định `Unknown` thì `confidence`
**bắt buộc** là `low`.

Tôi hạ cả sáu dòng xuống `low` theo đúng luật và ghi vào phần caveat của báo cáo, thay vì nới luật
để bảng trông đẹp. Hệ quả cần biết khi đọc báo cáo: **sáu dòng `confidence=low` không có nghĩa là
dữ liệu kém** — chúng là chỗ mô hình không phủ.

---

## 2. Cách quy ra giờ

Cách đã chọn: **hệ số giờ trên mỗi SWP, tách theo vai trò**, cộng một khoản buffer cho issue chạm
ràng buộc nghiệp vụ.

| Vai | Giờ / SWP | Vì sao con số đó | SWP | Số item |
|---|---|---|---|---|
| **BE** | **6** | Một luật nghiệp vụ ở hệ này không chỉ là một endpoint: phải có migration, trigger hoặc RPC ở tầng bảng, chính sách RLS, rồi bài kiểm ở **cả hai tầng**. `ADR-001` chốt bất biến đặt ở tầng bảng chính vì vậy | 255 (59,6%) | 59 |
| **FE** | **4** | Màn dựng trên bộ thành phần đã có từ LAB-2, phần lớn việc là bảng, biểu mẫu và trạng thái lỗi — nhanh hơn việc máy chủ trên cùng một điểm | 73 (17,1%) | 23 |
| **QA** | **5** | Định nghĩa xong của mọi issue QA là bài kiểm phải **đỏ trên mã trước khi sửa** rồi mới xanh. Dựng được trạng thái đỏ trên CSDL thật tốn hơn viết một bài kiểm thường | 82 (19,2%) | 17 |
| **PM** | **3** | Soạn câu hỏi, gửi, và ghi câu trả lời vào `PREMISE.md`. **Không tính thời gian chờ khách** — SWP đo công việc, không đo thời gian trôi | 18 (4,2%) | 8 |

### Buffer 15% cho issue chạm ràng buộc nghiệp vụ

Issue nào có cột `constraint` khác rỗng (mang `bẫy ①`…`bẫy ⑥` hoặc `giờ lái 2024`) được cộng thêm
**15%**. Lý do: định nghĩa xong của chúng luôn kèm ca biên — đúng biên nhiệt độ, hạn bằng nhau,
hợp đồng bỏ trống quy tắc, đúng ngưỡng giờ lái — và ca biên là phần tốn công nhất mà SWP không
tách riêng ra được.

**Con số 15% không phải tôi tự chế**: đó đúng là `BUFFER_RATE = 0.15` mà estimate LAB-1 đã dùng
(ô `B11`, sheet Summary). Dùng lại để hai bản estimate so được với nhau.

**231 / 428 SWP (54%)** chạm ràng buộc nghiệp vụ — tỷ lệ này tự nó là một con số đáng đọc: hơn một
nửa khối lượng của dự án nằm ở phần luật pháp lý, không phải ở phần dựng màn.

### Quy tắc áp dụng, viết ra để kiểm được tính nhất quán

```
giờ(issue) = SWP_cuối × hệ_số[vai] × (1,15 nếu có ràng buộc, ngược lại 1,0)
giờ(vật chứa) = tổng giờ của các con, KHÔNG nhân lại hệ số
1 ngày công = 8 giờ · 1 MM = 20 MD   (theo ô B8 của estimate LAB-1)
```

Bình quân thực tế rơi vào **5,78 giờ/SWP**. Mọi con số trong file này tính bằng script đọc thẳng
`backlog.csv`, không cộng tay.

---

## 3. Tổng theo epic

| Epic | Số item | Tổng SWP | Tổng giờ | MD | Ghi chú |
|---|---|---|---|---|---|
| `E1` Kiểm hàng nhập | 12 | 42 | 242,9 | 30,4 | Gánh bẫy ①②⑤ cùng lúc |
| `E2` Tồn kho 3 dải nhiệt | 8 | 33 | 186,6 | 23,3 | Phần lớn là tra cứu; hai luật hạn tách đôi rõ |
| `E3` Đơn xuất và phân bổ lô | 23 | **104** | 622,7 | 77,8 | **Epic nặng nhất.** Sáu phép loại, hai bẫy ③④, cộng kiểm nhiệt khi xuất mới thêm |
| `E4` Vòng đời tuyến giao | 13 | 49 | 274,4 | 34,3 | Không gồm giờ lái — xem `E10` |
| `E5` Cảnh báo nhiệt | 21 | 50 | 296,9 | 37,1 | Gồm nhập CSV thiết bị ghi nhiệt và hồ sơ sai lệch mới thêm |
| `E6` Hàng đợi hồ sơ HACCP | 7 | 20 | 104,4 | 13,1 | **Epic mới**, LAB-4 chưa có spec nào |
| `E7` Nền tảng, quyền, hỏi khách | 9 | 21 | 101,4 | 12,7 | Ba issue hỏi khách nằm ở đây |
| `E8` Truy xuất nguồn gốc | 9 | 28 | 147,2 | 18,4 | Không gồm thu hồi hàng loạt |
| `E9` Master và ngưỡng nhiệt | 8 | 20 | 116,1 | 14,5 | Lõi bẫy ① |
| **`E10` Giới hạn giờ lái 2024** | 16 | **61** | 379,3 | **47,4** | **Hạng mục ràng buộc đặc thù của đề**, tách riêng khỏi `E4` |
| **Tổng** | **126** | **428** | **2 472** | **309,0** | = **15,45 MM** |

---

## 4. So với estimate LAB-1

LAB-1 ước theo 12 nhóm chức năng, đơn vị MD, quy đổi 1 MM = 20 MD. Ánh xạ epic LAB-5 sang nhóm
LAB-1 để so cùng một đơn vị:

| Nhóm chức năng | LAB-1 (MD) | LAB-5 (MD) | Chênh | Vì sao |
|---|---|---|---|---|
| **FN-06 Lập tuyến & giờ lái** | 41,5 | **81,7** | **+40,2 (+97%)** | **Chênh lớn nhất, và là phát hiện đáng giá nhất của vòng này.** `GAP-01` mức Cao: prototype mới phủ **3 trên 9** ngưỡng 改善基準告示. LAB-1 ước cả nhóm như một việc; bẻ task ra thì sáu ngưỡng còn lại cần nguồn dữ liệu tích luỹ nhiều ngày của **cùng tài xế** — thứ hiện không có ai dựng — cộng bộ quy tắc có phiên bản không hồi tố, cộng QA ca biên từng nhóm cửa sổ. LAB-1 **ước hụt** mảng này |
| **FN-07 Nhiệt độ & HACCP** | 39,0 | **50,2** | **+11,2 (+29%)** | `PREMISE.md` mục 1 thêm ba việc LAB-4 không có: hàng đợi hồ sơ HACCP (`E6`, epic mới, `GAP-24`), nhập tệp CSV thiết bị ghi nhiệt (`FR-TEMP-01`, `IF-LOG-01`), hồ sơ xử lý sai lệch (`FR-TEMP-04`) |
| FN-02 Nhập kho & kiểm hàng | 28,5 | 30,4 | +1,9 (+7%) | Gần khớp. Chênh nhẹ do `GAP-20` (số lượng nhận do client gửi) và `GAP-04` thành issue riêng |
| FN-04+05 Hạn dùng, FEFO, xuất kho, POD | 104,0 | 77,8 | −26,2 (−25%) | LAB-5 để ngoài `FR-OUT-03/04` (danh sách lấy hàng trên thiết bị cầm tay) — `task-breakdown.md` mục 2. Bù lại thêm kiểm nhiệt khi xuất (`GAP-16`, 4 issue) |
| FN-01 Master data | 31,5 | 14,5 | −17,0 (−54%) | LAB-4 bỏ vòng đời duyệt master data (`GAP-11`, đã khai *Chấp nhận*); LAB-5 chỉ bẻ phần ngưỡng nhiệt có phiên bản và hợp đồng khách–SKU |
| FN-03 Tồn kho & 3 dải nhiệt | 47,5 | 23,3 | −24,2 (−51%) | LAB-5 để ngoài `FR-INV-01/02/03` (put-away và di chuyển trong kho) — không chạm bẫy nghiệp vụ nào |
| FN-08 Truy xuất & thu hồi | 37,5 | 18,4 | −19,1 (−51%) | LAB-5 để ngoài `FR-TRC-02` (thu hồi hàng loạt) — là một luồng nghiệp vụ riêng, đáng một vòng đặc tả của chính nó |
| FN-10 Phân quyền & bảo mật | 26,5 | 12,7 | −13,8 (−52%) | LAB-5 để ngoài `NFR-SEC-01` (SSO/OIDC, xác thực hai lớp) — `GAP-10` đã khai *Chấp nhận*, là việc hạ tầng |
| FN-09 Báo cáo & audit | 29,5 | 0 | −29,5 | Ngoài phạm vi LAB-5: `FR-RPT-02` và `NFR-AUD-01` |
| FN-11 Tích hợp ngoài | 21,0 | 0 | −21,0 | Ngoài phạm vi LAB-5 |
| FN-12 Migration & parallel run | 25,0 | 0 | −25,0 | Ngoài phạm vi LAB-5 |
| **Chín nhóm LAB-5 có phủ** | **356,0** | **309,0** | **−47,0 (−13%)** | |
| Ba nhóm LAB-5 không phủ | 75,5 | 0 | −75,5 | |
| Chung/ngang + quản lý (`KD-001`…`016`) | 289,5 | 0 | — | **LAB-5 chưa bẻ task.** Xem cảnh báo dưới |

### Ba điều phải nói rõ khi đọc bảng trên

**Không được đem 309 MD so thẳng với 720,5 MD tổng của LAB-1.** LAB-1 có thêm **289,5 MD** việc
chung và quản lý (`KD-001`…`016`: môi trường, CI/CD, họp, quản lý dự án, nghiệm thu) mà LAB-5 chưa
bẻ ra task, và **75,5 MD** của ba nhóm nằm ngoài phạm vi. So đúng là **309 với 356 MD** — chín nhóm
LAB-5 có phủ.

**Chênh −13% ở chín nhóm đó là hợp lý, không phải dấu hiệu ước hụt.** Nó đến từ những chỗ LAB-5 cố
ý để ngoài và có ghi lý do từng dòng ở `task-breakdown.md` mục 2. Nếu đưa ba nhóm bị cắt vào, con
số sẽ vượt LAB-1.

**Chỗ đáng lo ngược lại: `FN-06` vọt +97%.** Đây không phải LAB-5 ước thừa — đây là LAB-1 **ước
hụt** mảng giờ lái xe, và chỉ lộ ra khi bẻ task tới mức từng ngưỡng. Nếu con số LAB-1 đã dùng để
báo giá thì phần này đang thiếu khoảng **40 ngày công**. Cộng thêm chỗ hở mà vòng bẻ task tìm ra —
拘束時間 đang tính theo *tuyến* chứ không theo *ngày làm việc của tài xế* (`task-breakdown.md` mục 4,
dòng 2) — thì mảng này cần soát lại trước khi chốt giá với khách.
