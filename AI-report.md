# Cách dùng AI trong LAB-5

Toàn bộ LAB-5 chạy trong **5 giờ 45 phút** (commit đầu 09:44, commit cuối 15:29 ngày 17/11/2026),
13 commit. Nhật ký ghi ngay sau mỗi bước ở [`ai-log.md`](ai-log.md) — cột "Vấn đề AI gặp / đã sửa"
là cột chính, không phải cột output.

## 1. Skill và prompt đã dùng cho từng việc

| Bước | Lệnh thật | Tóm tắt prompt | Output |
|---|---|---|---|
| 0 | `/tkm:manage-docs init` | Chép `specs/` LAB-4 và sổ yêu cầu LAB-1 vào repo; dựng khung 6 file theo đúng phần và thứ tự của đề; lập bảng tóm tắt specs | 114 file `specs/`, 6 file khung, `ai-log.md` |
| 1 | `/brainstorm --role cpo` | Chốt dứt khoát 6 điểm LAB-4 để ngỏ. **Cấm hỏi lại**, bắt trích nguồn cụ thể (dòng nào, file nào) và bắt nêu ảnh hưởng tới số issue | `PREMISE.md` đủ 3 mục, 18 issue phát sinh, 1 epic mới |
| 2 | `/tkm:pm-create-tasks` + **5 agent song song** | Bẻ 7 screen spec và 4 detail design thành 10 epic. Mỗi agent **sở hữu đúng 1 file CSV và 1 file ghi chỗ hở** — không agent nào ghi vào file của agent khác. 21 dòng gap phân sẵn đích danh cho từng agent | `backlog/*.csv`, `findings/*.md` (67 chỗ hở) |
| 3 | `/tkm:estimate-swp --level medium` + **5 worker cô lập** | Chấm Scope × Complexity → SWP cho 126 item. Dùng bộ chọn và bộ chia mẻ **tất định** của skill, không tự chia | 107 item chấm trực tiếp + 29 vật chứa cộng dồn = **428 SWP**, `reports/swp-lab5-backlog.html` |
| 3b | **Người soát** (không phải AI) | Soát 5 issue đại diện do bộ chọn tất định chỉ ra: thấp nhất, trung vị, cao nhất, ngoại lai, tin cậy thấp nhất | 1 dòng đổi điểm, trạng thái `calibrated` |
| 4 | Script tự viết đọc `backlog.csv` | Quy SWP ra giờ theo hệ số vai, so với estimate LAB-1 | `estimate.md`, 2 471,9 giờ = 309 MD = 15,45 MM |
| 5 | **1 agent** + `gh` CLI + GraphQL | Đẩy 136 issue lên GitHub, nối 126 quan hệ sub-issue, thêm vào Project và điền 6 trường. **Chạy thử 1 epic trước, kiểm xong mới chạy cả mẻ** | 136 issue · 136 item đủ trường |
| 6 | `gh` + GraphQL + script tự viết | Mô phỏng Sprint 1 có trễ thật, ghi Status, dựng burndown, viết báo cáo tiến độ | 136 item có Status, `images/burndown.*`, `progress-report.md` |
| 7 | `/tkm:review-doc --level high` + **4 người soát + 4 người sửa** | Soát chéo 4 tài liệu, **ngữ cảnh sạch**, mỗi người một file. Bắt buộc trích dẫn nguyên văn **cả hai đầu** | `review-report.md`: 12 Critical, 14 Warning |
| 8 | `/tkm:manage-docs` + script kiểm | Viết `README.md` 5 phần, bảng Spec → epic mang số issue thật | `README.md` |

### Ba cách dùng agent đáng kể nhất

**Phân việc trước, không để agent tự chọn.** Ở bước 2, 21 dòng gap được chia đích danh cho từng
agent và mỗi agent bị cấm nhận gap ngoài danh sách của mình. Nếu để agent tự chọn thì gap nằm giữa
hai màn — ví dụ `GAP-16` kiểm nhiệt khi xuất, nằm giữa `E3` và `E5` — sẽ **hoặc bị cả hai bỏ, hoặc
bị cả hai làm**. Mỗi agent cũng sở hữu đúng một file để không ghi đè nhau.

**Chạy thử một epic trước khi chạy cả mẻ.** Ở bước 5, epic thử lộ ra hai lỗi: `gh project item-list`
**không trả về giá trị trường tự tạo** (nhìn vào tưởng `SWP`/`Hours`/`Role` rỗng hết, phải truy vấn
GraphQL mới thấy), và mẫu thân issue in `Scope × Complexity` thành `× ` rỗng với 19 vật chứa. Chạy
thẳng 136 item rồi mới kiểm thì đã tưởng hỏng và làm lại cả mẻ.

**Người soát chạy ngữ cảnh sạch.** Ở bước 7, 4 người soát không biết gì về phiên viết tài liệu —
họ chỉ thấy file và nguồn sự thật. Đó là lý do họ bắt được lỗi mà người viết không thể tự thấy.

## 2. Review output của AI

### Người soát ở những điểm nào

| Điểm | Việc của người |
|---|---|
| Sau bước 3 (chấm SWP) | Soát 5 issue đại diện, mỗi issue hai vòng: chọn mức khó, rồi chọn điểm cụ thể trong mức đó |
| Trước bước 5 (tạo issue) | Duyệt danh sách 136 issue **trước khi** tạo trên GitHub — tạo rồi khó gỡ |
| Trước khi ghi Status (bước 6) | Duyệt bảng trạng thái cuối Sprint 1 trước khi ghi lên Project |
| Sau bước 7 (review chéo) | Chốt hướng xử lý 12 Critical + 14 Warning, gồm một quyết định về phạm vi |

### AI sai gì, xử lý thế nào

Bảng dưới chỉ ghi **lỗi thật đã kiểm chứng**, không ghi lỗi suy đoán. Mỗi dòng ghi cách phát hiện,
vì cách phát hiện quan trọng hơn bản thân lỗi.

| # | AI sai gì | Phát hiện bằng cách nào | Xử lý |
|---|---|---|---|
| 1 | **Hai thước đo mâu thuẫn nhau mà không ai để ý.** Trần "1 issue ≤ 2 ngày công" áp lúc bẻ task bằng cảm nhận *phạm vi*; giờ lại suy từ `SWP × hệ_số[vai]` ra *thời lượng*. Kết quả **72/107 issue vượt trần**, lớn nhất 69 giờ | Người soát bước 7 đặt hai con số cạnh nhau rồi lọc `backlog.csv` bằng script | PM chốt **khai thật, không bẻ lại backlog**. `task-breakdown.md` nêu số đo, nguyên nhân, và việc phải làm trước khi chạy thật: 11 dòng vượt 36 giờ bẻ trước sprint đầu, 61 dòng 17–36 giờ rà khi lập sprint |
| 2 | **Nói thay văn bản luật.** Báo cáo tiến độ viết 改善基準告示 "không quy định cứng số phút tối thiểu mỗi đoạn nghỉ" và gọi 30 phút là "mức an toàn nhất" — **không nguồn nào trong repo đỡ** | Người soát `grep` toàn bộ `specs/` và `docs/`, không ra chỗ nào nói về số phút tối thiểu | Đổi thành điều kiểm chứng được: *RFP không nêu số này → cần hỏi khách*. Sửa cả **bình luận đã đăng công khai** trên issue #71, kèm dòng ghi rõ bản đầu sai gì |
| 3 | **Ghi đè một khối RFP đã nêu rõ** — đúng điều đề cấm. `PREMISE.md` chốt ngưỡng nhiệt khoá theo dải và gọi đó là giả định lấp chỗ trống, trong khi `FR-TEMP-02` mức P0 ghi rõ *"Đánh giá từng reading theo chính sách SKU/zone hiệu lực"* | Người soát mở dòng 97 của sổ yêu cầu, đối chiếu từng chữ | Phần tinh: `BR-TEMP-01` nói theo dải, `FR-TEMP-02` nói theo SKU/zone — **RFP tự mâu thuẫn**, nên chọn một vế không phải lấp chỗ trống. PREMISE khai lại đúng bản chất, kèm rủi ro đổi mô hình dữ liệu |
| 4 | **Dựng ra người thứ 5** trong đội. Báo cáo ghi "2 BE · 1 FE · 1 QA · 1 PM" và cho PM 60 giờ năng lực, trong khi `PREMISE.md` ghi đội 4 người | Người soát đối chiếu hai tài liệu anh em | Năng lực đội là **320 giờ** chứ không phải 380. Kéo theo: phần còn lại không phải 5,6 mà **6,9 sprint**; và tính theo vai thì **BE cần 9,8 sprint còn FE chỉ 3,1** — cơ cấu đội lệch, thêm thành rủi ro R7 |
| 5 | **Số học sai mà cộng vẫn ra đúng tổng.** Phân loại 67 chỗ hở ghi `45 · 10 · 6 · 6`; đếm lại theo tiền tố cột Xử lý ra `43 · 12 · 5 · 7`. Sai ba trên bốn ô nhưng **vẫn cộng ra 67** nên nhìn bằng mắt không thấy | Script đếm lại khi viết README ở bước 8 | Sửa thành số đếm được |
| 6 | **Nói quá phạm vi bị chặn.** Rủi ro R1 viết issue `#71` làm "cả epic E10 (61 SWP) đứng" | Lan truyền cột `depends_on` ra đúng **một** issue phụ thuộc (`E10-I11`, 3 SWP) | Sửa đúng mức, nhưng giữ phần đúng: câu hỏi khách `#82` ảnh hưởng rộng hơn một dây phụ thuộc |
| 7 | **Burndown giải thích sai cả số ngày lẫn số điểm.** Viết "hai ngày cuối, đóng 18 SWP" | Đối chiếu `images/burndown.csv` | Thật là **ba ngày, 26 SWP** |
| 8 | **Tổng estimate LAB-1 sai 0,5 MD** (720,5 thay vì 721,0) | Mở lại workbook LAB-1 bằng `openpyxl`, cộng lại 13 dòng | Sửa |
| 9 | **Worker phá hợp đồng của chính skill.** 6 issue vai PM bị gán `primaryDiscipline = Unknown` với `confidence = medium/high`, trong khi hợp đồng quy định Unknown thì tin cậy **phải** là `low` | Bộ kiểm của skill báo lỗi | Hạ cả 6 dòng xuống `low` **theo luật, không nới luật**, và ghi nguyên nhân gốc vào caveat: từ vựng đóng của mô hình không có mục nào cho việc đi hỏi khách |
| 10 | **Lỗi của chính tôi lúc đang sửa lỗi.** Viết tiền tố mật khẩu demo của LAB-2 vào tài liệu quét bí mật — trong repo **public**, đúng điều vừa dặn người soát đừng làm | Quét bí mật trên diff trước khi commit | Xoá, commit riêng. Mật khẩu đầy đủ chưa bao giờ lọt. Tiền tố còn trong một commit đã push; viết lại lịch sử cần force-push nên để PM quyết |

### Ba lần skill không khớp việc — ghi lại thay vì giấu

`/tkm:manage-docs init` và `/tkm:pm-create-tasks` đều **không hợp với bài này**: cái đầu viết ra để
đọc một codebase rồi sinh bộ tài liệu chuẩn, cái sau đọc WBS ở `schedule.md §3` và ghi vào
`project/01_management/task-list.md` — bố cục dự án khác hẳn repo nộp bài, và nó tự dừng khi WBS
rỗng. `/tkm:manage-docs` ở bước 8 cũng vậy.

Vẫn chạy đúng skill kế hoạch ghi, giữ lại những luật dùng được của chúng — *1 task ≤ 2 ngày công,
1 task = 1 issue = 1 người*, và *không tạo issue trước khi được duyệt* — rồi làm tay phần còn lại.
Ghi vào nhật ký vì đây là **dữ liệu thật về chỗ bộ kit chưa phủ**, không phải chuyện đáng giấu.

Ngược lại, `/tkm:estimate-swp` **khớp việc và nó chặt**. Bốn chỗ phải theo luật của nó chứ không
theo ý mình: bộ chọn tách 29 vật chứa ra khỏi diện chấm (chấm lại là đếm hai lần); SWP là **tra ma
trận**, cấm cộng hai trục; skill cấm ghi ngược vào nguồn nên phần ghi `swp_final` phải làm tay sau;
và bộ render bắt file HTML nằm dưới thư mục tên `reports`.

### Bộ kiểm trích dẫn — thứ làm vòng review khác review cho có

Mỗi phát hiện ở bước 7 buộc mang trích dẫn nguyên văn **cả hai đầu**: câu trong tài liệu và câu
trong nguồn sự thật. Sau đó `doc-review-citation-check.cjs` mở lại file và **chạy lại** các lệnh
tìm kiếm được khai là "không khớp". Kết quả **4/4 báo cáo exit 0, không dòng REJECT** — không phát
hiện nào dựng trên trí nhớ.

Dù vậy vẫn **tự kiểm lại từng lỗi Critical trên nguồn gốc** thay vì nhận ở mặt chữ. Cả 12 đều
đứng, 6 trong số đó xác nhận bằng cách tự chạy lại script hoặc mở workbook LAB-1. Một phát hiện
của người soát thì **nói quá**: họ bảo bộ phân giải ngưỡng xử lý sai `effective_to`, mở code ra thì
nhánh đó đúng, chỉ là code chết vì `SER-16` luôn ghi `null`.

## 3. Điểm đặc biệt trong cách dùng AI

> **[PM TỰ VIẾT]** — mục này phải là lời của PL, không phải lời AI. Đề bài yêu cầu tự đánh giá:
> chỗ nào thấy hiệu quả, chỗ nào chưa tốt cần cải thiện khi làm thật (thời gian, công sức, token),
> và nêu rõ **ít nhất 2–3 lỗi AI thật đã bắt được**.

Số liệu để PL dùng khi viết — tự kiểm lại trước khi tin:

- **Thời gian:** 5 giờ 45 phút, 13 commit, từ repo rỗng tới backlog 136 issue trên Project cộng
  báo cáo tiến độ. Bước tốn nhất là bẻ task (bước 2) và chấm SWP (bước 3), mỗi bước ~1 giờ với 5
  agent chạy song song.
- **Chỗ tốn nhưng đáng:** vòng review chéo (bước 7) mất ~25 phút cho 4 người soát + 4 người sửa,
  đổi lại bắt được 12 lỗi Critical mà phiên viết tài liệu **không thể tự thấy**.
- **Chỗ tốn mà không đáng:** ba lần gọi skill không khớp việc (bước 0, 2, 8) — vẫn phải làm tay.
- **Ba lỗi AI nặng nhất để PL chọn viết:** (1) hai thước đo mâu thuẫn làm 72/107 issue vượt trần;
  (2) nói thay văn bản luật 改善基準告示 khi không nguồn nào đỡ; (3) ghi đè `FR-TEMP-02` mức P0
  trong khi đề cấm ghi đè khối RFP đã nêu rõ. Chi tiết ở bảng mục 2.
- **Một điều đáng nghĩ:** cả ba lỗi trên đều **không phải lỗi ngôn ngữ hay lỗi định dạng**. Chúng
  là lỗi *nghiệp vụ* và *số học* — loại lỗi đọc trôi chảy, nghe hợp lý, và chỉ lộ ra khi có người
  đặt hai con số cạnh nhau hoặc mở đúng dòng nguồn ra đối chiếu.
