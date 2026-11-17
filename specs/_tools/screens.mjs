/**
 * Định nghĩa 7 màn cốt lõi — NGUỒN SỰ THẬT DUY NHẤT cho wireframe và bảng item 4.1.
 *
 * Sửa ở đây rồi chạy `node specs/_tools/render-wireframes.mjs`; đừng sửa tay file .svg
 * hay file _items.md vì chúng bị ghi đè.
 *
 * Mỗi item thành một dòng ở mục 4.1 của screen spec, mã `{section}-{số thứ tự}` — ví dụ
 * item thứ 2 của section A là `A-2`. Mục 4.2 (validation), 4.3 (data mapping) và mục 5
 * (event) trỏ ngược về các mã này.
 *
 * t:    label | text | select | date | number | textarea | button | table | banner | badge
 *       | link | checkbox | image | note
 * req:  "Có" | "Không" | "-"   (item không nhận nhập liệu thì "-")
 */

const NAV_WAREHOUSE = ["Dashboard", "Kiểm hàng nhập (入荷検品)", "Tồn kho", "Lịch sử giao", "Truy xuất"];
const NAV_QA = ["Dashboard", "Master & chính sách", "Tồn kho", "Lịch sử giao", "Cảnh báo nhiệt (温度逸脱)", "Reading cảm biến", "Truy xuất"];
const NAV_DISPATCH = ["Dashboard", "Tồn kho", "Đơn xuất (出荷指示)", "Lập tuyến (配送計画)", "Lịch sử giao", "Truy xuất"];

export const SCREENS = [
  // ---------------------------------------------------------------- SC4-01
  {
    id: "SC4-01", feature: "receiving",
    title: "Kiểm hàng nhập (入荷検品)",
    lead: "Nhận, từ chối hoặc giữ lại từng dòng hàng. Nhiệt độ so với phiên bản ngưỡng hiệu lực tại THỜI ĐIỂM ĐO.",
    roles: "warehouse_staff (ghi) · admin (xem)",
    reqs: ["FR-REC-02", "FR-REC-03", "FR-REC-05", "BR-TEMP-01", "BR-TEMP-02", "BR-EXP-01", "BR-TRACE-01/02"],
    user: "Trần Kho Vận", userRole: "Nhân viên kho", nav: NAV_WAREHOUSE, navActive: "Kiểm hàng nhập (入荷検品)",
    sections: [
      { id: "A", name: "Tạo phiếu kiểm hàng nhập", items: [
        { t: "select", name: "Nhà cung cấp (仕入先)", req: "Có", ph: "— Chọn nhà cung cấp —", note: "Lấy từ master `suppliers`" },
        { t: "button", name: "Tạo phiếu", req: "-", note: "Người lập phiếu lấy từ phiên, không nhận từ client" },
      ]},
      { id: "B", name: "Danh sách phiếu gần đây", items: [
        { t: "table", name: "Bảng phiếu kiểm hàng nhập", req: "-",
          cols: ["Tạo lúc (JST)", "Nhà cung cấp (仕入先)", "Số dòng", "Đã xác nhận"],
          sample: [["2026-11-16 17:02", "SUP-001 · Thực phẩm Yamato", "2", "2/2"], ["2026-11-16 11:23", "SUP-001 · Thực phẩm Yamato", "1", "0/1"]],
          note: "Bấm vào thời điểm để mở phiếu" },
      ]},
      { id: "C", name: "Dòng hàng — thông tin nhận từ nhãn", items: [
        { t: "select", name: "Mã hàng (SKU)", req: "Có", note: "Quyết định dải nhiệt và loại hạn áp dụng" },
        { t: "number", name: "Số lượng nhận", req: "Có", note: "> 0" },
        { t: "number", name: "Số lượng giữ lại", req: "Không", note: "≤ số lượng nhận; phần giữ lại vào cách ly" },
        { t: "date", name: "Ngày sản xuất (製造日)", req: "Có", note: "Mốc tính quy tắc 1/3 – 1/2 ở màn Đơn xuất" },
        { t: "date", name: "Hạn trên nhãn", req: "Có", note: "Kèm loại hạn ở C-6 — hai thứ này phải khớp SKU master" },
        { t: "select", name: "Loại hạn trên nhãn: 賞味期限 (ngon nhất) / 消費期限 (an toàn)", req: "Có",
          note: "Khác loại hạn khai trong SKU master thì CHẶN xác nhận, không cho ghi đè (BR-EXP-01)" },
        { t: "select", name: "Vị trí nhập kho", req: "Có", note: "Lệch dải nhiệt giữa SKU và vị trí thì chặn hẳn" },
        { t: "text", name: "Mã lô của nhà cung cấp", req: "Không", note: "Lưu vào `supplier_lot`, mang sang lô để truy xuất ngược" },
        { t: "number", name: "Số lượng từ chối", req: "Không", note: "Tổng nhận + từ chối + giữ lại phải bằng số khai báo" },
        { t: "text", name: "Lý do từ chối hoặc giữ lại", req: "Không", note: "Bắt buộc khi số lượng từ chối hoặc giữ lại lớn hơn 0" },
        { t: "checkbox", name: "Bao bì nguyên vẹn", req: "Không", note: "Kiểm cảm quan khi nhận hàng" },
        { t: "text", name: "Ảnh chụp khi nhận — **mô phỏng**, gõ tay", req: "Không", note: "Prototype chưa có camera; ô nhập tay thay cho ảnh thật" },
      ]},
      { id: "D", name: "Đo nhiệt độ khi nhận hàng", items: [
        { t: "number", name: "Nhiệt độ đo (測定温度) °C", req: "Có", note: "So với ngưỡng của dải nhiệt SKU" },
        { t: "text", name: "Thời điểm đo (測定時刻)", req: "Có",
          note: "Chọn phiên bản ngưỡng theo THỜI ĐIỂM ĐO, không theo lúc bấm xác nhận — để phiếu cũ không bị chấm lại khi ngưỡng đổi phiên bản" },
        { t: "banner", tone: "warn", head: "Ngoài ngưỡng — lô vào khu cách ly, không vào tồn khả dụng",
          name: "Hiện ngưỡng đang áp dụng kèm số hiệu phiên bản và ngày hiệu lực, không hiển thị con số cứng.", req: "-",
          note: "Bẫy ①: ngưỡng do khách tự công bố, có phiên bản" },
      ]},
      { id: "E", name: "Trường truy xuất pháp định", items: [
        { t: "note", name: "Bẫy ⑤ — ĐỌC KỸ CỘT REQUIRED: “Có” ở khối này là CÓ ĐIỀU KIỆN, không phải luôn bắt buộc. Chỉ gạo và thịt bò thuộc diện bắt buộc, và hai nhóm này LOẠI TRỪ NHAU. Mặt hàng khác thì cả khối ẩn hoàn toàn, không hiện ô trống.", req: "-" },
        { t: "text", name: "Mã số cá thể bò (個体識別番号)", req: "Có — CHỈ với thịt bò", ph: "đúng 10 chữ số",
          note: "Đúng 10 chữ số. Nhận 9 số thì CHẶN và nói rõ không tự đệm thêm số 0 (R-06)" },
        { t: "text", name: "Thông tin xuất xứ gạo (産地情報)", req: "Có — CHỈ với gạo", note: "BR-TRACE-01. Mặt hàng khác gạo thì ô này KHÔNG hiện" },
        { t: "text", name: "Mã giao dịch gạo", req: "Có — CHỈ với gạo", note: "BR-TRACE-01 đòi cả mã giao dịch, không chỉ xuất xứ. Thiếu là thiếu một nửa luồng truy xuất gạo" },
      ]},
      { id: "F", name: "Xác nhận dòng hàng", items: [
        { t: "button", name: "Xác nhận dòng", req: "-", note: "Sinh lô; trạng thái lô do máy chủ suy ra, client không gửi lên" },
        { t: "button", name: "Lưu nháp", req: "-", variant: "ghost" },
        { t: "banner", tone: "danger", head: "Chặn xác nhận — nêu đúng trường sai",
          name: "Thiếu trường truy xuất, sai loại hạn, hoặc lệch dải nhiệt giữa SKU và vị trí.", req: "-" },
        { t: "badge", name: "Đã xác nhận → lô sinh ra", req: "-", note: "Hai trục TÁCH BIỆT: nguồn lô (`source_kind` = nhận / giữ lại) và trạng thái (`status` = khả dụng / cách ly / đã huỷ). Đừng trộn" },
      ]},
    ],
  },

  // ---------------------------------------------------------------- SC4-02
  {
    id: "SC4-02", feature: "inventory",
    title: "Tồn kho theo 3 dải nhiệt (三温度帯)",
    lead: "Tồn theo lô. Hai loại hạn hiển thị khác nhau: 消費期限 chặn phân bổ, 賞味期限 chỉ cảnh báo.",
    roles: "cả 4 vai (xem) · qa_haccp (giải phóng / huỷ lô)",
    reqs: ["FR-INV-05", "FR-INV-06", "FR-REC-05", "BR-TEMP-01", "BR-EXP-01", "BR-EXP-02"],
    user: "Lê Chất Lượng", userRole: "QA / HACCP", nav: NAV_QA, navActive: "Tồn kho",
    sections: [
      { id: "A", name: "Bộ lọc", items: [
        { t: "select", name: "Dải nhiệt: Thường (常温) / Mát (冷蔵) / Đông (冷凍)", req: "Không" },
        { t: "select", name: "Trạng thái lô", req: "Không", note: "Đúng ba giá trị: khả dụng · cách ly · đã huỷ. “Đã giữ” KHÔNG phải trạng thái mà là nguồn lô (`source_kind`), lọc riêng" },
        { t: "text", name: "Tìm theo mã hàng hoặc mã lô", req: "Không" },
      ]},
      { id: "B", name: "Tổng quan 3 dải nhiệt", items: [
        { t: "table", name: "Tồn theo dải nhiệt", req: "-",
          cols: ["Dải nhiệt", "Ngưỡng đang áp dụng (phiên bản)", "Số lô khả dụng", "Số lô cách ly"],
          sample: [["Thường (常温)", "v1: 15,0 – 25,0 °C", "12", "0"], ["Mát (冷蔵)", "v1: 0,0 – 5,0 °C", "18", "2"], ["Đông (冷凍)", "v1: ≤ −18,0 °C", "9", "1"]],
          note: "Ngưỡng đọc từ phiên bản hiệu lực, KHÔNG hard-code (bẫy ①)" },
      ]},
      { id: "C", name: "Danh sách lô", items: [
        { t: "table", name: "Bảng lô", req: "-", rows: 4,
          cols: ["Mã lô", "Mã hàng", "Hạn + loại hạn", "Số lượng", "Vị trí", "Trạng thái"],
          sample: [["LOT-CHI-002-B", "CHI-002", "2027-01-20 · 消費期限", "120", "C-01-03", "Khả dụng"],
            ["LOT-CHI-003-X", "CHI-003", "2026-12-02 · 消費期限", "60", "C-02-01", "Khả dụng"],
            ["LOT-AMB-001-A", "AMB-001", "2027-04-10 · 賞味期限", "200", "A-01-01", "Khả dụng"],
            ["LOT-FRO-002-S", "FRO-002", "2027-03-01 · 消費期限", "45", "F-Q-01", "Cách ly"]] },
        { t: "note", name: "Bẫy ②: 消費期限 chạm hạn thì CHẶN phân bổ; 賞味期限 chỉ cảnh báo vàng, vẫn phân bổ được. Hai loại hạn không được gộp làm một.", req: "-" },
      ]},
      { id: "D", name: "Thao tác của QA trên lô cách ly", items: [
        { t: "button", name: "Giải phóng lô", req: "-", note: "Chỉ qa_haccp. Chuyển cách ly → khả dụng" },
        { t: "button", name: "Huỷ lô", req: "-", variant: "ghost", note: "Chỉ qa_haccp. Không quay lại được" },
        { t: "textarea", name: "Lý do (bắt buộc, vào sổ chỉ-ghi-thêm)", req: "Có",
          note: "Ghi vào `lot_status_events`, bảng chỉ-ghi-thêm, trigger chặn sửa và xoá" },
        { t: "button", name: "Chuyển lô sang cách ly (隔離)", req: "-", variant: "ghost",
          note: "Chỉ qa_haccp. Dùng khi cảnh báo nhiệt chỉ ra lô nằm trong vùng ảnh hưởng — hệ thống chưa tự cách ly, xem GAP-02" },
      ]},
    ],
  },

  // ---------------------------------------------------------------- SC4-03
  {
    id: "SC4-03", feature: "outbound",
    title: "Đơn xuất và phân bổ lô (出荷指示)",
    lead: "FEFO không phải quy tắc cuối cùng. Lô bị loại ở bước nào thì màn phải nói rõ bước đó.",
    roles: "dispatcher (ghi) · admin (xem)",
    reqs: ["FR-OUT-01", "FR-OUT-02", "BR-FEFO-01", "BR-DATE-01", "BR-EXP-02"],
    user: "Phạm Điều Phối", userRole: "Điều phối", nav: NAV_DISPATCH, navActive: "Đơn xuất (出荷指示)",
    sections: [
      { id: "A", name: "Tạo đơn xuất", items: [
        { t: "select", name: "Khách hàng (得意先)", req: "Có", note: "Quyết định hợp đồng và lịch sử giao dùng để so 日付逆転" },
        { t: "select", name: "Mã hàng (SKU)", req: "Có", note: "Một đơn một SKU" },
        { t: "number", name: "Số lượng", req: "Có", note: "Không phân bổ một phần: thiếu hàng thì báo thiếu, đơn giữ nguyên" },
        { t: "date", name: "Ngày giao yêu cầu (納品希望日)", req: "Có" },
        { t: "button", name: "Tạo đơn và phân bổ lô", req: "-" },
      ]},
      { id: "B", name: "Hợp đồng áp dụng", items: [
        { t: "table", name: "Hợp đồng của cặp khách–SKU", req: "-", rows: 1,
          cols: ["Mã hợp đồng", "Quy tắc cửa sổ giao", "Hiệu lực từ"],
          sample: [["AGR-003", "ONE_THIRD (quy tắc 1/3)", "2026-01-01"]] },
        { t: "banner", tone: "warn", head: "Hợp đồng chưa chốt quy tắc cửa sổ giao → đơn vào trạng thái chờ duyệt tay",
          name: "Hệ thống KHÔNG tự suy ra quy tắc 1/3. Bẫy ③: đây là tập quán hợp đồng, không phải hạn dùng thật của hàng.", req: "-" },
      ]},
      { id: "C", name: "Kết quả phân bổ lô", items: [
        { t: "table", name: "Lô được chọn", req: "-", rows: 1,
          cols: ["Mã lô", "Hạn + loại hạn", "Số lượng", "Vị trí"],
          sample: [["LOT-CHI-002-B", "2027-01-20 · 消費期限", "100", "C-01-03"]] },
        { t: "badge", name: "Trạng thái đơn: đã phân bổ / chờ duyệt tay / thiếu hàng", req: "-",
          note: "Trạng thái do máy chủ suy ra từ dữ liệu, client không gửi lên được" },
      ]},
      { id: "D", name: "Vì sao các lô khác bị loại — bảng giải trình", items: [
        { t: "note", name: "Đây là phần quan trọng nhất của màn. Không có nó thì người dùng không hiểu vì sao hệ thống bỏ qua lô hạn sớm nhất và sẽ nghi hệ thống sai.", req: "-" },
        { t: "table", name: "Bảng lô bị loại theo từng bước", req: "-", rows: 4,
          cols: ["Mã lô", "Hạn", "Bị loại ở bước", "Giải thích"],
          sample: [["LOT-CHI-002-Q", "2026-12-30", "Cách ly", "Lô đang ở khu cách ly"],
            ["LOT-CHI-002-A", "2026-12-25", "日付逆転", "Hạn sớm hơn lần giao gần nhất cho đúng khách này (2027-01-05)"],
            ["LOT-CHI-002-C", "2027-02-10", "Cửa sổ giao 1/3", "Quá mốc 1/3 hạn dùng tính từ ngày sản xuất"],
            ["LOT-CHI-002-B", "2027-01-20", "— được chọn —", "Qua hết các bước, hạn sớm nhất trong số còn lại (FEFO)"]] },
        { t: "note", name: "Thứ tự bước cố định: hạn an toàn → dải nhiệt → cách ly → cửa sổ giao → 日付逆転 → FEFO. Đổi thứ tự là đổi kết quả.", req: "-" },
      ]},
      { id: "E", name: "Xác nhận giao hàng", items: [
        { t: "text", name: "Tên người nhận", req: "Có" },
        { t: "textarea", name: "Bằng chứng giao hàng (POD) — mô phỏng, gõ tay", req: "Có", note: "Prototype chưa có chữ ký số hay ảnh thật" },
        { t: "button", name: "Xác nhận đã giao", req: "-",
          note: "Ghi vào lịch sử giao. Luật 日付逆転 kiểm LẠI ở tầng bảng tại đây, không chỉ lúc phân bổ (mã lỗi SHP01)" },
      ]},
    ],
  },

  // ---------------------------------------------------------------- SC4-04
  {
    id: "SC4-04", feature: "routing",
    title: "Lập tuyến giao (配送計画)",
    lead: "Giới hạn giờ lái là ràng buộc cứng: vi phạm thì không công bố được tuyến, không phải chỉ cảnh báo.",
    roles: "dispatcher (ghi) · admin (xem)",
    reqs: ["FR-SCH-01", "FR-SCH-02", "FR-SCH-04", "OPS-LAW-01"],
    user: "Phạm Điều Phối", userRole: "Điều phối", nav: NAV_DISPATCH, navActive: "Lập tuyến (配送計画)",
    sections: [
      { id: "A", name: "Thông tin tuyến", items: [
        { t: "date", name: "Ngày chạy tuyến", req: "Có", note: "Quyết định phiên bản bộ quy tắc giờ lái được áp dụng" },
        { t: "select", name: "Tài xế", req: "Có" },
        { t: "select", name: "Xe", req: "Có", note: "Dải nhiệt của xe phải phủ được dải nhiệt của hàng trên tuyến" },
        { t: "badge", name: "Trạng thái tuyến: nháp / đã kiểm / đã công bố", req: "-" },
      ]},
      { id: "B", name: "Các đoạn thời gian trong ngày", items: [
        { t: "table", name: "Bảng đoạn", req: "-", rows: 4,
          cols: ["Thứ tự", "Loại đoạn", "Bắt đầu", "Kết thúc"],
          sample: [["1", "Lái", "06:00", "10:30"], ["2", "Nghỉ", "10:30", "11:00"], ["3", "Lái", "11:00", "14:00"], ["4", "Giao hàng", "14:00", "15:00"]] },
        { t: "button", name: "Thêm đoạn", req: "-", variant: "ghost" },
        { t: "note", name: "Chữ “Nghỉ” ở đây là đoạn dừng trong một tuyến giao. KHÔNG dịch thành 休息期間 — RFP dùng từ đó cho khái niệm luật lao động, nghĩa khác hẳn.", req: "-" },
      ]},
      { id: "C", name: "Kết quả kiểm giờ lái (改善基準告示)", items: [
        { t: "table", name: "Bảng kiểm từng ngưỡng", req: "-", rows: 3,
          cols: ["Ngưỡng", "Giới hạn", "Tuyến này", "Kết quả"],
          sample: [["Lái liên tục", "≤ 4 giờ", "4 giờ 30", "VI PHẠM"], ["Thời gian ràng buộc ngày", "13 giờ (tối đa 15)", "9 giờ 00", "Đạt"], ["Nghỉ giữa hai đoạn lái", "≥ 30 phút", "30 phút", "Đạt"]] },
        { t: "banner", tone: "danger", head: "Vi phạm lái liên tục — không công bố được tuyến",
          name: "Chèn một đoạn nghỉ đủ dài để cắt chuỗi lái liên tục, rồi kiểm lại.", req: "-",
          note: "Bẫy ⑥: đây là ràng buộc cứng, không phải cảnh báo bỏ qua được" },
        { t: "button", name: "Kiểm lại giờ lái", req: "-", variant: "ghost",
          note: "Máy chủ tự kiểm lại trong CSDL khi công bố, không tin kết quả client gửi lên" },
      ]},
      { id: "D", name: "Đơn gắn vào tuyến", items: [
        { t: "table", name: "Bảng đơn trên tuyến", req: "-", rows: 2,
          cols: ["Mã đơn", "Khách hàng", "Dải nhiệt", "Thứ tự giao"],
          sample: [["ORD-20261116-A1B2C3", "CUS-003 · Siêu thị Sakura", "Mát (冷蔵)", "1"], ["ORD-20261116-D4E5F6", "CUS-001 · Chuỗi Midori", "Đông (冷凍)", "2"]] },
      ]},
      { id: "E", name: "Công bố tuyến", items: [
        { t: "button", name: "Công bố tuyến", req: "-", note: "Khoá lại khi còn vi phạm giờ lái" },
        { t: "note", name: "Tuyến đã công bố thì prototype không cho sửa. Thiết kế đúng cho phép sửa có lý do và sinh phiên bản mới → GAP", req: "-" },
      ]},
    ],
  },

  // ---------------------------------------------------------------- SC4-05
  {
    id: "SC4-05", feature: "alarms",
    title: "Cảnh báo nhiệt độ (温度逸脱)",
    lead: "Reading ngoài ngưỡng liên tiếp gom thành một cảnh báo. Đóng cảnh báo bắt buộc có ghi chú xử lý.",
    roles: "qa_haccp (ghi) · admin (xem)",
    reqs: ["FR-TEMP-02", "FR-TEMP-03", "BR-TEMP-01", "BR-HACCP-01", "DR-TEMP-01"],
    user: "Lê Chất Lượng", userRole: "QA / HACCP", nav: NAV_QA, navActive: "Cảnh báo nhiệt (温度逸脱)",
    sections: [
      { id: "A", name: "Đánh giá lại chuỗi reading", items: [
        { t: "button", name: "Đánh giá reading", req: "-", note: "Chỉ qa_haccp. Quét reading trong cửa sổ thời gian, gom đoạn vượt ngưỡng liên tiếp thành cảnh báo" },
        { t: "note", name: "Giá trị đúng biên ngưỡng là ĐẠT, không sinh cảnh báo.", req: "-" },
      ]},
      { id: "B", name: "Hàng đợi cảnh báo", items: [
        { t: "table", name: "Bảng cảnh báo", req: "-", rows: 2,
          cols: ["Zone / dải nhiệt", "Thời điểm vượt", "Ngưỡng (phiên bản)", "Đỉnh", "Kéo dài", "Trạng thái"],
          sample: [["Zone F · Đông (冷凍)", "2026-11-15 14:30", "v1: ≤ −18,0 °C", "−15,0 °C", "30 phút", "Đang mở"],
            ["Zone C · Mát (冷蔵)", "2026-11-15 12:00", "v1: 0,0 – 5,0 °C", "6,2 °C", "45 phút", "Đang mở"]] },
        { t: "badge", name: "SLA xác nhận 15 phút — quá hạn thì tô đỏ", req: "-", note: "15 phút là giả định lấy từ baseline của RFP, CẦN XÁC NHẬN với khách" },
      ]},
      { id: "C", name: "Chi tiết cảnh báo", items: [
        { t: "label", name: "Số liệu bằng chứng: đỉnh nhiệt, thời điểm bắt đầu và kết thúc, thời lượng", req: "-",
          note: "Máy tính ra, người dùng KHÔNG sửa được (mã lỗi ALM02)" },
        { t: "table", name: "Lô nằm trong vùng ảnh hưởng", req: "-", rows: 3,
          cols: ["Mã lô", "Mã hàng", "Số lượng", "Trạng thái hiện tại"],
          sample: [["LOT-CHI-001-A", "CHI-001", "80", "Khả dụng"], ["LOT-CHI-002-A", "CHI-002", "120", "Khả dụng"], ["LOT-CHI-002-B", "CHI-002", "100", "Khả dụng"]] },
        { t: "note", name: "Hệ thống chỉ LIỆT KÊ lô ảnh hưởng, chưa tự cách ly. QA tự cách ly ở màn Tồn kho → GAP", req: "-" },
      ]},
      { id: "D", name: "Ghi xử lý và đóng cảnh báo", items: [
        { t: "textarea", name: "Nội dung xử lý", req: "Có",
          note: "Bắt buộc. Đóng mà bỏ trống thì bị chặn ở tầng bảng (mã lỗi ALM03)" },
        { t: "button", name: "Đóng cảnh báo", req: "-",
          note: "Người xử lý và thời điểm do máy chủ ghi, client không gửi lên. Cảnh báo đã đóng là bất biến (ALM01)" },
      ]},
    ],
  },

  // ---------------------------------------------------------------- SC4-06
  {
    id: "SC4-06", feature: "traceability",
    title: "Truy xuất nguồn gốc (トレーサビリティ)",
    lead: "Truy xuất pháp định chỉ bắt buộc với gạo và thịt bò. Mặt hàng khác là khuyến khích, không chặn.",
    roles: "cả 4 vai (xem)",
    reqs: ["FR-TRC-01", "FR-TRC-02", "BR-TRACE-01", "BR-TRACE-02"],
    user: "Lê Chất Lượng", userRole: "QA / HACCP", nav: NAV_QA, navActive: "Truy xuất",
    sections: [
      { id: "A", name: "Tra cứu", items: [
        { t: "select", name: "Tra theo khoá", req: "Có",
          note: "Bảy loại prototype có: mã lô, số lô NCC, mã cá thể bò, xuất xứ gạo, mã giao dịch gạo, mã khách, mã đơn. FR-TRC-01 còn đòi mã hàng và nhà cung cấp — hai khoá này prototype THIẾU, xem GAP-21" },
        { t: "text", name: "Giá trị cần tra", req: "Có", ph: "LOT-CHI-002-B" },
        { t: "note", name: "Danh sách khoá đầy đủ ở mục 4.2 của screen spec — đừng đọc riêng bảng này rồi thu hẹp xuống vài khoá.", req: "-" },
        { t: "button", name: "Tra cứu", req: "-" },
      ]},
      { id: "B", name: "Chuỗi truy xuất — ngược về nguồn", items: [
        { t: "table", name: "Bảng chuỗi", req: "-", rows: 4,
          cols: ["Mắt xích", "Mã", "Thời điểm", "Ghi chú"],
          sample: [["Nhà cung cấp", "SUP-001 · Thực phẩm Yamato", "2026-11-10", "Nhãn giả"],
            ["Phiếu kiểm nhập", "RCP-0007", "2026-11-10 09:15", "Nhiệt đo 3,2 °C · đạt"],
            ["Lô", "LOT-CHI-002-B", "2026-11-10 09:20", "Hạn 2027-01-20 · 消費期限"],
            ["Đơn đã giao", "ORD-20261112-X7Y8Z9", "2026-11-12 14:00", "CUS-003 · Siêu thị Sakura"]] },
      ]},
      { id: "C", name: "Trường truy xuất pháp định", items: [
        { t: "banner", tone: "info", head: "Mặt hàng này thuộc diện bắt buộc truy xuất",
          name: "Chỉ hiện với gạo và thịt bò. Mặt hàng khác thì khối này ẩn và ghi rõ là khuyến khích, không bắt buộc.", req: "-",
          note: "Bẫy ⑤: đừng áp nhầm quy định bắt buộc cho toàn bộ mặt hàng" },
        { t: "label", name: "Mã số cá thể bò (個体識別番号): đúng 10 chữ số", req: "-" },
        { t: "label", name: "Thông tin xuất xứ gạo (産地情報)", req: "-" },
      ]},
    ],
  },

  // ---------------------------------------------------------------- SC4-07
  {
    id: "SC4-07", feature: "master",
    title: "Master và ngưỡng nhiệt (マスタ・温度基準)",
    lead: "Ngưỡng 3 dải do chính khách công bố và có phiên bản. Không bao giờ hard-code số trong mã nguồn.",
    roles: "admin (master data) · qa_haccp (ngưỡng nhiệt)",
    reqs: ["DR-MST-01", "BR-TEMP-01"],
    user: "Lê Chất Lượng", userRole: "QA / HACCP", nav: NAV_QA, navActive: "Master & chính sách",
    sections: [
      { id: "A", name: "Chọn nhóm dữ liệu", items: [
        { t: "select", name: "Nhóm: Mã hàng / Khách hàng / Nhà cung cấp / Vị trí / Hợp đồng giao / Ngưỡng nhiệt", req: "Có" },
      ]},
      { id: "B", name: "Ngưỡng nhiệt 3 dải — các phiên bản", items: [
        { t: "table", name: "Bảng phiên bản ngưỡng", req: "-", rows: 3,
          cols: ["Phiên bản", "Dải nhiệt", "Ngưỡng dưới", "Ngưỡng trên", "Hiệu lực từ", "Người tạo"],
          sample: [["v1", "Thường (常温)", "15,0 °C", "25,0 °C", "2026-01-01", "Lê Chất Lượng"],
            ["v1", "Mát (冷蔵)", "0,0 °C", "5,0 °C", "2026-01-01", "Lê Chất Lượng"],
            ["v1", "Đông (冷凍)", "—", "−18,0 °C", "2026-01-01", "Lê Chất Lượng"]] },
        { t: "note", name: "Phiên bản cũ là bất biến: không sửa, không xoá. Phiếu nhập cũ vẫn được chấm theo phiên bản hiệu lực tại thời điểm đo.", req: "-" },
      ]},
      { id: "C", name: "Tạo phiên bản ngưỡng mới", items: [
        { t: "select", name: "Dải nhiệt áp dụng", req: "Có" },
        { t: "number", name: "Ngưỡng dưới °C", req: "Không", note: "Để trống nghĩa là không giới hạn dưới" },
        { t: "number", name: "Ngưỡng trên °C", req: "Không", note: "Ngưỡng dưới lớn hơn ngưỡng trên thì bị chặn (mã lỗi TMP02)" },
        { t: "date", name: "Hiệu lực từ", req: "Có",
          note: "Không được đặt ngày trong quá khứ — chặn hồi tố (mã lỗi TMP01)" },
        { t: "button", name: "Tạo phiên bản", req: "-",
          note: "Chỉ qa_haccp. Số hiệu phiên bản và người tạo do máy chủ cấp, client không gửi lên" },
        { t: "banner", tone: "warn", head: "Chỉ vai QA / HACCP tạo được phiên bản ngưỡng",
          name: "Vai Quản trị xem được màn này nhưng không tạo được phiên bản — phân tách nhiệm vụ có chủ ý.", req: "-" },
      ]},
      { id: "D", name: "Danh mục master dùng chung", items: [
        { t: "table", name: "Bảng bản ghi master", req: "-", rows: 3,
          cols: ["Mã", "Tên", "Thuộc tính chính", "Cập nhật lúc"],
          sample: [["CHI-002", "Thịt bò thăn (nhãn giả)", "Mát · 消費期限 · truy xuất BẮT BUỘC", "2026-11-14"],
            ["AMB-001", "Gạo Koshihikari (nhãn giả)", "Thường · 賞味期限 · truy xuất BẮT BUỘC", "2026-11-14"],
            ["FRO-002", "Cá hồi phi lê (nhãn giả)", "Đông · 消費期限 · khuyến khích", "2026-11-14"]] },
        { t: "button", name: "Thêm bản ghi", req: "-", variant: "ghost", note: "Chỉ admin" },
      ]},
    ],
  },
];
