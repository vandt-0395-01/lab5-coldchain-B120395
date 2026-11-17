# Nhật ký dùng AI — LAB-5

Ghi ngay sau mỗi bước, không ghi dồn. Cột "Vấn đề AI gặp / đã sửa" là cột quan trọng nhất —
không có vấn đề thì ghi "không", đừng để trống.

| Bước | Skill | Prompt tóm tắt | Output | Vấn đề AI gặp / đã sửa |
|---|---|---|---|---|
| Chuẩn bị | `gh` + GraphQL | Tạo repo public và GitHub Project V2, dựng các trường đề yêu cầu | Repo `lab5-coldchain-productb`, Project #1, trường `SWP`/`Hours`/`Role`/`Epic`, Iteration Sprint 1–2 | **Hai chỗ `gh` không làm được.** (1) `gh project create` tạo Project **private** mặc định, đề bắt buộc public — phải `gh project edit --visibility PUBLIC` rồi đọc lại trường `public` để xác nhận, không tin lệnh im lặng là xong. (2) `gh project field-create` không có kiểu `ITERATION`; phải gọi thẳng GraphQL `createProjectV2Field` rồi `updateProjectV2Field` với `iterationConfiguration`. Sprint 1 đặt ngày trong quá khứ nên GitHub tự xếp vào `completedIterations` — đúng thứ cần cho báo cáo tiến độ, nhưng phải truy vấn đúng trường đó mới thấy |
| 0 | `/tkm:manage-docs init` | Chép specs LAB-4 + sổ yêu cầu LAB-1 vào repo, dựng khung 6 file theo đúng phần và thứ tự của đề, lập bảng tóm tắt specs | 114 file `specs/`, `docs/01_requirements-extract.md`, 6 file khung + `ai-log.md`, 3 thư mục rỗng | **Skill không khớp việc.** `manage-docs init` viết ra để đọc một codebase rồi sinh bộ tài liệu chuẩn (`project-overview-pdr.md`, `codebase-summary.md`…), trong khi Bước 0 chỉ là dựng khung repo nộp bài. Dùng đúng skill plan ghi, nhưng phần việc thật làm tay — ghi lại thay vì giấu, vì đây là dữ liệu thật về chỗ kit chưa phủ. Bảng tóm tắt specs sinh bằng script đọc thẳng file, không đọc tay, để khỏi đếm nhầm |
