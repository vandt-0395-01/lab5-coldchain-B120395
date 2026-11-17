# Quét bí mật trên toàn bộ lịch sử commit — 17/11/2026

Repo này **public**, nên lịch sử commit cũng public: một bí mật đã xoá khỏi cây làm việc vẫn còn
nguyên trong lịch sử và chỉ cách một lệnh `git log -p`. Vì vậy quét cả 208 đối tượng của mọi nhánh,
không chỉ cây hiện tại.

## Lệnh đã chạy và kết quả

| # | Kiểm | Lệnh | Kết quả |
|---|---|---|---|
| 1 | Danh tính commit | `git log --all --format='%an <%ae> \| %cn <%ce>' \| sort -u` | Chỉ một danh tính: `vandt-0395-01 <vandt-0395-01@users.noreply.github.com>` — **không có email thật** |
| 2 | Quy mô lịch sử | `git rev-list --all --count` · `git rev-list --objects --all \| wc -l` | 9 commit · 208 đối tượng |
| 3 | Bí mật trong mọi blob | duyệt 208 đối tượng, mỗi blob `git cat-file -p` rồi `grep -aEin` theo bộ mẫu dưới | **không khớp dòng nào** |
| 4 | File bí mật từng được thêm | `git log --all --pretty=format: --name-only --diff-filter=A \| sort -u \| grep -Ei '\.env\|\.pem$\|\.key$\|\.p12$\|credential\|secret'` | không có |
| 5 | Email thật trong lịch sử | `git grep -aiI "sun-asterisk.com" $(git rev-list --all)` | không thấy |

## Bộ mẫu dùng ở kiểm số 3

```
AKIA[0-9A-Z]{16}
-----BEGIN [A-Z ]*PRIVATE KEY
gh[pousr]_[A-Za-z0-9]{20,}
sk-[A-Za-z0-9]{20,}
eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}
(postgres|mysql|mongodb)(\+srv)?://[^ :]+:[^ @]+@
ColdChain!
```

Mẫu cuối (`ColdChain!`) là mẫu riêng cho bài này, không phải mẫu phổ thông: repo LAB-2 có mật khẩu
tài khoản thử trong `docs/quick-report.md`, và repo LAB-5 có chép `specs/` từ LAB-2 sang. Phải kiểm
riêng xem mật khẩu đó có theo sang không. **Không theo sang.**

## Kết luận

Lịch sử sạch trên cả năm kiểm. Không cần viết lại lịch sử, không cần thu hồi khoá nào.
