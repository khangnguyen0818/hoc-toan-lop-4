'use strict';
/* Nội dung bám theo SGK Toán 4 – bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam).
   Mỗi bài: learn (thẻ bài học), game (trò chơi), gen() sinh câu hỏi cho trò chơi & bài kiểm tra. */

/* ---- tiện ích riêng lớp 4 ---- */
const simp = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const FS = s => /\//.test(s) ? F(...s.split('/')) : s;
/* Câu hỏi có đáp án là phân số (hoặc số) – nhập bằng bàn phím có dấu “/” hoặc chọn đáp án */
function fq(q, a, ex, o = {}) {
  const useMC = o.mc === undefined ? Math.random() < .5 : o.mc;
  if (useMC) return { q, a, choices: /\//.test(a) ? fracChoices(...a.split('/').map(Number)) : numChoices(+a), ex, exact: o.exact, pair: o.pair };
  return { q, a, input: true, frac: true, ex, exact: o.exact, pair: o.pair };
}
const HANG = ['đơn vị', 'chục', 'trăm', 'nghìn', 'chục nghìn', 'trăm nghìn', 'triệu', 'chục triệu', 'trăm triệu'];
const LOP = i => i < 3 ? 'lớp đơn vị' : i < 6 ? 'lớp nghìn' : 'lớp triệu';
const steps = (...lines) => `<div class="giai"><b>Bài giải</b><br>${lines.join('<br>')}</div>`;
const ageKind = d => d < 90 ? 'Góc nhọn' : d === 90 ? 'Góc vuông' : d < 180 ? 'Góc tù' : 'Góc bẹt';
const memoList = ids => '<ul class="recap">' + ids.map(id => { const l = BYID_RAW[id]; return `<li><b>Bài ${l.so}. ${l.title}</b><br>${l.memo}</li>`; }).join('') + '</ul>';
const BYID_RAW = {};
function bigNum(minLen, maxLen) { const L = R(minLen, maxLen); let s = String(R(1, 9)); for (let i = 1; i < L; i++) s += R(0, 9); return +s; }
function fracPair(maxD = 12) { const d = R(3, maxD), n = R(1, d - 1); return [n, d]; }

const BOOK = [
/* ================= TẬP MỘT ================= */
{ tap: 1, name: 'Tập một', topics: [

{ id: 'c1', no: 1, name: 'Ôn tập và bổ sung', hue: 1, lessons: [
{ id: 'b1', so: 1, title: 'Ôn tập các số đến 100 000', game: 'sort', sort: [10000, 99999],
  memo: 'Số có năm chữ số gồm chục nghìn, nghìn, trăm, chục, đơn vị. So sánh từ hàng cao nhất.',
  learn: [
    { t: 'Đọc, viết số có năm chữ số', h: `<div class="scrollx"><table class="tbl"><tr><th>Chục nghìn</th><th>Nghìn</th><th>Trăm</th><th>Chục</th><th>Đơn vị</th></tr><tr><td>4</td><td>7</td><td>3</td><td>0</td><td>5</td></tr></table></div><p>Viết số: <b class="hl">${fN(47305)}</b>. Đọc số: <i>${docSo(47305)}</i>.</p><p class="tip">Viết số có nhiều chữ số, ta tách thành từng lớp 3 chữ số từ phải sang trái cho dễ đọc.</p>` },
    { t: 'Viết số thành tổng', h: `<p class="eq">${fN(47305)} = ${fN(40000)} + ${fN(7000)} + 300 + 5</p><p>Chữ số 7 ở hàng nghìn nên có giá trị là ${fN(7000)}.</p>` },
    { t: 'So sánh số', h: `<p class="eq">${fN(58213)} &gt; ${fN(57999)}</p><p>Hai số đều có năm chữ số. Hàng chục nghìn bằng nhau (5), so sánh hàng nghìn: 8 &gt; 7.</p><div class="memo"><b>Ghi nhớ:</b> Số nào có nhiều chữ số hơn thì lớn hơn. Nếu số chữ số bằng nhau thì so sánh từng cặp chữ số từ trái sang phải.</div>` }
  ],
  gen() { return pick([
    () => { const n = bigNum(5, 5); return mc(`<p>Số “<b>${docSo(n)}</b>” viết là:</p>`, fN(n), fill4(n, [+String(n).split('').reverse().join('') || n + 1, n + 1000, n - 100, n + 10], 10000, 99999), `“${docSo(n)}” viết là ${fN(n)}.`); },
    () => { const n = bigNum(5, 5); const s = String(n); const i = R(0, 4); const pos = 4 - i; return mc(`<p>Trong số <b>${fN(n)}</b>, chữ số <b class="hl">${s[i]}</b> (thứ ${i + 1} từ trái sang) thuộc hàng nào?</p>`, HANG[pos], HANG.slice(0, 5), `${fN(n)}: chữ số ${s[i]} ở hàng ${HANG[pos]}.`); },
    () => { const a = bigNum(5, 5); const b = pick([a + R(1, 9) * 10, a - R(1, 9) * 1000, bigNum(5, 5), a]); return cmpQ(a, Math.max(10000, Math.min(99999, b))); },
    () => { const n = bigNum(5, 5); const d = String(n).split('').map(Number); const parts = d.map((x, i) => x * 10 ** (4 - i)); const k = R(0, 4); if (!parts[k]) return inp(`<p>Số liền sau của <b>${fN(n)}</b> là số nào?</p>`, n + 1, `${fN(n)} + 1 = ${fN(n + 1)}.`); return inp(`<p>Điền số thích hợp:</p><p class="eq">${fN(n)} = ${parts.map((p, i) => i === k ? '<span class="slot">?</span>' : fN(p)).filter((p, i) => parts[i] || i === k).join(' + ')}</p>`, parts[k], `Chữ số ${d[k]} ở hàng ${HANG[4 - k]} có giá trị ${fN(parts[k])}.`); },
    () => { const n = bigNum(5, 5); const r = Math.round(n / 1000) * 1000; return mc(`<p>Làm tròn số <b>${fN(n)}</b> đến hàng nghìn ta được:</p>`, fN(r), fill4(r, [Math.floor(n / 1000) * 1000 === r ? r + 1000 : r - 1000, Math.round(n / 100) * 100, Math.round(n / 10000) * 10000]), `Chữ số hàng trăm là ${String(n)[2]} ${+String(n)[2] >= 5 ? '≥ 5 nên làm tròn lên' : '< 5 nên làm tròn xuống'}: ${fN(r)}.`); }
  ])(); } },

{ id: 'b2', so: 2, title: 'Ôn tập các phép tính trong phạm vi 100 000', game: 'memory',
  memo: 'Biểu thức có nhân, chia và cộng, trừ thì làm nhân, chia trước; có ngoặc thì làm trong ngoặc trước.',
  learn: [
    { t: 'Đặt tính cộng, trừ', h: `<div class="pair2">${vCol(35246, 27518, '+', '62764')}${vCol(80415, 36279, '−', '44136')}</div><p>Viết các chữ số cùng hàng thẳng cột, tính từ phải sang trái, nhớ sang hàng bên trái khi cần.</p>` },
    { t: 'Nhân, chia với số có một chữ số', h: `<div class="pair2">${vCol(12407, 4, '×', '49628')}<div><p>• 4 nhân 7 bằng 28, viết 8 nhớ 2.<br>• 4 nhân 0 bằng 0, thêm 2 bằng 2…</p><p class="eq">${fN(49628)} : 4 = ${fN(12407)}</p></div></div>` },
    { t: 'Thứ tự thực hiện phép tính', h: `<p class="eq">${fN(2000)} + ${fN(3000)} × 2 = ${fN(2000)} + ${fN(6000)} = ${fN(8000)}</p><p class="eq">(${fN(2000)} + ${fN(3000)}) × 2 = ${fN(5000)} × 2 = ${fN(10000)}</p><div class="memo"><b>Ghi nhớ:</b> Trong ngoặc trước; nhân, chia trước; cộng, trừ sau.</div>` }
  ],
  gen() { return pick([
    () => { const a = R(10000, 59999), b = R(1000, 39999); return calcQ(a, b, '+', { col: Math.random() < .4 }); },
    () => { const a = R(30000, 99999), b = R(1000, a - 1000); return calcQ(a, b, '-', { col: Math.random() < .4 }); },
    () => { const b = R(2, 9), a = R(1000, Math.floor(99999 / b)); return calcQ(a, b, '×'); },
    () => { const b = R(2, 9), q = R(1000, Math.floor(99999 / b)); return calcQ(b * q, b, ':'); },
    () => { const a = R(1, 9) * 1000, b = R(1, 5) * 1000, k = R(2, 4); const br = Math.random() < .5; const v = br ? (a + b) * k : a + b * k; return inp(`<p>Tính giá trị của biểu thức:</p><p class="eq">${br ? `(${fN(a)} + ${fN(b)}) × ${k}` : `${fN(a)} + ${fN(b)} × ${k}`}</p>`, v, br ? `Làm trong ngoặc trước: ${fN(a + b)} × ${k} = ${fN(v)}.` : `Nhân trước: ${fN(b)} × ${k} = ${fN(b * k)}; rồi ${fN(a)} + ${fN(b * k)} = ${fN(v)}.`); }
  ])(); } },

{ id: 'b3', so: 3, title: 'Số chẵn, số lẻ', game: 'balloon',
  memo: 'Số có chữ số tận cùng 0, 2, 4, 6, 8 là số chẵn; tận cùng 1, 3, 5, 7, 9 là số lẻ.',
  learn: [
    { t: 'Số chẵn và số lẻ', h: `${vLine(0, 1)}<p>Các số <b>0, 2, 4, 6, 8, 10…</b> là <b>số chẵn</b> (chia hết cho 2).</p><p>Các số <b>1, 3, 5, 7, 9…</b> là <b>số lẻ</b>.</p>` },
    { t: 'Nhìn chữ số tận cùng', h: `<p><b>${fN(3574)}</b> tận cùng là 4 → số chẵn.</p><p><b>${fN(20819)}</b> tận cùng là 9 → số lẻ.</p><div class="memo">Hai số chẵn (hoặc hai số lẻ) liên tiếp hơn kém nhau <b>2</b> đơn vị.</div>` }
  ],
  gen() { return pick([
    () => { const ev = Math.random() < .5; const nums = shuffle([R(100, 9999) * 2 + (ev ? 0 : 1), R(100, 9999) * 2 + (ev ? 1 : 0), R(100, 9999) * 2 + (ev ? 1 : 0), R(100, 9999) * 2 + (ev ? 1 : 0)]); const a = nums.find(x => x % 2 === (ev ? 0 : 1)); return mc(`<p>Số nào là số <b>${ev ? 'chẵn' : 'lẻ'}</b>?</p>`, fN(a), nums.map(fN), `${fN(a)} có chữ số tận cùng là ${a % 10}.`); },
    () => { const n = R(1000, 99999); const ev = Math.random() < .5; const v = ev ? (n % 2 ? n + 1 : n + 2) : (n % 2 ? n + 2 : n + 1); return inp(`<p>Số <b>${ev ? 'chẵn' : 'lẻ'}</b> liền sau số <b>${fN(n)}</b> là số nào?</p>`, v, `Số ${ev ? 'chẵn' : 'lẻ'} liền sau ${fN(n)} là ${fN(v)}.`); },
    () => { const a = R(10, 40), b = a + R(6, 15); let c = 0; for (let i = a; i <= b; i++) if (i % 2 === 0) c++; return inp(`<p>Từ <b>${a}</b> đến <b>${b}</b> có bao nhiêu số chẵn?</p>`, c, `Đếm các số chẵn từ ${a} đến ${b}: có ${c} số.`); },
    () => { const n = R(10, 999) * 10 + R(0, 9); return mc(`<p>Số <b>${fN(n)}</b> là số chẵn hay số lẻ?</p>`, n % 2 ? 'Số lẻ' : 'Số chẵn', ['Số chẵn', 'Số lẻ'], `Chữ số tận cùng là ${n % 10}.`); }
  ])(); } },

{ id: 'b4', so: 4, title: 'Biểu thức chứa chữ', game: 'race',
  memo: 'Thay chữ bằng số rồi tính giá trị của biểu thức.',
  learn: [
    { t: 'Biểu thức chứa một chữ', h: `<p><b>a + 25</b> là biểu thức chứa một chữ.</p><p>Nếu a = 17 thì a + 25 = 17 + 25 = <b class="hl">42</b>. Ta nói 42 là <b>một giá trị</b> của biểu thức a + 25.</p>` },
    { t: 'Biểu thức chứa hai, ba chữ', h: `<p>Với a = 6, b = 4: a × b = 6 × 4 = <b>24</b>.</p><p>Với a = 10, b = 7, c = 5: a + b − c = 10 + 7 − 5 = <b>12</b>.</p>` },
    { t: 'Công thức chu vi', h: `${vShape4('vuong')}<p>Chu vi hình vuông cạnh a: <b class="eq">P = a × 4</b></p><p>Hình vuông cạnh 7 cm có chu vi: 7 × 4 = 28 (cm).</p><div class="memo">Chu vi hình chữ nhật: <b>P = (a + b) × 2</b> (a là chiều dài, b là chiều rộng).</div>` }
  ],
  gen() { return pick([
    () => { const a = R(12, 500), b = R(10, 300); return inp(`<p>Tính giá trị của biểu thức <b>a + ${b}</b> với <b>a = ${a}</b>.</p>`, a + b, `${a} + ${b} = ${a + b}`); },
    () => { const a = R(3, 25), b = R(2, 9); return inp(`<p>Tính giá trị của biểu thức <b>a × b</b> với <b>a = ${a}</b>, <b>b = ${b}</b>.</p>`, a * b, `${a} × ${b} = ${a * b}`); },
    () => { const a = R(20, 90), b = R(10, 60), c = R(5, Math.min(a + b - 1, 50)); return inp(`<p>Tính giá trị của biểu thức <b>a + b − c</b> với a = ${a}, b = ${b}, c = ${c}.</p>`, a + b - c, `${a} + ${b} − ${c} = ${a + b - c}`); },
    () => { const a = R(3, 30); return inp(`<p>Hình vuông có cạnh <b>a = ${a} cm</b>. Tính chu vi P = a × 4 (cm).</p>${vShape4('vuong')}`, a * 4, `P = ${a} × 4 = ${a * 4} (cm)`); },
    () => { const a = R(8, 30), b = R(3, a - 1); return inp(`<p>Hình chữ nhật có chiều dài a = ${a} cm, chiều rộng b = ${b} cm. Tính chu vi P = (a + b) × 2 (cm).</p>${vShape4('cn')}`, (a + b) * 2, `P = (${a} + ${b}) × 2 = ${(a + b) * 2} (cm)`); }
  ])(); } },

{ id: 'b5', so: 5, title: 'Giải bài toán có ba bước tính', game: 'race',
  memo: 'Đọc kĩ đề, tìm các bước trung gian rồi mới tìm điều đề hỏi.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Một cửa hàng có 3 thùng nước cam và 2 thùng nước táo, mỗi thùng có 24 chai. Cửa hàng đã bán 50 chai. Hỏi cửa hàng còn lại bao nhiêu chai nước?</p>${steps('Số thùng nước là: 3 + 2 = 5 (thùng)', 'Số chai nước là: 24 × 5 = 120 (chai)', 'Số chai còn lại là: 120 − 50 = 70 (chai)', 'Đáp số: 70 chai nước.')}` },
    { t: 'Cách làm', h: `<div class="memo">1. Đọc đề, gạch chân cái đã cho, cái phải tìm.<br>2. Tìm xem muốn trả lời câu hỏi cần biết gì trước.<br>3. Giải từng bước, mỗi bước một câu lời giải.<br>4. Kiểm tra lại kết quả.</div>` }
  ],
  gen() { return pick([
    () => { const a = R(2, 6), b = R(2, 5), k = R(12, 30), tot = k * (a + b), s = R(10, tot - 10); return inp(`<p class="wp">Một cửa hàng có ${a} thùng nước cam và ${b} thùng nước táo, mỗi thùng có ${k} chai. Cửa hàng đã bán ${s} chai. Hỏi cửa hàng còn lại bao nhiêu chai nước?</p>`, tot - s, steps(`Số thùng: ${a} + ${b} = ${a + b} (thùng)`, `Số chai: ${k} × ${a + b} = ${tot} (chai)`, `Còn lại: ${tot} − ${s} = ${tot - s} (chai)`)); },
    () => { const a = R(5, 25), m = R(2, 4), x = R(3, a * (m + 1) - 2); return inp(`<p class="wp">Mẹ mua ${a} kg gạo nếp, số gạo tẻ gấp ${m} lần số gạo nếp. Mẹ đã dùng hết ${x} kg gạo. Hỏi mẹ còn lại bao nhiêu ki-lô-gam gạo?</p>`, a * (m + 1) - x, steps(`Gạo tẻ: ${a} × ${m} = ${a * m} (kg)`, `Cả hai loại: ${a} + ${a * m} = ${a * (m + 1)} (kg)`, `Còn lại: ${a * (m + 1)} − ${x} = ${a * (m + 1) - x} (kg)`)); },
    () => { const n = R(2, 5), boxes = n * R(2, 6), k = R(5, 12), tot = boxes * k, each = tot / n, u = R(3, each - 2); return inp(`<p class="wp">Nhà trường mua ${boxes} hộp bút, mỗi hộp có ${k} chiếc, rồi chia đều cho ${n} lớp. Mỗi lớp đã dùng ${u} chiếc bút. Hỏi mỗi lớp còn lại bao nhiêu chiếc bút?</p>`, each - u, steps(`Số bút: ${k} × ${boxes} = ${tot} (chiếc)`, `Mỗi lớp được: ${tot} : ${n} = ${each} (chiếc)`, `Còn lại: ${each} − ${u} = ${each - u} (chiếc)`)); },
    () => { const a = R(120, 300), b = R(20, 80), c = R(30, 100); return inp(`<p class="wp">Ngày thứ nhất cửa hàng bán được ${a} kg đường, ngày thứ hai bán ít hơn ngày thứ nhất ${b} kg, ngày thứ ba bán nhiều hơn ngày thứ hai ${c} kg. Hỏi ngày thứ ba bán được bao nhiêu ki-lô-gam đường?</p>`, a - b + c, steps(`Ngày thứ hai: ${a} − ${b} = ${a - b} (kg)`, `Ngày thứ ba: ${a - b} + ${c} = ${a - b + c} (kg)`)); }
  ])(); } },

{ id: 'b6', so: 6, title: 'Luyện tập chung', game: 'balloon', mix: ['b1', 'b2', 'b3', 'b4', 'b5'] }
]},

{ id: 'c2', no: 2, name: 'Góc và đơn vị đo góc', hue: 2, lessons: [
{ id: 'b7', so: 7, title: 'Đo góc, đơn vị đo góc', game: 'balloon',
  memo: 'Đơn vị đo góc là độ (°). Góc vuông 90°, góc bẹt 180°.',
  learn: [
    { t: 'Thước đo góc', h: `${vProtractor(60)}<p>Đơn vị đo góc là <b>độ</b>, kí hiệu <b class="hl">°</b>. Thước đo góc có vạch từ 0° đến 180°.</p>` },
    { t: 'Cách đo', h: `<div class="memo">1. Đặt tâm thước trùng với <b>đỉnh</b> của góc.<br>2. Một cạnh của góc đi qua vạch <b>0°</b>.<br>3. Cạnh kia đi qua vạch nào thì đó là số đo của góc.</div>${vProtractor(120)}<p>Góc trên có số đo <b>120°</b>.</p>` },
    { t: 'Các góc đặc biệt', h: `<div class="row-c">${vAngle(90, ['O', 'A', 'B'], true)}${vAngle(180, ['O', 'A', 'B'], true)}</div><p>Góc vuông bằng <b>90°</b>. Góc bẹt bằng <b>180°</b>.</p>` }
  ],
  gen() { return pick([
    () => { const d = R(1, 17) * 10; return mc(`<p>Góc dưới đây có số đo bao nhiêu độ?</p>${vProtractor(d)}`, `${d}°`, [`${d}°`, `${180 - d === d ? d + 10 : 180 - d}°`, `${d + 10}°`, `${Math.max(10, d - 10) === d ? d + 20 : Math.max(10, d - 10)}°`], `Một cạnh đi qua vạch 0°, cạnh kia đi qua vạch ${d}°.`); },
    () => pick([mc('<p>Góc vuông có số đo bằng bao nhiêu?</p>', '90°', ['45°', '90°', '100°', '180°'], 'Góc vuông bằng 90°.'), mc('<p>Góc bẹt có số đo bằng bao nhiêu?</p>', '180°', ['90°', '120°', '180°', '360°'], 'Góc bẹt bằng 180°.')]),
    () => { const d = R(1, 17) * 10; return inp(`<p>Đọc số đo của góc (độ):</p>${vProtractor(d)}`, d, `Góc có số đo ${d}°.`); },
    () => { const a = R(2, 8) * 10, b = R(2, 8) * 10; return cmpQ(a, b, x => x + '°', `Góc ${a}° ${a > b ? '&gt;' : a < b ? '&lt;' : '='} góc ${b}°.`); }
  ])(); } },

{ id: 'b8', so: 8, title: 'Góc nhọn, góc tù, góc bẹt', game: 'fish',
  memo: 'Góc nhọn bé hơn góc vuông; góc tù lớn hơn góc vuông nhưng bé hơn góc bẹt.',
  learn: [
    { t: 'Góc nhọn', h: `${vAngle(50, ['O', 'A', 'B'], true)}<p><b>Góc nhọn</b> bé hơn góc vuông (bé hơn 90°).</p>` },
    { t: 'Góc tù', h: `${vAngle(130, ['O', 'M', 'N'], true)}<p><b>Góc tù</b> lớn hơn góc vuông nhưng bé hơn góc bẹt (lớn hơn 90°, bé hơn 180°).</p>` },
    { t: 'Góc bẹt', h: `${vAngle(180, ['O', 'C', 'D'], true)}<p><b>Góc bẹt</b> bằng hai góc vuông (180°). Hai cạnh của góc bẹt nằm trên một đường thẳng.</p><div class="memo">Góc nhọn &lt; Góc vuông &lt; Góc tù &lt; Góc bẹt</div>` },
    { t: 'Kim đồng hồ', h: `<div class="row-c">${vClock(3, 0, 130)}${vClock(6, 0, 130)}</div><p>Lúc 3 giờ, hai kim tạo thành <b>góc vuông</b>. Lúc 6 giờ, hai kim tạo thành <b>góc bẹt</b>.</p>` }
  ],
  gen() { const K = ['Góc nhọn', 'Góc vuông', 'Góc tù', 'Góc bẹt']; return pick([
    () => { const d = pick([R(2, 8) * 10, 90, R(10, 17) * 10, 180, R(3, 8) * 10 + 5]); return mc(`<p>Góc dưới đây là góc gì?</p>${vAngle(d)}`, ageKind(d), K, `Góc này ${d}°: ${ageKind(d).toLowerCase()}.`); },
    () => { const d = pick([25, 45, 70, 85, 95, 110, 135, 150, 170]); return mc(`<p>Góc có số đo <b>${d}°</b> là góc gì?</p>`, ageKind(d), K, `${d}° ${d < 90 ? 'bé hơn' : 'lớn hơn'} 90°.`); },
    () => { const h = pick([1, 2, 3, 4, 5, 6, 9, 10, 11]); const ang = Math.min(h * 30, 360 - h * 30); return mc(`<p>Lúc <b>${h} giờ</b>, kim giờ và kim phút tạo thành góc gì?</p><div class="row-c">${vClock(h, 0, 140)}</div>`, ageKind(ang), K, `Hai kim tạo thành góc ${ang}°.`); },
    () => inp('<p>Một góc bẹt bằng mấy góc vuông?</p>', 2, '180° = 90° + 90°.')
  ])(); } },

{ id: 'b9', so: 9, title: 'Luyện tập chung', game: 'race', mix: ['b7', 'b8'] }
]},

{ id: 'c3', no: 3, name: 'Số có nhiều chữ số', hue: 3, lessons: [
{ id: 'b10', so: 10, title: 'Số có sáu chữ số. Số 1 000 000', game: 'balloon',
  memo: '10 chục nghìn = 1 trăm nghìn; 10 trăm nghìn = 1 triệu (1 000 000).',
  learn: [
    { t: 'Trăm nghìn', h: `<p>10 chục nghìn = <b>1 trăm nghìn</b>, viết là <b class="hl">${fN(100000)}</b>.</p>${vPlace(432516)}<p>Số <b>${fN(432516)}</b> đọc là: <i>${docSo(432516)}</i>.</p>` },
    { t: 'Số 1 000 000', h: `<p>10 trăm nghìn = <b>1 triệu</b>, viết là <b class="hl">${fN(1000000)}</b>.</p><p>Số 1 000 000 có <b>7 chữ số</b>: chữ số 1 và sáu chữ số 0.</p>` }
  ],
  gen() { return pick([
    () => { const n = bigNum(6, 6); return mc(`<p>Số “<b>${docSo(n)}</b>” viết là:</p>`, fN(n), fill4(n, [n + 10000, n - 1000, +(String(n).slice(0, 3) + '0' + String(n).slice(4)), n + 100000 < 1e6 ? n + 100000 : n - 100000], 100000, 999999), `Viết là ${fN(n)}.`); },
    () => { const n = bigNum(6, 6); const c = new Set([docSo(n)]); [n + 1000, n + 10000, n - 100].forEach(v => c.add(docSo(v))); return mc(`<p>Số <b class="hl">${fN(n)}</b> đọc là:</p>`, docSo(n), [...c].slice(0, 4), `${fN(n)} đọc là “${docSo(n)}”.`); },
    () => { const d = Array.from({ length: 6 }, (_, i) => i ? R(0, 9) : R(1, 9)); const n = +d.join(''); return inp(`<p>Viết số gồm: ${d.map((x, i) => `${x} ${HANG[5 - i]}`).join(', ')}.</p>`, n, `Viết là ${fN(n)}.`); },
    () => pick([inp('<p class="eq">10 trăm nghìn = <span class="slot">?</span></p>', 1000000, '10 trăm nghìn = 1 000 000 (một triệu).'), inp('<p>Số 1 000 000 có bao nhiêu chữ số 0?</p>', 6, '1 000 000 có sáu chữ số 0.'), inp('<p class="eq">10 chục nghìn = <span class="slot">?</span></p>', 100000, '10 chục nghìn = 100 000.')]),
    () => { const n = bigNum(6, 6) ; return inp(`<p>Số liền trước của <b>${fN(n)}</b> là số nào?</p>`, n - 1, `${fN(n)} − 1 = ${fN(n - 1)}.`); }
  ])(); } },

{ id: 'b11', so: 11, title: 'Hàng và lớp', game: 'fish',
  memo: 'Lớp đơn vị: đơn vị, chục, trăm. Lớp nghìn: nghìn, chục nghìn, trăm nghìn. Lớp triệu: triệu, chục triệu, trăm triệu.',
  learn: [
    { t: 'Hàng và lớp', h: `${vPlace(386052)}<p>Hàng đơn vị, chục, trăm hợp thành <b>lớp đơn vị</b>. Hàng nghìn, chục nghìn, trăm nghìn hợp thành <b>lớp nghìn</b>.</p>` },
    { t: 'Giá trị của chữ số', h: `<p>Trong số <b>${fN(386052)}</b>:</p><p>Chữ số 8 thuộc hàng chục nghìn, lớp nghìn; giá trị là <b class="hl">${fN(80000)}</b>.</p><p>Chữ số 5 thuộc hàng chục, lớp đơn vị; giá trị là <b class="hl">50</b>.</p>` }
  ],
  gen() { return pick([
    () => { const n = bigNum(6, 7); const s = String(n); const i = R(0, s.length - 1), pos = s.length - 1 - i; return mc(`<p>Trong số <b>${fN(n)}</b>, chữ số được tô màu thuộc hàng nào?</p>${vPlace(n, 8 - pos)}`.replace('<span class="slot">?</span>', `<span class="slot">${s[i]}</span>`), HANG[pos], shuffle(HANG.slice(0, s.length)).filter(h => h !== HANG[pos]).slice(0, 3).concat([HANG[pos]]), `Chữ số ${s[i]} ở hàng ${HANG[pos]}, ${LOP(pos)}.`); },
    () => { let n, s, i, pos; do { n = bigNum(6, 6); s = String(n); i = R(0, 5); pos = 5 - i; } while (s[i] === '0'); const v = +s[i] * 10 ** pos; return mc(`<p>Giá trị của chữ số <b class="hl">${s[i]}</b> (thứ ${i + 1} từ trái sang) trong số <b>${fN(n)}</b> là:</p>`, fN(v), fill4(v, [v / 10, v * 10, +s[i]].filter(x => x >= 1 && x !== v)), `Chữ số ${s[i]} ở hàng ${HANG[pos]} nên có giá trị ${fN(v)}.`); },
    () => { const n = bigNum(6, 6); const s = String(n); const L = pick([['lớp nghìn', s.slice(0, 3)], ['lớp đơn vị', s.slice(3)]]); return mc(`<p>Các chữ số thuộc <b>${L[0]}</b> của số <b>${fN(n)}</b> là:</p>`, L[1].split('').join('; '), [s.slice(0, 3), s.slice(3), s.slice(1, 4), s.slice(2, 5)].map(x => x.split('').join('; ')), `${fN(n)}: lớp nghìn gồm ${s.slice(0, 3).split('').join(', ')}; lớp đơn vị gồm ${s.slice(3).split('').join(', ')}.`); },
    () => { const pos = R(0, 8); return mc(`<p>Hàng <b>${HANG[pos]}</b> thuộc lớp nào?</p>`, LOP(pos), ['lớp đơn vị', 'lớp nghìn', 'lớp triệu'], `Hàng ${HANG[pos]} thuộc ${LOP(pos)}.`); }
  ])(); } },

{ id: 'b12', so: 12, title: 'Các số trong phạm vi lớp triệu', game: 'race',
  memo: 'Đọc số có nhiều chữ số: tách lớp, đọc từ lớp triệu → lớp nghìn → lớp đơn vị.',
  learn: [
    { t: 'Lớp triệu', h: `${vPlace(342157403)}<p>Số <b>${fN(342157403)}</b> đọc là: <i>${docSo(342157403)}</i>.</p>` },
    { t: 'Cách đọc số', h: `<div class="memo">1. Tách số thành từng lớp (3 chữ số) từ phải sang trái.<br>2. Đọc từ trái sang phải, đọc số ở mỗi lớp kèm tên lớp (triệu, nghìn).</div><p>${fN(5020300)}: <i>${docSo(5020300)}</i>.</p><p class="tip">10 triệu = ${fN(10000000)} · 100 triệu = ${fN(100000000)}</p>` }
  ],
  gen() { return pick([
    () => { const n = bigNum(7, 9); const c = new Set([docSo(n)]); [n + 1e6 < 1e9 ? n + 1e6 : n - 1e6, n + 1000, n - 10].forEach(v => c.add(docSo(v))); return mc(`<p>Số <b class="hl">${fN(n)}</b> đọc là:</p>`, docSo(n), [...c].slice(0, 4), `Tách lớp: ${fN(n)} → “${docSo(n)}”.`); },
    () => { const n = bigNum(7, 9); return mc(`<p>Số “<b>${docSo(n)}</b>” viết là:</p>`, fN(n), fill4(n, [n * 10 < 1e9 ? n * 10 : Math.floor(n / 10), n + 1e6, n - 10000]), `Viết là ${fN(n)}.`); },
    () => { const t = R(1, 9), h = R(0, 9), k = R(0, 9); const n = t * 1e6 + h * 1e5 + k * 1e3; return inp(`<p>Viết số gồm <b>${t} triệu, ${h} trăm nghìn, ${k} nghìn</b>.</p>`, n, `${fN(n)}`); },
    () => { const n = bigNum(7, 9); return inp(`<p>Số <b>${fN(n)}</b> có bao nhiêu chữ số?</p>`, String(n).length, `Đếm các chữ số: ${String(n).length}.`); },
    () => pick([inp('<p class="eq">10 triệu = <span class="slot">?</span></p>', 1e7, '10 triệu = 10 000 000.'), inp('<p class="eq">1 triệu = <span class="slot">?</span> nghìn</p>', 1000, '1 000 000 = 1000 nghìn.')])
  ])(); } },

{ id: 'b13', so: 13, title: 'Làm tròn số đến hàng trăm nghìn', game: 'balloon',
  memo: 'Nhìn chữ số hàng ngay bên phải: bé hơn 5 thì làm tròn xuống, từ 5 trở lên thì làm tròn lên.',
  learn: [
    { t: 'Làm tròn đến hàng trăm nghìn', h: `<p>Làm tròn <b>${fN(3427500)}</b> đến hàng trăm nghìn: chữ số hàng chục nghìn là <b>2</b> &lt; 5 → làm tròn xuống: <b class="hl">${fN(3400000)}</b>.</p><p>Làm tròn <b>${fN(3482000)}</b>: chữ số hàng chục nghìn là <b>8</b> ≥ 5 → làm tròn lên: <b class="hl">${fN(3500000)}</b>.</p>` },
    { t: 'Ghi nhớ', h: `<div class="memo">Khi làm tròn số đến hàng trăm nghìn, ta so sánh chữ số <b>hàng chục nghìn</b> với 5. Nếu bé hơn 5 thì làm tròn xuống, còn lại thì làm tròn lên.</div>` }
  ],
  gen() { return pick([
    () => { const n = bigNum(6, 7); const r = Math.round(n / 1e5) * 1e5; return mc(`<p>Làm tròn số <b>${fN(n)}</b> đến hàng trăm nghìn ta được:</p>`, fN(r), fill4(r, [Math.floor(n / 1e5) * 1e5 === r ? r + 1e5 : r - 1e5, Math.round(n / 1e4) * 1e4, Math.round(n / 1e6) * 1e6].filter(x => x !== r)), `Chữ số hàng chục nghìn là ${String(n).slice(-5, -4)}: ${fN(r)}.`); },
    () => { const n = bigNum(6, 7); const r = Math.round(n / 1e4) * 1e4; return mc(`<p>Làm tròn số <b>${fN(n)}</b> đến hàng chục nghìn ta được:</p>`, fN(r), fill4(r, [Math.floor(n / 1e4) * 1e4 === r ? r + 1e4 : r - 1e4, Math.round(n / 1e5) * 1e5, Math.round(n / 1e3) * 1e3].filter(x => x !== r)), `Chữ số hàng nghìn là ${String(n).slice(-4, -3)}: ${fN(r)}.`); },
    () => { const n = bigNum(6, 7); const r = Math.round(n / 1e5) * 1e5; return inp(`<p>Làm tròn số <b>${fN(n)}</b> đến hàng trăm nghìn.</p>`, r, `${fN(n)} ≈ ${fN(r)}.`); }
  ])(); } },

{ id: 'b14', so: 14, title: 'So sánh các số có nhiều chữ số', game: 'sort', sort: [100000, 9999999],
  memo: 'Số nào nhiều chữ số hơn thì lớn hơn; cùng số chữ số thì so sánh từng hàng từ trái sang phải.',
  learn: [
    { t: 'Khác số chữ số', h: `<p class="eq">${fN(99999)} &lt; ${fN(100000)}</p><p>Số có 5 chữ số bé hơn số có 6 chữ số.</p>` },
    { t: 'Cùng số chữ số', h: `<p class="eq">${fN(693251)} &lt; ${fN(693500)}</p><p>Hàng trăm nghìn, chục nghìn, nghìn đều bằng nhau; hàng trăm: 2 &lt; 5.</p><div class="memo">So sánh lần lượt từng cặp chữ số <b>cùng hàng</b> từ trái sang phải.</div>` }
  ],
  gen() { return pick([
    () => { const a = bigNum(6, 7); const b = pick([a + R(1, 9) * 100, a - R(1, 9) * 10000, bigNum(6, 7), a, Math.floor(a / 10)]); return cmpQ(a, b); },
    () => { const s = [...new Set(Array.from({ length: 6 }, () => bigNum(6, 7)))].slice(0, 4); const big = Math.random() < .5; const v = big ? Math.max(...s) : Math.min(...s); return mc(`<p>Số <b>${big ? 'lớn nhất' : 'bé nhất'}</b> trong các số sau là:</p>`, fN(v), s.map(fN), `Số ${big ? 'lớn nhất' : 'bé nhất'} là ${fN(v)}.`); },
    () => { const s = String(bigNum(6, 6)); return inp(`<p>Tìm chữ số thích hợp điền vào ô trống:</p><p class="eq">${s.slice(0, 3)} ${s[3]}<span class="slot">?</span>${s[5]} &gt; ${fN(+(s.slice(0, 4) + '8' + s[5]))}</p>`, 9, 'Các hàng bên trái bằng nhau; ở hàng chục chỉ có chữ số 9 lớn hơn 8.'); }
  ])(); } },

{ id: 'b15', so: 15, title: 'Làm quen với dãy số tự nhiên', game: 'race',
  memo: 'Dãy số tự nhiên: 0; 1; 2; 3; … Số 0 là số tự nhiên bé nhất; không có số tự nhiên lớn nhất.',
  learn: [
    { t: 'Dãy số tự nhiên', h: `${vLine(0, 1)}<p>Các số 0; 1; 2; 3; 4; 5; … là các <b>số tự nhiên</b>. Xếp theo thứ tự từ bé đến lớn ta được <b>dãy số tự nhiên</b>.</p>` },
    { t: 'Đặc điểm', h: `<div class="memo">• Số 0 là số tự nhiên bé nhất.<br>• Thêm 1 vào bất kì số tự nhiên nào cũng được số liền sau, nên <b>không có số tự nhiên lớn nhất</b>.<br>• Hai số tự nhiên liên tiếp hơn kém nhau <b>1</b> đơn vị.</div>` }
  ],
  gen() { return pick([
    () => mc('<p>Số tự nhiên <b>bé nhất</b> là:</p>', '0', ['0', '1', '10', 'Không có'], 'Số 0 là số tự nhiên bé nhất.'),
    () => mc('<p>Có số tự nhiên <b>lớn nhất</b> không?</p>', 'Không có', ['Có, là 999 999 999', 'Không có', 'Có, là 1 000 000'], 'Thêm 1 vào số nào cũng được số lớn hơn.'),
    () => { const n = bigNum(4, 7); return inp(`<p>Số liền sau của <b>${fN(n)}</b> là số nào?</p>`, n + 1, `${fN(n)} + 1 = ${fN(n + 1)}.`); },
    () => { const s = R(0, 50) * 2, st = pick([1, 2, 5, 10]); const seq = Array.from({ length: 6 }, (_, i) => s + i * st); const k = R(2, 5); return inp(`<p>Tìm số thích hợp: <span class="eq">${seq.map((v, i) => i === k ? '<span class="slot">?</span>' : v).join('; ')}</span></p>`, seq[k], `Dãy số cách đều ${st} đơn vị.`); },
    () => inp('<p>Hai số tự nhiên liên tiếp hơn kém nhau mấy đơn vị?</p>', 1, 'Hai số tự nhiên liên tiếp hơn kém nhau 1 đơn vị.')
  ])(); } },

{ id: 'b16', so: 16, title: 'Luyện tập chung', game: 'balloon', mix: ['b10', 'b11', 'b12', 'b13', 'b14', 'b15'] }
]},

{ id: 'c4', no: 4, name: 'Một số đơn vị đo đại lượng', hue: 4, lessons: [
{ id: 'b17', so: 17, title: 'Yến, tạ, tấn', game: 'balloon',
  memo: '1 yến = 10 kg; 1 tạ = 10 yến = 100 kg; 1 tấn = 10 tạ = 1000 kg.',
  learn: [
    { t: 'Đơn vị lớn hơn ki-lô-gam', h: `<div class="scrollx"><table class="tbl"><tr><th>Đơn vị</th><th>Đổi ra ki-lô-gam</th><th>Ví dụ</th></tr><tr><td><b>1 yến</b></td><td>10 kg</td><td>🍚 Bao gạo nhỏ</td></tr><tr><td><b>1 tạ</b></td><td>100 kg</td><td>🐷 Con lợn to</td></tr><tr><td><b>1 tấn</b></td><td>${fN(1000)} kg</td><td>🐘 Voi con</td></tr></table></div>` },
    { t: 'Ghi nhớ', h: `<div class="memo">1 yến = 10 kg<br>1 tạ = 10 yến = 100 kg<br>1 tấn = 10 tạ = ${fN(1000)} kg</div><p>Đổi: 3 tạ = 300 kg; 5 tấn = ${fN(5000)} kg; 40 kg = 4 yến.</p>` }
  ],
  gen() { return pick([
    () => { const k = R(2, 9); const c = pick([[`${k} yến`, 'kg', k * 10], [`${k} tạ`, 'kg', k * 100], [`${k} tấn`, 'kg', k * 1000], [`${k} tấn`, 'tạ', k * 10], [`${k} tạ`, 'yến', k * 10], [`${k * 10} kg`, 'yến', k], [`${k * 100} kg`, 'tạ', k], [`${fN(k * 1000)} kg`, 'tấn', k]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${fN(c[2])} ${c[1]}.`); },
    () => { const c = pick([['Con voi nặng khoảng 5', 'tấn'], ['Bao xi măng nặng 5', 'yến'], ['Con trâu nặng khoảng 4', 'tạ'], ['Quả dưa hấu nặng 3', 'kg'], ['Xe tải chở được 8', 'tấn'], ['Bao thóc nặng 1', 'tạ']]); return mc(`<p>Chọn đơn vị thích hợp:</p><p class="wp">${c[0]} <span class="slot">?</span></p>`, c[1], ['kg', 'yến', 'tạ', 'tấn'], `${c[0]} ${c[1]}.`); },
    () => { const u = pick(['yến', 'tạ', 'tấn']); const a = R(10, 90), b = R(5, 60); return Math.random() < .5 ? calcQ(a, b, '+', { unit: u }) : calcQ(Math.max(a, b) + 10, Math.min(a, b), '-', { unit: u }); },
    () => { const t = R(2, 6), k = R(100, 900); return inp(`<p class="wp">Một xe tải chở ${t} tấn hàng, đã dỡ xuống ${k} kg. Hỏi trên xe còn lại bao nhiêu ki-lô-gam hàng?</p>`, t * 1000 - k, steps(`Đổi: ${t} tấn = ${fN(t * 1000)} kg`, `Còn lại: ${fN(t * 1000)} − ${k} = ${fN(t * 1000 - k)} (kg)`)); },
    () => { const a = R(2, 9), ta = pick([a * 10, R(10, 90)]); const q = cmpQ(a * 10, ta); q.q = `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">${a} tấn <span class="slot">?</span> ${ta} tạ</p>`; q.ex = `${a} tấn = ${a * 10} tạ.`; return q; }
  ])(); } },

{ id: 'b18', so: 18, title: 'Đề-xi-mét vuông, mét vuông, mi-li-mét vuông', game: 'fish',
  memo: '1 cm² = 100 mm²; 1 dm² = 100 cm²; 1 m² = 100 dm².',
  learn: [
    { t: 'Đề-xi-mét vuông', h: `${vGrid(10, 2, '1 cm²')}<p>Hình vuông cạnh <b>1 dm</b> có diện tích <b>1 đề-xi-mét vuông</b>, viết là <b class="hl">1 dm²</b>. Hình vuông đó gồm 100 ô vuông 1 cm².</p><p class="eq">1 dm² = 100 cm²</p>` },
    { t: 'Mét vuông, mi-li-mét vuông', h: `<p>Hình vuông cạnh 1 m có diện tích <b>1 mét vuông</b> (1 m²). Hình vuông cạnh 1 mm có diện tích <b>1 mi-li-mét vuông</b> (1 mm²).</p><div class="memo">1 m² = 100 dm²<br>1 dm² = 100 cm²<br>1 cm² = 100 mm²</div>` }
  ],
  gen() { return pick([
    () => { const k = R(2, 9); const c = pick([['1 dm²', 'cm²', 100], ['1 m²', 'dm²', 100], ['1 cm²', 'mm²', 100], [`${k} dm²`, 'cm²', k * 100], [`${k} m²`, 'dm²', k * 100], [`${k * 100} cm²`, 'dm²', k], [`${k} cm²`, 'mm²', k * 100]]); return inp(`<p class="eq">${c[0]} = <span class="slot">?</span> ${c[1]}</p>`, c[2], `${c[0]} = ${c[2]} ${c[1]}.`); },
    () => { const w = R(3, 8), h = R(2, 4); return inp(`<p>Hình dưới đây có diện tích bao nhiêu xăng-ti-mét vuông?</p>${vGrid(w, h)}`, w * h, `Có ${h} hàng, mỗi hàng ${w} ô: ${w} × ${h} = ${w * h} (cm²).`); },
    () => { const c = pick([['Mặt bàn học có diện tích khoảng 50', 'dm²'], ['Lớp học có diện tích khoảng 60', 'm²'], ['Con tem có diện tích khoảng 6', 'cm²'], ['Mặt chiếc khuy áo có diện tích khoảng 80', 'mm²'], ['Sân bóng có diện tích khoảng 7000', 'm²']]); return mc(`<p>Chọn đơn vị thích hợp:</p><p class="wp">${c[0]} <span class="slot">?</span></p>`, c[1], ['mm²', 'cm²', 'dm²', 'm²'], `${c[0]} ${c[1]}.`); },
    () => { const a = R(10, 90), b = R(5, 50); return calcQ(a, b, '+', { unit: pick(['dm²', 'm²', 'cm²']) }); }
  ])(); } },

{ id: 'b19', so: 19, title: 'Giây, thế kỉ', game: 'race',
  memo: '1 phút = 60 giây; 1 thế kỉ = 100 năm. Năm 2001 đến năm 2100 là thế kỉ XXI.',
  learn: [
    { t: 'Giây', h: `<div class="row-c">${vClock(10, 10, 140)}</div><p>Kim giây quay một vòng hết <b>60 giây</b>.</p><p class="eq">1 phút = 60 giây</p>` },
    { t: 'Thế kỉ', h: `<p class="eq">1 thế kỉ = 100 năm</p><div class="scrollx"><table class="tbl"><tr><th>Từ năm</th><th>Đến năm</th><th>Thế kỉ</th></tr><tr><td>1</td><td>100</td><td>I (một)</td></tr><tr><td>1901</td><td>2000</td><td>XX (hai mươi)</td></tr><tr><td>2001</td><td>2100</td><td>XXI (hai mươi mốt)</td></tr></table></div><p class="tip">Người ta dùng chữ số La Mã để ghi tên thế kỉ. Năm 2026 thuộc thế kỉ XXI.</p>` }
  ],
  gen() { return pick([
    () => { const k = R(2, 9); return pick([inp(`<p class="eq">${k} phút = <span class="slot">?</span> giây</p>`, k * 60, `${k} × 60 = ${k * 60} (giây)`), inp(`<p class="eq">${k} thế kỉ = <span class="slot">?</span> năm</p>`, k * 100, `${k} × 100 = ${k * 100} (năm)`), inp(`<p class="eq">1 phút ${k * 5} giây = <span class="slot">?</span> giây</p>`, 60 + k * 5, `60 + ${k * 5} = ${60 + k * 5} (giây)`)]); },
    () => { const y = pick([R(1001, 2100), 1945, 1975, 1010, 2026, 1890, 1802]); const c = Math.ceil(y / 100); return mc(`<p>Năm <b>${y}</b> thuộc thế kỉ nào?</p>`, toRoman(c), [toRoman(c), toRoman(c - 1), toRoman(c + 1), toRoman(c + 2)], `Năm ${y} thuộc thế kỉ ${toRoman(c)} (thế kỉ thứ ${c}).`); },
    () => mc('<p>Nửa thế kỉ là bao nhiêu năm?</p>', '50', ['10', '50', '100', '500'], '100 : 2 = 50 (năm).'),
    () => { const a = R(5, 55), s = pick([60 + a, R(65, 120)]); const q = cmpQ(60 + a, s); q.q = `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">1 phút ${a} giây <span class="slot">?</span> ${s} giây</p>`; q.ex = `1 phút ${a} giây = ${60 + a} giây.`; return q; }
  ])(); } },

{ id: 'b21', so: 21, title: 'Luyện tập chung', game: 'fish', mix: ['b17', 'b18', 'b19'] }
]},

{ id: 'c5', no: 5, name: 'Phép cộng và phép trừ', hue: 5, lessons: [
{ id: 'b22', so: 22, title: 'Phép cộng các số có nhiều chữ số', game: 'memory',
  memo: 'Đặt tính thẳng hàng, cộng từ phải sang trái, nhớ sang hàng bên trái.',
  learn: [
    { t: 'Đặt tính rồi tính', h: `<div class="pair2">${vCol(367859, 541728, '+', '909587')}<div><p>• Viết các chữ số cùng hàng thẳng cột.</p><p>• Cộng từ phải sang trái: 9 + 8 = 17, viết 7 nhớ 1; 5 + 2 = 7, thêm 1 bằng 8…</p></div></div>` },
    { t: 'Thử lại', h: `<p>Lấy tổng trừ đi một số hạng, nếu được số hạng kia thì phép cộng đúng:</p><p class="eq">${fN(909587)} − ${fN(541728)} = ${fN(367859)} ✓</p>` }
  ],
  gen() { return pick([
    () => { const a = bigNum(5, 6), b = bigNum(4, 6); return calcQ(a, b, '+', { col: Math.random() < .5 }); },
    () => { const a = R(10, 90) * 1000, b = R(10, 90) * 1000; return calcQ(a, b, '+'); },
    () => { const a = R(20000, 90000), b = R(10000, 60000); return inp(`<p class="wp">Năm ngoái huyện trồng được ${fN(a)} cây, năm nay trồng được ${fN(b)} cây. Hỏi cả hai năm huyện trồng được bao nhiêu cây?</p>`, a + b, steps(`Cả hai năm: ${fN(a)} + ${fN(b)} = ${fN(a + b)} (cây)`)); }
  ])(); } },

{ id: 'b23', so: 23, title: 'Phép trừ các số có nhiều chữ số', game: 'fish',
  memo: 'Đặt tính thẳng hàng, trừ từ phải sang trái; không trừ được thì mượn 1 ở hàng bên trái.',
  learn: [
    { t: 'Đặt tính rồi tính', h: `<div class="pair2">${vCol(865279, 450237, '−', '415042')}${vCol(647253, 285749, '−', '361504')}</div><p>Hàng nào không trừ được thì lấy thêm 10 rồi trừ, sau đó <b class="red">nhớ 1</b> vào số trừ ở hàng bên trái.</p>` },
    { t: 'Thử lại', h: `<p>Lấy hiệu cộng số trừ, nếu được số bị trừ thì phép trừ đúng:</p><p class="eq">${fN(361504)} + ${fN(285749)} = ${fN(647253)} ✓</p>` }
  ],
  gen() { return pick([
    () => { const a = bigNum(6, 6), b = R(10000, a - 1000); return calcQ(a, b, '-', { col: Math.random() < .5 }); },
    () => { const a = R(30, 99) * 1000, b = R(10, 29) * 1000; return calcQ(a, b, '-'); },
    () => { const a = R(100000, 500000), b = R(20000, a - 10000); return inp(`<p class="wp">Một nhà máy cần sản xuất ${fN(a)} chiếc áo, đã sản xuất được ${fN(b)} chiếc. Hỏi nhà máy còn phải sản xuất bao nhiêu chiếc áo nữa?</p>`, a - b, steps(`Số áo còn phải sản xuất: ${fN(a)} − ${fN(b)} = ${fN(a - b)} (chiếc)`)); }
  ])(); } },

{ id: 'b24', so: 24, title: 'Tính chất giao hoán và kết hợp của phép cộng', game: 'balloon',
  memo: 'a + b = b + a; (a + b) + c = a + (b + c). Nhóm các số tròn trăm, tròn nghìn để tính nhanh.',
  learn: [
    { t: 'Tính chất giao hoán', h: `<p class="eq">a + b = b + a</p><p>Khi đổi chỗ các số hạng trong một tổng thì tổng không thay đổi. Ví dụ: 350 + 270 = 270 + 350.</p>` },
    { t: 'Tính chất kết hợp', h: `<p class="eq">(a + b) + c = a + (b + c)</p><p>Tính thuận tiện: 125 + 377 + 875 = (125 + 875) + 377 = ${fN(1000)} + 377 = <b class="hl">${fN(1377)}</b>.</p><div class="memo">Tìm các số cộng lại được số tròn chục, tròn trăm, tròn nghìn rồi cộng trước.</div>` }
  ],
  gen() { return pick([
    () => { const a = R(100, 9999), b = R(100, 9999); return inp(`<p>Điền số thích hợp:</p><p class="eq">${fN(a)} + ${fN(b)} = ${fN(b)} + <span class="slot">?</span></p>`, a, 'Tính chất giao hoán: a + b = b + a.'); },
    () => { const p = pick([[25, 75], [125, 875], [250, 750], [340, 660], [48, 52], [1250, 750], [2500, 7500]]); const m = R(100, 999); const v = p[0] + p[1] + m; return inp(`<p>Tính bằng cách thuận tiện:</p><p class="eq">${fN(p[0])} + ${fN(m)} + ${fN(p[1])}</p>`, v, `= (${fN(p[0])} + ${fN(p[1])}) + ${fN(m)} = ${fN(p[0] + p[1])} + ${fN(m)} = ${fN(v)}`); },
    () => { const a = R(10, 99), b = R(10, 99), c = R(10, 99); return mc(`<p>Biểu thức nào bằng <b>(${a} + ${b}) + ${c}</b>?</p>`, `${a} + (${b} + ${c})`, [`${a} + (${b} + ${c})`, `${a} + ${b} − ${c}`, `(${a} − ${b}) + ${c}`, `${a} × (${b} + ${c})`], 'Tính chất kết hợp của phép cộng.'); }
  ])(); } },

{ id: 'b25', so: 25, title: 'Tìm hai số biết tổng và hiệu của hai số đó', game: 'race',
  memo: 'Số lớn = (Tổng + Hiệu) : 2; Số bé = (Tổng − Hiệu) : 2.',
  learn: [
    { t: 'Sơ đồ đoạn thẳng', h: `<p class="wp">Tổng của hai số là 70, hiệu của chúng là 10. Tìm hai số đó.</p>${vTongHieu('Số lớn', 'Số bé', 70, 10)}` },
    { t: 'Cách giải', h: `${steps('Số lớn là: (70 + 10) : 2 = 40', 'Số bé là: 40 − 10 = 30', 'Đáp số: Số lớn 40; Số bé 30.')}<div class="memo"><b>Số lớn = (Tổng + Hiệu) : 2</b><br><b>Số bé = (Tổng − Hiệu) : 2</b></div>` }
  ],
  gen() { const s = R(10, 300), d = R(2, 80) * 1; const big = s + d, tot = big + s; return pick([
    () => inp(`<p>Tổng của hai số là <b>${tot}</b>, hiệu của chúng là <b>${d}</b>. Tìm <b>số lớn</b>.</p>${vTongHieu('Số lớn', 'Số bé', tot, d)}`, big, `(${tot} + ${d}) : 2 = ${big}`),
    () => inp(`<p>Tổng của hai số là <b>${tot}</b>, hiệu của chúng là <b>${d}</b>. Tìm <b>số bé</b>.</p>`, s, `(${tot} − ${d}) : 2 = ${s}`),
    () => { const n1 = pick(NAMES), n2 = pick(NAMES.filter(x => x !== n1)); return inp(`<p class="wp">${n1} và ${n2} có tất cả ${tot} quyển vở. ${n1} có nhiều hơn ${n2} ${d} quyển. Hỏi ${n1} có bao nhiêu quyển vở?</p>${vTongHieu(n1, n2, tot, d)}`, big, steps(`Số vở của ${n1}: (${tot} + ${d}) : 2 = ${big} (quyển)`)); },
    () => { const age = R(25, 40), kid = R(6, 12); return inp(`<p class="wp">Tuổi bố và tuổi con cộng lại được ${age + kid + kid} tuổi. Bố hơn con ${age} tuổi. Hỏi con bao nhiêu tuổi?</p>`, kid, steps(`Tuổi con: (${age + 2 * kid} − ${age}) : 2 = ${kid} (tuổi)`)); }
  ])(); } },

{ id: 'b26', so: 26, title: 'Luyện tập chung', game: 'balloon', mix: ['b22', 'b23', 'b24', 'b25'] }
]},

{ id: 'c6', no: 6, name: 'Đường thẳng vuông góc, đường thẳng song song', hue: 6, lessons: [
{ id: 'b27', so: 27, title: 'Hai đường thẳng vuông góc', game: 'balloon',
  memo: 'Hai đường thẳng vuông góc tạo thành 4 góc vuông.',
  learn: [
    { t: 'Hai đường thẳng vuông góc', h: `${vLines('perp')}<p>Đường thẳng AB và đường thẳng CD <b>vuông góc</b> với nhau. Chúng tạo thành <b>4 góc vuông</b> có chung đỉnh.</p>` },
    { t: 'Trong hình chữ nhật', h: `${vShape4('cn')}<p>Hai cạnh kề nhau của hình chữ nhật vuông góc với nhau. Hình chữ nhật có <b>4 cặp cạnh vuông góc</b>.</p><p class="tip">Dùng ê-ke để kiểm tra hai đường thẳng có vuông góc hay không.</p>` }
  ],
  gen() { const K = ['Vuông góc', 'Song song', 'Cắt nhau nhưng không vuông góc']; return pick([
    () => { const k = pick(['perp', 'par', 'cross']); const a = { perp: K[0], par: K[1], cross: K[2] }[k]; return mc(`<p>Hai đường thẳng AB và CD:</p>${vLines(k)}`, a, K, `Hai đường thẳng ${a.toLowerCase()}.`); },
    () => inp('<p>Hai đường thẳng vuông góc tạo thành mấy góc vuông?</p>', 4, 'Tạo thành 4 góc vuông chung đỉnh.'),
    () => inp(`<p>Hình chữ nhật có mấy cặp cạnh vuông góc với nhau?</p>${vShape4('cn')}`, 4, 'Mỗi đỉnh có một cặp cạnh vuông góc: 4 cặp.'),
    () => mc('<p>Dụng cụ nào dùng để kiểm tra hai đường thẳng vuông góc?</p>', 'Ê-ke', ['Ê-ke', 'Com-pa', 'Thước đo góc', 'Cân đĩa'], 'Dùng ê-ke để kiểm tra góc vuông.')
  ])(); } },

{ id: 'b29', so: 29, title: 'Hai đường thẳng song song', game: 'fish',
  memo: 'Hai đường thẳng song song không bao giờ cắt nhau.',
  learn: [
    { t: 'Hai đường thẳng song song', h: `${vLines('par')}<p>Kéo dài hai cạnh đối diện AB và CD của hình chữ nhật về hai phía, ta được hai đường thẳng <b>song song</b> với nhau.</p><div class="memo">Hai đường thẳng song song thì <b>không bao giờ cắt nhau</b>.</div>` },
    { t: 'Trong đời sống', h: `<p>🚆 Hai thanh ray đường tàu, ✏️ các dòng kẻ trong vở, 🪜 các bậc thang… là hình ảnh của các đường thẳng song song.</p><p>Hình chữ nhật có <b>2 cặp cạnh song song</b>.</p>` }
  ],
  gen() { const K = ['Vuông góc', 'Song song', 'Cắt nhau nhưng không vuông góc']; return pick([
    () => { const k = pick(['perp', 'par', 'cross', 'par']); const a = { perp: K[0], par: K[1], cross: K[2] }[k]; return mc(`<p>Hai đường thẳng AB và CD:</p>${vLines(k)}`, a, K, `Hai đường thẳng ${a.toLowerCase()}.`); },
    () => inp(`<p>Hình chữ nhật có mấy cặp cạnh song song?</p>${vShape4('cn')}`, 2, 'Các cạnh đối diện song song: 2 cặp.'),
    () => mc('<p>Hai đường thẳng song song thì:</p>', 'Không bao giờ cắt nhau', ['Không bao giờ cắt nhau', 'Cắt nhau tại một điểm', 'Tạo thành 4 góc vuông', 'Tạo thành góc bẹt'], 'Hai đường thẳng song song không bao giờ cắt nhau.'),
    () => mc('<p>Hình ảnh nào gợi nên hai đường thẳng song song?</p>', 'Hai thanh ray đường tàu', ['Hai thanh ray đường tàu', 'Hai kim đồng hồ lúc 3 giờ', 'Hai cạnh của góc nhọn', 'Chữ X'], 'Hai thanh ray luôn cách đều và không cắt nhau.')
  ])(); } },

{ id: 'b31', so: 31, title: 'Hình bình hành, hình thoi', game: 'race',
  memo: 'Hình bình hành có hai cặp cạnh đối diện song song và bằng nhau. Hình thoi có hai cặp cạnh đối diện song song và bốn cạnh bằng nhau.',
  learn: [
    { t: 'Hình bình hành', h: `${vShape4('hbh')}<p><b>Hình bình hành</b> có hai cặp cạnh đối diện <b>song song</b> và <b>bằng nhau</b>.</p>` },
    { t: 'Hình thoi', h: `${vShape4('thoi')}<p><b>Hình thoi</b> có hai cặp cạnh đối diện song song và <b>bốn cạnh bằng nhau</b>.</p><div class="memo">Chu vi hình thoi cạnh a: P = a × 4.</div>` }
  ],
  gen() { const NM = { hbh: 'Hình bình hành', thoi: 'Hình thoi', cn: 'Hình chữ nhật', vuong: 'Hình vuông', tg: 'Hình tam giác' }; return pick([
    () => { const k = pick(['hbh', 'thoi', 'cn', 'tg']); return mc(`<p>Hình dưới đây là hình gì?</p>${vShape4(k)}`, NM[k], [NM.hbh, NM.thoi, NM.cn, NM.tg], `Đây là ${NM[k].toLowerCase()}.`); },
    () => mc('<p>Hình nào có <b>bốn cạnh bằng nhau</b> và hai cặp cạnh đối diện song song (không có góc vuông)?</p>', 'Hình thoi', ['Hình thoi', 'Hình bình hành', 'Hình chữ nhật', 'Hình tam giác'], 'Hình thoi có bốn cạnh bằng nhau.'),
    () => { const a = R(3, 25); return inp(`<p>Hình thoi có cạnh ${a} cm. Tính chu vi hình thoi (cm).</p>${vShape4('thoi')}`, a * 4, `${a} × 4 = ${a * 4} (cm)`); },
    () => { const a = R(5, 20), b = R(3, a - 1); return inp(`<p>Hình bình hành có hai cạnh liên tiếp dài ${a} cm và ${b} cm. Tính chu vi hình bình hành (cm).</p>${vShape4('hbh')}`, (a + b) * 2, `(${a} + ${b}) × 2 = ${(a + b) * 2} (cm)`); }
  ])(); } },

{ id: 'b32', so: 32, title: 'Luyện tập chung', game: 'balloon', mix: ['b27', 'b29', 'b31'] }
]},

{ id: 'c7', no: 7, name: 'Ôn tập học kì 1', hue: 7, lessons: [
{ id: 'on1', so: '33–37', title: 'Ôn tập học kì 1', game: 'race', mixTopics: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'] }
]}
]},

/* ================= TẬP HAI ================= */
{ tap: 2, name: 'Tập hai', topics: [

{ id: 'c8', no: 8, name: 'Phép nhân và phép chia', hue: 1, lessons: [
{ id: 'b38', so: 38, title: 'Nhân với số có một chữ số', game: 'memory',
  memo: 'Nhân lần lượt từ phải sang trái, nhớ sang hàng bên trái.',
  learn: [
    { t: 'Đặt tính 241 324 × 2', h: `<div class="pair2">${vCol(241324, 2, '×', '482648')}<div><p>Phép nhân không nhớ: nhân lần lượt từng chữ số với 2.</p></div></div>` },
    { t: 'Đặt tính 136 204 × 4', h: `<div class="pair2">${vCol(136204, 4, '×', '544816')}<div><p>• 4 × 4 = 16, viết 6 nhớ 1.<br>• 4 × 0 = 0, thêm 1 bằng 1, viết 1.<br>• 4 × 2 = 8, viết 8.<br>• 4 × 6 = 24, viết 4 nhớ 2.<br>• 4 × 3 = 12, thêm 2 bằng 14, viết 4 nhớ 1.<br>• 4 × 1 = 4, thêm 1 bằng 5, viết 5.</p></div></div>` }
  ],
  gen() { return pick([
    () => { const b = R(2, 9), a = R(10000, Math.floor(999999 / b)); return calcQ(a, b, '×', { col: Math.random() < .5 }); },
    () => { const b = R(2, 9), a = R(1000, 9999); return calcQ(a, b, '×'); },
    () => { const b = R(3, 8), a = R(1200, 9800); return inp(`<p class="wp">Mỗi xe chở ${fN(a)} kg hàng. Hỏi ${b} xe như thế chở được bao nhiêu ki-lô-gam hàng?</p>`, a * b, steps(`${b} xe chở: ${fN(a)} × ${b} = ${fN(a * b)} (kg)`)); }
  ])(); } },

{ id: 'b39', so: 39, title: 'Chia cho số có một chữ số', game: 'fish',
  memo: 'Chia lần lượt từ trái sang phải. Số dư luôn bé hơn số chia.',
  learn: [
    { t: 'Chia hết', h: `<p class="eq">${fN(128472)} : 6 = ${fN(21412)}</p><p>Chia lần lượt từ trái sang phải: 12 chia 6 được 2, viết 2; 8 chia 6 được 1, viết 1, 1 nhân 6 bằng 6, 8 trừ 6 bằng 2…</p>` },
    { t: 'Chia có dư', h: `<p class="eq">${fN(230859)} : 5 = ${fN(46171)} (dư 4)</p><div class="memo">Trong phép chia có dư, <b>số dư luôn bé hơn số chia</b>.</div>` }
  ],
  gen() { return pick([
    () => { const b = R(2, 9), q = R(1000, 99999); return calcQ(b * q, b, ':'); },
    () => { const b = R(3, 9), q = R(100, 9999), r = R(1, b - 1); return inp(`<p>Tìm <b>số dư</b> của phép chia:</p><p class="eq">${fN(b * q + r)} : ${b}</p>`, r, `${fN(b * q + r)} : ${b} = ${fN(q)} (dư ${r})`); },
    () => { const b = R(3, 9), q = R(1000, 9000); return inp(`<p class="wp">Có ${fN(b * q)} quyển sách chia đều cho ${b} thư viện. Hỏi mỗi thư viện được bao nhiêu quyển sách?</p>`, q, steps(`Mỗi thư viện: ${fN(b * q)} : ${b} = ${fN(q)} (quyển)`)); },
    () => { const b = R(3, 9); return mc(`<p>Trong phép chia cho <b>${b}</b>, số dư lớn nhất có thể là:</p>`, b - 1, [b - 1, b, b + 1, 1], 'Số dư luôn bé hơn số chia.'); }
  ])(); } },

{ id: 'b40', so: 40, title: 'Tính chất giao hoán và kết hợp của phép nhân', game: 'balloon',
  memo: 'a × b = b × a; (a × b) × c = a × (b × c). Nhóm 2 × 5, 4 × 25, 8 × 125 để tính nhanh.',
  learn: [
    { t: 'Tính chất giao hoán', h: `<p class="eq">a × b = b × a</p><p>Khi đổi chỗ các thừa số trong một tích thì tích không thay đổi: 7 × 5 = 5 × 7.</p>` },
    { t: 'Tính chất kết hợp', h: `<p class="eq">(a × b) × c = a × (b × c)</p><p>Tính thuận tiện: 25 × 7 × 4 = (25 × 4) × 7 = 100 × 7 = <b class="hl">700</b>.</p><div class="memo">Các cặp “đẹp”: 2 × 5 = 10; 4 × 25 = 100; 8 × 125 = 1000; 5 × 20 = 100.</div>` }
  ],
  gen() { return pick([
    () => { const a = R(12, 999), b = R(2, 99); return inp(`<p>Điền số thích hợp:</p><p class="eq">${a} × ${b} = ${b} × <span class="slot">?</span></p>`, a, 'Tính chất giao hoán.'); },
    () => { const p = pick([[2, 5], [4, 25], [5, 20], [8, 125], [50, 2], [25, 4]]), m = R(3, 99); const v = p[0] * p[1] * m; return inp(`<p>Tính bằng cách thuận tiện:</p><p class="eq">${p[0]} × ${m} × ${p[1]}</p>`, v, `= (${p[0]} × ${p[1]}) × ${m} = ${p[0] * p[1]} × ${m} = ${fN(v)}`); },
    () => { const a = R(2, 9), b = R(2, 9), c = R(2, 9); return mc(`<p>Biểu thức nào bằng <b>(${a} × ${b}) × ${c}</b>?</p>`, `${a} × (${b} × ${c})`, [`${a} × (${b} × ${c})`, `${a} × ${b} + ${c}`, `(${a} + ${b}) × ${c}`, `${a} + (${b} × ${c})`], 'Tính chất kết hợp của phép nhân.'); }
  ])(); } },

{ id: 'b41', so: 41, title: 'Nhân, chia với 10, 100, 1 000, …', game: 'race',
  memo: 'Nhân với 10, 100, 1000: thêm 1, 2, 3 chữ số 0 vào bên phải. Chia số tròn chục, tròn trăm, tròn nghìn cho 10, 100, 1000: bỏ bớt 1, 2, 3 chữ số 0.',
  learn: [
    { t: 'Nhân với 10, 100, 1000', h: `<p class="eq">35 × 10 = 350</p><p class="eq">35 × 100 = ${fN(3500)}</p><p class="eq">35 × 1000 = ${fN(35000)}</p><p>Thêm một, hai, ba chữ số 0 vào bên phải số đó.</p>` },
    { t: 'Chia cho 10, 100, 1000', h: `<p class="eq">${fN(35000)} : 10 = ${fN(3500)}</p><p class="eq">${fN(35000)} : 100 = 350</p><p class="eq">${fN(35000)} : 1000 = 35</p><p>Bỏ bớt một, hai, ba chữ số 0 ở bên phải số đó.</p><div class="memo">Ứng dụng: 1 tấn = ${fN(1000)} kg, nên 7 tấn = 7 × 1000 = ${fN(7000)} kg.</div>` }
  ],
  gen() { const k = pick([10, 100, 1000]); return pick([
    () => { const a = R(2, 999); return calcQ(a, k, '×'); },
    () => { const a = R(2, 999) * k; return calcQ(a, k, ':'); },
    () => { const a = R(2, 99); return inp(`<p class="eq">${a} × <span class="slot">?</span> = ${fN(a * k)}</p>`, k, `Thêm ${String(k).length - 1} chữ số 0.`); }
  ])(); } },

{ id: 'b42', so: 42, title: 'Tính chất phân phối của phép nhân đối với phép cộng', game: 'balloon',
  memo: 'a × (b + c) = a × b + a × c.',
  learn: [
    { t: 'Nhân một số với một tổng', h: `<p class="eq">a × (b + c) = a × b + a × c</p><p>Ví dụ: 4 × (3 + 5) = 4 × 3 + 4 × 5 = 12 + 20 = 32.</p>` },
    { t: 'Tính thuận tiện', h: `<p class="eq">36 × 7 + 36 × 3 = 36 × (7 + 3) = 36 × 10 = 360</p><p>Khi nhân một số với 11: 23 × 11 = 23 × (10 + 1) = 230 + 23 = 253.</p>` }
  ],
  gen() { return pick([
    () => { const a = R(12, 99), b = R(2, 9), c = 10 - b; return inp(`<p>Tính bằng cách thuận tiện:</p><p class="eq">${a} × ${b} + ${a} × ${c}</p>`, a * 10, `= ${a} × (${b} + ${c}) = ${a} × 10 = ${a * 10}`); },
    () => { const a = R(2, 9), b = R(10, 50), c = R(2, 30); return inp(`<p>Điền số thích hợp:</p><p class="eq">${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × <span class="slot">?</span></p>`, c, 'Nhân một số với một tổng.'); },
    () => { const a = R(12, 89); return inp(`<p>Tính: <span class="eq">${a} × 11</span></p>`, a * 11, `${a} × (10 + 1) = ${a * 10} + ${a} = ${a * 11}`); },
    () => { const a = R(12, 99), b = R(12, 99), c = 100 - b; return inp(`<p>Tính bằng cách thuận tiện:</p><p class="eq">${a} × ${b} + ${a} × ${c}</p>`, a * 100, `= ${a} × (${b} + ${c}) = ${a} × 100 = ${fN(a * 100)}`); }
  ])(); } },

{ id: 'b43', so: 43, title: 'Nhân với số có hai chữ số', game: 'memory',
  memo: 'Tính tích riêng thứ nhất, tích riêng thứ hai (viết lùi sang trái một cột), rồi cộng hai tích riêng.',
  learn: [
    { t: 'Đặt tính 36 × 23', h: `<div class="pair2"><div class="colc"><span class="cop">×</span><span class="cn">36</span><span class="cn">23</span><span class="cl"></span><span class="cn">108</span><span class="cn">72&nbsp;</span><span class="cl"></span><span class="cn cr">828</span></div><div><p>• 3 × 36 = 108: <b>tích riêng thứ nhất</b>.</p><p>• 2 × 36 = 72: <b>tích riêng thứ hai</b>, viết lùi sang trái một cột (vì là 72 chục).</p><p>• Cộng: 108 + 720 = <b>828</b>.</p></div></div>` },
    { t: 'Ghi nhớ', h: `<div class="memo">Tích riêng thứ hai luôn viết <b>lùi sang bên trái một cột</b> so với tích riêng thứ nhất.</div>` }
  ],
  gen() { return pick([
    () => { const a = R(12, 99), b = R(11, 99); return calcQ(a, b, '×'); },
    () => { const a = R(100, 999), b = R(11, 99); return calcQ(a, b, '×'); },
    () => { const a = R(12, 45), b = R(15, 40); return inp(`<p class="wp">Mỗi hộp có ${a} cái bánh. Hỏi ${b} hộp như thế có bao nhiêu cái bánh?</p>`, a * b, steps(`${b} hộp có: ${a} × ${b} = ${a * b} (cái bánh)`)); }
  ])(); } },

{ id: 'b44', so: 44, title: 'Chia cho số có hai chữ số', game: 'fish',
  memo: 'Ước lượng thương bằng cách làm tròn số chia, rồi nhân lại để kiểm tra.',
  learn: [
    { t: 'Đặt tính 672 : 21', h: `<p class="eq">672 : 21 = 32</p><p>• 67 chia 21 được 3 (ước lượng 6 : 2 = 3); 3 × 21 = 63; 67 − 63 = 4.</p><p>• Hạ 2 được 42; 42 chia 21 được 2; 2 × 21 = 42; 42 − 42 = 0.</p>` },
    { t: 'Mẹo ước lượng', h: `<div class="memo">Làm tròn số chia: 21 ≈ 20, 38 ≈ 40… rồi chia nhẩm để đoán thương. Nhân lại để thử; nếu tích lớn hơn số bị chia thì giảm thương đi 1.</div>` }
  ],
  gen() { return pick([
    () => { const b = R(11, 99), q = R(2, 99); return calcQ(b * q, b, ':'); },
    () => { const b = R(12, 60), q = R(10, 150); return calcQ(b * q, b, ':'); },
    () => { const b = R(15, 45), q = R(12, 40); return inp(`<p class="wp">Người ta xếp ${fN(b * q)} quả trứng vào các khay, mỗi khay ${b} quả. Hỏi xếp được bao nhiêu khay?</p>`, q, steps(`Số khay: ${fN(b * q)} : ${b} = ${q} (khay)`)); }
  ])(); } },

{ id: 'b46', so: 46, title: 'Tìm số trung bình cộng', game: 'balloon',
  memo: 'Muốn tìm số trung bình cộng của nhiều số, ta tính tổng các số đó rồi chia cho số các số hạng.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Can thứ nhất có 6 l dầu, can thứ hai có 4 l dầu. Nếu chia đều số dầu cho hai can thì mỗi can có bao nhiêu lít?</p>${steps('Tổng số dầu: 6 + 4 = 10 (l)', 'Mỗi can có: 10 : 2 = 5 (l)')}<p>Ta nói: <b>5 là số trung bình cộng</b> của 6 và 4.</p>` },
    { t: 'Quy tắc', h: `<div class="memo"><b>Số trung bình cộng = Tổng các số : Số các số hạng</b></div><p>Trung bình cộng của 25, 27, 32: (25 + 27 + 32) : 3 = 84 : 3 = <b>28</b>.</p>` }
  ],
  gen() { const k = R(2, 4); const avg = R(10, 90); let arr = Array.from({ length: k }, () => avg + R(-9, 9)); arr[k - 1] = avg * k - arr.slice(0, -1).reduce((a, b) => a + b, 0); return pick([
    () => inp(`<p>Tìm số trung bình cộng của các số: <b>${arr.join('; ')}</b>.</p>`, avg, `(${arr.join(' + ')}) : ${k} = ${avg * k} : ${k} = ${avg}`),
    () => { const n = shuffle(NAMES).slice(0, k); return inp(`<p class="wp">${n.map((x, i) => `${x} cao ${arr[i] + 100} cm`).join(', ')}. Hỏi trung bình mỗi bạn cao bao nhiêu xăng-ti-mét?</p>`, avg + 100, `(${arr.map(x => x + 100).join(' + ')}) : ${k} = ${avg + 100} (cm)`); },
    () => inp(`<p>Số trung bình cộng của hai số là <b>${avg}</b>. Một số là <b>${arr[0]}</b>. Tìm số kia.</p>`, avg * 2 - arr[0], `Tổng hai số: ${avg} × 2 = ${avg * 2}; số kia: ${avg * 2} − ${arr[0]} = ${avg * 2 - arr[0]}`)
  ])(); } },

{ id: 'b47', so: 47, title: 'Bài toán liên quan đến rút về đơn vị', game: 'race',
  memo: 'Bước 1: tìm giá trị một phần (rút về đơn vị). Bước 2: tìm giá trị nhiều phần.',
  learn: [
    { t: 'Ví dụ', h: `<p class="wp">Có 5 hộp bút như nhau chứa 40 chiếc bút. Hỏi 8 hộp như thế có bao nhiêu chiếc bút?</p>${steps('Mỗi hộp có: 40 : 5 = 8 (chiếc)', '8 hộp có: 8 × 8 = 64 (chiếc)', 'Đáp số: 64 chiếc bút.')}` },
    { t: 'Ghi nhớ', h: `<div class="memo"><b>Bước 1 (rút về đơn vị):</b> Tìm giá trị của 1 phần bằng phép chia.<br><b>Bước 2:</b> Tìm giá trị của nhiều phần bằng phép nhân.</div>` }
  ],
  gen() { const per = R(3, 25), a = R(2, 9), b = R(2, 12); return pick([
    () => inp(`<p class="wp">Có ${a} hộp bút như nhau chứa ${per * a} chiếc bút. Hỏi ${b} hộp như thế có bao nhiêu chiếc bút?</p>`, per * b, steps(`Mỗi hộp: ${per * a} : ${a} = ${per} (chiếc)`, `${b} hộp: ${per} × ${b} = ${per * b} (chiếc)`)),
    () => inp(`<p class="wp">Mua ${a} quyển vở hết ${fN(per * a * 1000)} đồng. Hỏi mua ${b} quyển vở như thế hết bao nhiêu tiền?</p>`, per * b * 1000, steps(`Giá 1 quyển: ${fN(per * a * 1000)} : ${a} = ${fN(per * 1000)} (đồng)`, `${b} quyển: ${fN(per * 1000)} × ${b} = ${fN(per * b * 1000)} (đồng)`)),
    () => inp(`<p class="wp">${a} xe chở được ${fN(per * a * 100)} kg gạo. Hỏi ${b} xe như thế chở được bao nhiêu ki-lô-gam gạo?</p>`, per * b * 100, steps(`1 xe: ${fN(per * a * 100)} : ${a} = ${fN(per * 100)} (kg)`, `${b} xe: ${fN(per * 100)} × ${b} = ${fN(per * b * 100)} (kg)`))
  ])(); } },

{ id: 'b48', so: 48, title: 'Luyện tập chung', game: 'balloon', mix: ['b38', 'b39', 'b40', 'b41', 'b42', 'b43', 'b44', 'b46', 'b47'] }
]},

{ id: 'c9', no: 9, name: 'Làm quen với yếu tố thống kê, xác suất', hue: 2, lessons: [
{ id: 'b49', so: 49, title: 'Dãy số liệu thống kê', game: 'fish',
  memo: 'Dãy số liệu ghi lại các số đo, số đếm được. Đọc số thứ mấy, số lớn nhất, bé nhất.',
  learn: [
    { t: 'Dãy số liệu', h: `<p>Chiều cao (cm) của 5 bạn tổ 1: <b class="eq">132; 128; 135; 130; 126</b></p><p>Đây là một <b>dãy số liệu</b>. Dãy có <b>5</b> số liệu. Số thứ ba là 135. Bạn cao nhất cao 135 cm.</p>` },
    { t: 'Sắp xếp dãy số liệu', h: `<p>Sắp xếp từ bé đến lớn: 126; 128; 130; 132; 135.</p><div class="memo">Nhìn dãy số liệu để biết: có bao nhiêu số, số thứ mấy là bao nhiêu, số lớn nhất, bé nhất, chênh lệch…</div>` }
  ],
  gen() { const n = R(5, 7); const data = Array.from({ length: n }, () => R(120, 145)); const show = `<p>Chiều cao (cm) của một số bạn lớp 4A: <b class="eq">${data.join('; ')}</b></p>`; return pick([
    () => inp(`${show}<p>Dãy số liệu trên có bao nhiêu số?</p>`, n, `Đếm được ${n} số liệu.`),
    () => { const k = R(1, n); return inp(`${show}<p>Số thứ <b>${k}</b> trong dãy là bao nhiêu?</p>`, data[k - 1], `Số thứ ${k} là ${data[k - 1]}.`); },
    () => { const big = Math.random() < .5; const v = big ? Math.max(...data) : Math.min(...data); return inp(`${show}<p>Bạn ${big ? 'cao nhất' : 'thấp nhất'} cao bao nhiêu xăng-ti-mét?</p>`, v, `Số ${big ? 'lớn nhất' : 'bé nhất'} là ${v}.`); },
    () => inp(`${show}<p>Bạn cao nhất cao hơn bạn thấp nhất bao nhiêu xăng-ti-mét?</p>`, Math.max(...data) - Math.min(...data), `${Math.max(...data)} − ${Math.min(...data)} = ${Math.max(...data) - Math.min(...data)} (cm)`)
  ])(); } },

{ id: 'b50', so: 50, title: 'Biểu đồ cột', game: 'balloon',
  memo: 'Mỗi cột cho biết một số liệu; đọc số ở đầu cột hoặc theo vạch chia.',
  learn: [
    { t: 'Đọc biểu đồ cột', h: `${vBars([{ label: '4A', v: 35 }, { label: '4B', v: 40 }, { label: '4C', v: 25 }, { label: '4D', v: 30 }], 'Số cây các lớp khối 4 trồng được', 'Số cây')}<p>Lớp 4B trồng được nhiều cây nhất (40 cây). Lớp 4C trồng được ít nhất (25 cây).</p>` },
    { t: 'Cách đọc', h: `<div class="memo">1. Đọc tên biểu đồ.<br>2. Hàng ngang cho biết tên các đối tượng; cột dọc cho biết số lượng.<br>3. Đọc số ở đầu mỗi cột rồi so sánh, tính tổng, tính hiệu.</div>` }
  ],
  gen() { const cls = ['4A', '4B', '4C', '4D']; const vs = shuffle([15, 20, 25, 30, 35, 40, 45, 50]).slice(0, 4); const rows = cls.map((c, i) => ({ label: c, v: vs[i] })); const ch = vBars(rows, 'Số cây các lớp trồng được', 'Số cây'); return pick([
    () => { const i = R(0, 3); return inp(`${ch}<p>Lớp <b>${cls[i]}</b> trồng được bao nhiêu cây?</p>`, vs[i], `Cột ${cls[i]} cao ${vs[i]}.`); },
    () => { const big = Math.random() < .5; const v = big ? Math.max(...vs) : Math.min(...vs); return mc(`${ch}<p>Lớp nào trồng được <b>${big ? 'nhiều' : 'ít'}</b> cây nhất?</p>`, cls[vs.indexOf(v)], cls, `Lớp ${cls[vs.indexOf(v)]}: ${v} cây.`); },
    () => inp(`${ch}<p>Cả bốn lớp trồng được bao nhiêu cây?</p>`, vs.reduce((a, b) => a + b), `${vs.join(' + ')} = ${vs.reduce((a, b) => a + b)}`),
    () => { const [i, j] = vs[0] > vs[1] ? [0, 1] : [1, 0]; return inp(`${ch}<p>Lớp ${cls[i]} trồng nhiều hơn lớp ${cls[j]} bao nhiêu cây?</p>`, vs[i] - vs[j], `${vs[i]} − ${vs[j]} = ${vs[i] - vs[j]}`); }
  ])(); } },

{ id: 'b51', so: 51, title: 'Số lần xuất hiện của một sự kiện', game: 'race',
  memo: 'Kiểm đếm số lần một sự kiện xảy ra khi lặp lại một hoạt động nhiều lần.',
  learn: [
    { t: 'Tung đồng xu', h: `<p>Tung một đồng xu 20 lần, ghi lại kết quả:</p><div class="scrollx"><table class="tbl"><tr><th>Mặt</th><th>Kiểm đếm</th><th>Số lần</th></tr><tr><td>Sấp</td><td>|||| |||| ||</td><td>12</td></tr><tr><td>Ngửa</td><td>|||| |||</td><td>8</td></tr></table></div><p>Sự kiện “mặt sấp xuất hiện” xảy ra <b>12 lần</b> trong 20 lần tung.</p>` },
    { t: 'Ghi nhớ', h: `<div class="memo">Tổng số lần các sự kiện xảy ra bằng tổng số lần thực hiện hoạt động.</div>` }
  ],
  gen() { const N = pick([20, 30, 40, 50]), s = R(Math.floor(N / 3), Math.floor(N * 2 / 3)); return pick([
    () => inp(`<p class="wp">Tung một đồng xu ${N} lần, có ${s} lần xuất hiện mặt sấp. Hỏi có bao nhiêu lần xuất hiện mặt ngửa?</p>`, N - s, `${N} − ${s} = ${N - s}`),
    () => { const a = R(3, 8), b = R(3, 8), c = R(3, 8); return inp(`<p class="wp">Gieo xúc xắc ${a + b + c} lần: mặt 1 chấm xuất hiện ${a} lần, mặt 6 chấm xuất hiện ${b} lần, các mặt còn lại xuất hiện ${c} lần. Hỏi mặt 1 chấm và mặt 6 chấm xuất hiện tất cả bao nhiêu lần?</p>`, a + b, `${a} + ${b} = ${a + b}`); },
    () => { const r = R(4, 12), x = R(4, 12); return inp(`<p class="wp">Trong hộp có bóng đỏ và bóng xanh. Lấy ra một quả, xem màu rồi trả lại, làm như vậy ${r + x} lần. Có ${r} lần lấy được bóng đỏ. Hỏi có mấy lần lấy được bóng xanh?</p>${vBox(['🔴', '🔴', '🔵', '🔵', '🔴', '🔵'])}`, x, `${r + x} − ${r} = ${x}`); },
    () => { const counts = [R(2, 9), R(2, 9), R(2, 9)]; const names = ['🔴 Đỏ', '🔵 Xanh', '🟡 Vàng']; const i = counts.indexOf(Math.max(...counts)); return mc(`<p>Quay vòng quay ${counts.reduce((a, b) => a + b)} lần, kết quả:</p><div class="scrollx"><table class="tbl"><tr>${names.map(n => `<th>${n}</th>`).join('')}</tr><tr>${counts.map(c => `<td>${c}</td>`).join('')}</tr></table></div><p>Màu nào xuất hiện <b>nhiều lần nhất</b>?</p>`, names[i], names, `${names[i]}: ${counts[i]} lần.`); }
  ])(); } },

{ id: 'b52', so: 52, title: 'Luyện tập chung', game: 'fish', mix: ['b49', 'b50', 'b51'] }
]},

{ id: 'c10', no: 10, name: 'Phân số', hue: 3, lessons: [
{ id: 'b53', so: 53, title: 'Khái niệm phân số', game: 'balloon',
  memo: 'Mẫu số chỉ số phần bằng nhau được chia; tử số chỉ số phần được lấy (tô màu).',
  learn: [
    { t: 'Phân số', h: `${vFracShape(3, 4, 'pie')}<p>Hình tròn được chia thành <b>4 phần bằng nhau</b>, đã tô màu <b>3 phần</b>. Ta nói: đã tô màu <span class="eq">${F(3, 4)}</span> hình tròn.</p><p>${F(3, 4)} đọc là <i>ba phần tư</i>.</p>` },
    { t: 'Tử số và mẫu số', h: `<div class="parts"><div><b>3</b><small>Tử số</small></div></div><div class="parts"><div><b>4</b><small>Mẫu số</small></div></div><div class="memo"><b>Mẫu số</b> (viết dưới gạch ngang) cho biết đơn vị được chia thành mấy phần bằng nhau. <b>Tử số</b> (viết trên gạch ngang) cho biết đã lấy mấy phần.</div>` },
    { t: 'Đọc phân số', h: `<p>${F(1, 2)} một phần hai · ${F(5, 6)} năm phần sáu · ${F(7, 10)} bảy phần mười · ${F(12, 25)} mười hai phần hai mươi lăm</p>` }
  ],
  gen() { const [n, d] = fracPair(10); return pick([
    () => fq(`<p>Phân số chỉ phần đã tô màu của hình là:</p>${vFracShape(n, d, pick(['bar', 'pie']))}`, `${n}/${d}`, `Chia ${d} phần bằng nhau, tô ${n} phần: ${F(n, d)}.`, { exact: true }),
    () => mc(`<p>Phân số “<b>${docSo(n)} phần ${docSo(d)}</b>” viết là:</p>`, `${n}/${d}`, [`${n}/${d}`, `${d}/${n}`, `${n}/${d + 1}`, `${n + 1}/${d}`], `Tử số ${n}, mẫu số ${d}.`),
    () => { const t = Math.random() < .5; return inp(`<p>Phân số <span class="eq">${F(n, d)}</span> có ${t ? '<b>tử số</b>' : '<b>mẫu số</b>'} là bao nhiêu?</p>`, t ? n : d, `Tử số ${n} (trên gạch ngang), mẫu số ${d} (dưới gạch ngang).`); },
    () => mc(`<p>Phân số <span class="eq">${F(n, d)}</span> đọc là:</p>`, `${docSo(n)} phần ${docSo(d)}`, [`${docSo(n)} phần ${docSo(d)}`, `${docSo(d)} phần ${docSo(n)}`, `${docSo(n)} chia ${docSo(d)} phần`, `${docSo(n)} và ${docSo(d)}`], `${F(n, d)}: ${docSo(n)} phần ${docSo(d)}.`)
  ])(); } },

{ id: 'b54', so: 54, title: 'Phân số và phép chia số tự nhiên', game: 'fish',
  memo: 'Thương của phép chia a : b (b khác 0) có thể viết thành phân số a/b.',
  learn: [
    { t: 'Viết thương thành phân số', h: `<p class="eq">3 : 4 = ${F(3, 4)} &nbsp; 7 : 9 = ${F(7, 9)}</p><p>Thương của phép chia số tự nhiên cho số tự nhiên (khác 0) có thể viết thành phân số: tử số là số bị chia, mẫu số là số chia.</p>` },
    { t: 'So sánh với 1', h: `<p>${F(5, 5)} = 1 · ${F(3, 4)} &lt; 1 · ${F(7, 4)} &gt; 1</p><div class="memo">Tử số <b>bé hơn</b> mẫu số → phân số bé hơn 1.<br>Tử số <b>bằng</b> mẫu số → phân số bằng 1.<br>Tử số <b>lớn hơn</b> mẫu số → phân số lớn hơn 1.</div><p>Mọi số tự nhiên đều viết được thành phân số có mẫu số 1: 6 = ${F(6, 1)}.</p>` }
  ],
  gen() { return pick([
    () => { const a = R(1, 20), b = R(2, 12); return fq(`<p>Viết thương dưới dạng phân số:</p><p class="eq">${a} : ${b} = <span class="slot">?</span></p>`, `${a}/${b}`, `${a} : ${b} = ${F(a, b)}`, { exact: true, pair: [`${a} : ${b}`, `${a}/${b}`] }); },
    () => { const b = R(2, 9), q = R(2, 9); return inp(`<p>Phân số <span class="eq">${F(b * q, b)}</span> bằng số tự nhiên nào?</p>`, q, `${b * q} : ${b} = ${q}`); },
    () => { const d = R(2, 12), n = pick([R(1, d - 1), d, R(d + 1, d * 2)]); const s = n > d ? '>' : n < d ? '<' : '='; return { q: `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">${F(n, d)} <span class="slot">?</span> 1</p>`, a: s, choices: ['>', '<', '='], ex: `Tử số ${n} ${s === '>' ? 'lớn hơn' : s === '<' ? 'bé hơn' : 'bằng'} mẫu số ${d}.` }; }
  ])(); } },

{ id: 'b55', so: 55, title: 'Tính chất cơ bản của phân số', game: 'race',
  memo: 'Nhân (hoặc chia) cả tử số và mẫu số với cùng một số khác 0 thì được phân số bằng phân số đã cho.',
  learn: [
    { t: 'Phân số bằng nhau', h: `<div class="row-c">${vFracShape(3, 4)}${vFracShape(6, 8)}</div><p class="eq">${F(3, 4)} = ${F(6, 8)}</p><p>${F(3, 4)} = ${F('3 × 2', '4 × 2')} = ${F(6, 8)}</p>` },
    { t: 'Tính chất cơ bản', h: `<div class="memo">Nếu <b>nhân</b> cả tử số và mẫu số với cùng một số tự nhiên khác 0 thì được phân số bằng phân số đã cho.<br>Nếu <b>chia hết</b> cả tử số và mẫu số cho cùng một số tự nhiên khác 0 thì được phân số bằng phân số đã cho.</div><p>${F(15, 20)} = ${F('15 : 5', '20 : 5')} = ${F(3, 4)}</p>` }
  ],
  gen() { const [n, d] = fracPair(9), k = R(2, 6); return pick([
    () => inp(`<p>Điền số thích hợp:</p><p class="eq">${F(n, d)} = ${F('<span class="slot">?</span>', d * k)}</p>`, n * k, `${F(n, d)} = ${F(`${n} × ${k}`, `${d} × ${k}`)} = ${F(n * k, d * k)}`),
    () => inp(`<p>Điền số thích hợp:</p><p class="eq">${F(n * k, d * k)} = ${F(n, '<span class="slot">?</span>')}</p>`, d, `Chia cả tử và mẫu cho ${k}.`),
    () => mc(`<p>Phân số nào <b>bằng</b> <span class="eq">${F(n, d)}</span>?</p>`, `${n * k}/${d * k}`, [`${n * k}/${d * k}`, `${n + k}/${d + k}`, `${n * k}/${d + k}`, `${n + 1}/${d * k}`].filter((v, i, a) => a.indexOf(v) === i), `${F(n, d)} = ${F(n * k, d * k)} (nhân cả tử và mẫu với ${k}).`)
  ])(); } },

{ id: 'b56', so: 56, title: 'Rút gọn phân số', game: 'fish',
  memo: 'Chia cả tử số và mẫu số cho cùng một số lớn hơn 1 cho đến khi được phân số tối giản.',
  learn: [
    { t: 'Rút gọn', h: `<p class="eq">${F(18, 24)} = ${F('18 : 2', '24 : 2')} = ${F(9, 12)} = ${F('9 : 3', '12 : 3')} = ${F(3, 4)}</p><p>${F(3, 4)} không rút gọn được nữa: đó là <b>phân số tối giản</b>.</p>` },
    { t: 'Cách làm', h: `<div class="memo">1. Xét xem tử số và mẫu số cùng chia hết cho số nào lớn hơn 1 (2, 3, 5, 9…).<br>2. Chia cả tử số và mẫu số cho số đó.<br>3. Làm tiếp đến khi được phân số tối giản.</div>` }
  ],
  gen() { let n, d; do { [n, d] = fracPair(10); } while (gcd(n, d) !== 1); const k = R(2, 8); return pick([
    () => fq(`<p>Rút gọn phân số thành <b>phân số tối giản</b>:</p><p class="eq">${F(n * k, d * k)}</p>`, `${n}/${d}`, `${F(n * k, d * k)} = ${F(`${n * k} : ${k}`, `${d * k} : ${k}`)} = ${F(n, d)}`, { exact: true }),
    () => { const opts = shuffle([[n, d], [n * 2, d * 2], [n * 3, d * 3], [n * k, d * k]]); return { ...mc('<p>Phân số nào là <b>phân số tối giản</b>?</p>', `${n}/${d}`, opts.map(([x, y]) => `${x}/${y}`), `${F(n, d)}: tử và mẫu không cùng chia hết cho số nào lớn hơn 1.`), exact: true }; },
    () => mc(`<p>Phân số <span class="eq">${F(n * k, d * k)}</span> rút gọn bằng:</p>`, `${n}/${d}`, fracChoices(n, d), `Chia cả tử và mẫu cho ${k}.`)
  ])(); } },

{ id: 'b57', so: 57, title: 'Quy đồng mẫu số các phân số', game: 'race',
  memo: 'Quy đồng là đưa các phân số về cùng mẫu số mà vẫn bằng phân số ban đầu.',
  learn: [
    { t: 'Ví dụ', h: `<p>Quy đồng mẫu số hai phân số ${F(1, 3)} và ${F(2, 5)}:</p><p class="eq">${F(1, 3)} = ${F('1 × 5', '3 × 5')} = ${F(5, 15)} &nbsp; ${F(2, 5)} = ${F('2 × 3', '5 × 3')} = ${F(6, 15)}</p>` },
    { t: 'Khi một mẫu số chia hết cho mẫu số kia', h: `<p>Quy đồng ${F(5, 6)} và ${F(7, 12)}: vì 12 : 6 = 2 nên chọn mẫu số chung là 12.</p><p class="eq">${F(5, 6)} = ${F(10, 12)}; giữ nguyên ${F(7, 12)}</p><div class="memo">Nếu mẫu số này chia hết cho mẫu số kia thì chọn mẫu số lớn hơn làm <b>mẫu số chung</b>.</div>` }
  ],
  gen() { const d1 = R(2, 6), k = R(2, 4), d2 = d1 * k, n1 = R(1, d1 - 1), n2 = R(1, d2 - 1); return pick([
    () => inp(`<p>Quy đồng mẫu số ${F(n1, d1)} và ${F(n2, d2)} với mẫu số chung <b>${d2}</b>:</p><p class="eq">${F(n1, d1)} = ${F('<span class="slot">?</span>', d2)}</p>`, n1 * k, `${d2} : ${d1} = ${k}; ${F(n1, d1)} = ${F(`${n1} × ${k}`, `${d1} × ${k}`)} = ${F(n1 * k, d2)}`),
    () => { let a = R(2, 7), b = R(2, 7); while (gcd(a, b) !== 1) b = R(2, 7); return inp(`<p>Mẫu số chung nhỏ nhất của hai phân số ${F(1, a)} và ${F(1, b)} là:</p>`, a * b, `${a} × ${b} = ${a * b}`); },
    () => { let a = R(2, 6), b = R(2, 7); while (gcd(a, b) !== 1 || a === b) b = R(2, 7); const x = R(1, a - 1); return inp(`<p>Quy đồng mẫu số ${F(x, a)} và ${F(1, b)} (mẫu số chung ${a * b}):</p><p class="eq">${F(x, a)} = ${F('<span class="slot">?</span>', a * b)}</p>`, x * b, `${F(x, a)} = ${F(`${x} × ${b}`, `${a} × ${b}`)} = ${F(x * b, a * b)}`); }
  ])(); } },

{ id: 'b58', so: 58, title: 'So sánh phân số', game: 'balloon',
  memo: 'Cùng mẫu số: tử lớn hơn thì lớn hơn. Khác mẫu số: quy đồng rồi so sánh.',
  learn: [
    { t: 'Cùng mẫu số', h: `<div class="row-c">${vFracShape(2, 5)}${vFracShape(4, 5)}</div><p class="eq">${F(2, 5)} &lt; ${F(4, 5)}</p><p>Hai phân số cùng mẫu số: phân số nào có tử số bé hơn thì bé hơn.</p>` },
    { t: 'Khác mẫu số', h: `<p>So sánh ${F(2, 3)} và ${F(3, 4)}: quy đồng được ${F(8, 12)} và ${F(9, 12)}. Vì 8 &lt; 9 nên <b>${F(2, 3)} &lt; ${F(3, 4)}</b>.</p><div class="memo">Cùng tử số: phân số nào có mẫu số bé hơn thì lớn hơn (${F(1, 3)} &gt; ${F(1, 5)}).</div>` }
  ],
  gen() { const fc = (a, b, c, d) => { const s = a * d > c * b ? '>' : a * d < c * b ? '<' : '='; return { q: `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">${F(a, b)} <span class="slot">?</span> ${F(c, d)}</p>`, a: s, choices: ['>', '<', '='], ex: `Quy đồng: ${F(a * d, b * d)} và ${F(c * b, b * d)}.` }; }; return pick([
    () => { const d = R(3, 12); return fc(R(1, d - 1), d, R(1, d - 1), d); },
    () => { const n = R(1, 6); return fc(n, R(n + 1, 12), n, R(n + 1, 12)); },
    () => { const d1 = R(2, 6), k = R(2, 3); return fc(R(1, d1 - 1), d1, R(1, d1 * k - 1), d1 * k); },
    () => { const d = R(4, 12); const ns = shuffle(Array.from({ length: d - 1 }, (_, i) => i + 1)).slice(0, 4); const big = Math.random() < .5; const v = big ? Math.max(...ns) : Math.min(...ns); return mc(`<p>Phân số <b>${big ? 'lớn nhất' : 'bé nhất'}</b> là:</p>`, `${v}/${d}`, ns.map(x => `${x}/${d}`), 'Cùng mẫu số, so sánh tử số.'); }
  ])(); } },

{ id: 'b59', so: 59, title: 'Luyện tập chung', game: 'race', mix: ['b53', 'b54', 'b55', 'b56', 'b57', 'b58'] }
]},

{ id: 'c11', no: 11, name: 'Phép cộng, phép trừ phân số', hue: 4, lessons: [
{ id: 'b60', so: 60, title: 'Phép cộng phân số', game: 'memory',
  memo: 'Cùng mẫu số: cộng hai tử số, giữ nguyên mẫu số. Khác mẫu số: quy đồng rồi cộng.',
  learn: [
    { t: 'Cùng mẫu số', h: `${vFracShape(3, 8)}<p class="plus-sign">+</p>${vFracShape(2, 8)}<p class="eq">${F(3, 8)} + ${F(2, 8)} = ${F('3 + 2', 8)} = ${F(5, 8)}</p><div class="memo">Cộng hai tử số với nhau và <b>giữ nguyên mẫu số</b>.</div>` },
    { t: 'Khác mẫu số', h: `<p class="eq">${F(1, 3)} + ${F(1, 6)} = ${F(2, 6)} + ${F(1, 6)} = ${F(3, 6)} = ${F(1, 2)}</p><div class="memo">Quy đồng mẫu số hai phân số rồi cộng. Kết quả nên rút gọn về phân số tối giản.</div>` }
  ],
  gen() { return pick([
    () => { const d = R(3, 15), a = R(1, d - 2), b = R(1, d - a); const r = simp(a + b, d); return fq(`<p>Tính:</p><p class="eq">${F(a, d)} + ${F(b, d)} = <span class="slot">?</span></p>`, r, `${F(a, d)} + ${F(b, d)} = ${F(a + b, d)}${r !== `${a + b}/${d}` ? ' = ' + FS(r) : ''}`, { pair: [`${F(a, d)} + ${F(b, d)}`, r] }); },
    () => { const d1 = R(2, 6), k = R(2, 3), d2 = d1 * k, a = R(1, d1 - 1), b = R(1, d2 - 1); const r = simp(a * k + b, d2); return fq(`<p>Tính:</p><p class="eq">${F(a, d1)} + ${F(b, d2)} = <span class="slot">?</span></p>`, r, `${F(a * k, d2)} + ${F(b, d2)} = ${F(a * k + b, d2)}${r !== `${a * k + b}/${d2}` ? ' = ' + FS(r) : ''}`, { pair: [`${F(a, d1)} + ${F(b, d2)}`, r] }); },
    () => { const d = R(4, 12), a = R(1, d - 2), b = R(1, d - a - 1); const r = simp(a + b, d); return fq(`<p class="wp">Ngày đầu đội công nhân sửa được ${F(a, d)} quãng đường, ngày thứ hai sửa được ${F(b, d)} quãng đường. Hỏi cả hai ngày sửa được mấy phần quãng đường?</p>`, r, `${F(a, d)} + ${F(b, d)} = ${FS(r)} (quãng đường)`); }
  ])(); } },

{ id: 'b61', so: 61, title: 'Phép trừ phân số', game: 'fish',
  memo: 'Cùng mẫu số: trừ tử số, giữ nguyên mẫu số. Khác mẫu số: quy đồng rồi trừ.',
  learn: [
    { t: 'Cùng mẫu số', h: `<p class="eq">${F(5, 6)} − ${F(2, 6)} = ${F('5 − 2', 6)} = ${F(3, 6)} = ${F(1, 2)}</p><div class="memo">Trừ tử số của phân số thứ nhất cho tử số của phân số thứ hai và <b>giữ nguyên mẫu số</b>.</div>` },
    { t: 'Khác mẫu số', h: `<p class="eq">${F(3, 4)} − ${F(1, 2)} = ${F(3, 4)} − ${F(2, 4)} = ${F(1, 4)}</p><p class="tip">Trừ một số tự nhiên với phân số: 1 − ${F(2, 5)} = ${F(5, 5)} − ${F(2, 5)} = ${F(3, 5)}.</p>` }
  ],
  gen() { return pick([
    () => { const d = R(3, 15), a = R(2, d), b = R(1, a - 1); const r = simp(a - b, d); return fq(`<p>Tính:</p><p class="eq">${F(a, d)} − ${F(b, d)} = <span class="slot">?</span></p>`, r, `${F(a - b, d)}${r !== `${a - b}/${d}` ? ' = ' + FS(r) : ''}`); },
    () => { const d1 = R(2, 6), k = R(2, 3), d2 = d1 * k, a = R(1, d1 - 1); const b = R(1, a * k - 1 || 1); if (a * k - b <= 0) return fq(`<p class="eq">1 − ${F(1, d2)} = <span class="slot">?</span></p>`, simp(d2 - 1, d2), `${F(d2, d2)} − ${F(1, d2)} = ${F(d2 - 1, d2)}`); const r = simp(a * k - b, d2); return fq(`<p>Tính:</p><p class="eq">${F(a, d1)} − ${F(b, d2)} = <span class="slot">?</span></p>`, r, `${F(a * k, d2)} − ${F(b, d2)} = ${F(a * k - b, d2)}${r !== `${a * k - b}/${d2}` ? ' = ' + FS(r) : ''}`); },
    () => { const d = R(3, 10), a = R(1, d - 1); const r = simp(d - a, d); return fq(`<p class="eq">1 − ${F(a, d)} = <span class="slot">?</span></p>`, r, `1 = ${F(d, d)}; ${F(d, d)} − ${F(a, d)} = ${F(d - a, d)}`); }
  ])(); } },

{ id: 'b62', so: 62, title: 'Luyện tập chung', game: 'balloon', mix: ['b60', 'b61'] }
]},

{ id: 'c12', no: 12, name: 'Phép nhân, phép chia phân số', hue: 5, lessons: [
{ id: 'b63', so: 63, title: 'Phép nhân phân số', game: 'balloon',
  memo: 'Nhân tử số với tử số, mẫu số với mẫu số.',
  learn: [
    { t: 'Nhân hai phân số', h: `<p class="eq">${F(2, 3)} × ${F(4, 5)} = ${F('2 × 4', '3 × 5')} = ${F(8, 15)}</p><div class="memo">Muốn nhân hai phân số, ta lấy <b>tử số nhân tử số</b>, <b>mẫu số nhân mẫu số</b>.</div>` },
    { t: 'Nhân phân số với số tự nhiên', h: `<p class="eq">${F(2, 7)} × 3 = ${F('2 × 3', 7)} = ${F(6, 7)}</p><p class="tip">Diện tích hình chữ nhật dài ${F(4, 5)} m, rộng ${F(2, 3)} m: ${F(4, 5)} × ${F(2, 3)} = ${F(8, 15)} (m²).</p>` }
  ],
  gen() { return pick([
    () => { const [a, b] = fracPair(7), [c, d] = fracPair(7); const r = simp(a * c, b * d); return fq(`<p>Tính:</p><p class="eq">${F(a, b)} × ${F(c, d)} = <span class="slot">?</span></p>`, r, `${F(`${a} × ${c}`, `${b} × ${d}`)} = ${F(a * c, b * d)}${r !== `${a * c}/${b * d}` ? ' = ' + FS(r) : ''}`); },
    () => { const [a, b] = fracPair(9), k = R(2, 6); const r = simp(a * k, b); return fq(`<p>Tính:</p><p class="eq">${F(a, b)} × ${k} = <span class="slot">?</span></p>`, r, `${F(`${a} × ${k}`, b)} = ${F(a * k, b)}${r !== `${a * k}/${b}` ? ' = ' + FS(r) : ''}`); },
    () => { const [a, b] = fracPair(6), [c, d] = fracPair(6); const r = simp(a * c, b * d); return fq(`<p class="wp">Một tấm kính hình chữ nhật có chiều dài ${F(a, b)} m, chiều rộng ${F(c, d)} m. Tính diện tích tấm kính (m²).</p>`, r, `${F(a, b)} × ${F(c, d)} = ${FS(r)} (m²)`); }
  ])(); } },

{ id: 'b64', so: 64, title: 'Phép chia phân số', game: 'race',
  memo: 'Muốn chia cho một phân số, ta nhân với phân số đảo ngược của phân số đó.',
  learn: [
    { t: 'Phân số đảo ngược', h: `<p>Phân số đảo ngược của ${F(2, 3)} là ${F(3, 2)} (đổi chỗ tử số và mẫu số).</p>` },
    { t: 'Chia hai phân số', h: `<p class="eq">${F(3, 5)} : ${F(2, 7)} = ${F(3, 5)} × ${F(7, 2)} = ${F(21, 10)}</p><div class="memo">Lấy phân số thứ nhất <b>nhân với phân số thứ hai đảo ngược</b>.</div>` }
  ],
  gen() { return pick([
    () => { const [a, b] = fracPair(7), [c, d] = fracPair(7); const r = simp(a * d, b * c); return fq(`<p>Tính:</p><p class="eq">${F(a, b)} : ${F(c, d)} = <span class="slot">?</span></p>`, r, `${F(a, b)} × ${F(d, c)} = ${F(a * d, b * c)}${r !== `${a * d}/${b * c}` ? ' = ' + FS(r) : ''}`); },
    () => { const [a, b] = fracPair(9); return fq(`<p>Phân số đảo ngược của <span class="eq">${F(a, b)}</span> là:</p>`, `${b}/${a}`, 'Đổi chỗ tử số và mẫu số.', { exact: true, mc: true }); },
    () => { const [a, b] = fracPair(8), k = R(2, 5); const r = simp(a, b * k); return fq(`<p>Tính:</p><p class="eq">${F(a, b)} : ${k} = <span class="slot">?</span></p>`, r, `${F(a, b)} × ${F(1, k)} = ${F(a, b * k)}${r !== `${a}/${b * k}` ? ' = ' + FS(r) : ''}`); }
  ])(); } },

{ id: 'b65', so: 65, title: 'Tìm phân số của một số', game: 'fish',
  memo: 'Muốn tìm a/b của một số, ta lấy số đó nhân với a/b (hoặc chia cho b rồi nhân với a).',
  learn: [
    { t: 'Ví dụ', h: `${vGroups('🍊', 4, 3)}<p class="wp">Rổ có 12 quả cam. Hỏi ${F(2, 3)} số cam là bao nhiêu quả?</p>${steps(`${F(2, 3)} số cam là: 12 × ${F(2, 3)} = 8 (quả)`, 'Đáp số: 8 quả cam.')}` },
    { t: 'Ghi nhớ', h: `<div class="memo">Muốn tìm ${F('a', 'b')} của một số, ta lấy số đó <b>nhân với ${F('a', 'b')}</b>.<br>Cách nhẩm: lấy số đó chia cho b, rồi nhân với a.</div>` }
  ],
  gen() { const [a, b] = fracPair(9), k = R(2, 12), N = b * k; return pick([
    () => inp(`<p>Tìm <span class="eq">${F(a, b)}</span> của <b>${N}</b>.</p>`, a * k, `${N} × ${F(a, b)} = ${N} : ${b} × ${a} = ${a * k}`),
    () => { const t = pick(THINGS); return inp(`<p class="wp">Lớp có ${N} ${t.n}. ${F(a, b)} số ${t.n} là bao nhiêu ${t.n}?</p>`, a * k, steps(`${N} × ${F(a, b)} = ${a * k} (${t.n})`)); },
    () => inp(`<p class="wp">Lớp 4A có ${N} học sinh, trong đó ${F(a, b)} số học sinh thích môn Toán. Hỏi lớp 4A có bao nhiêu học sinh thích môn Toán?</p>`, a * k, steps(`Số học sinh thích Toán: ${N} × ${F(a, b)} = ${a * k} (học sinh)`))
  ])(); } },

{ id: 'b66', so: 66, title: 'Luyện tập chung', game: 'race', mix: ['b63', 'b64', 'b65', 'b60', 'b61'] }
]},

{ id: 'c13', no: 13, name: 'Ôn tập cuối năm', hue: 7, lessons: [
{ id: 'on2', so: '67–75', title: 'Ôn tập cuối năm', game: 'race', mixTopics: ['c8', 'c9', 'c10', 'c11', 'c12'] }
]}
]}
];

/* Gắn bài luyện tập chung / ôn tập */
BOOK.forEach(t => t.topics.forEach(tp => tp.lessons.forEach(l => { BYID_RAW[l.id] = l; l.topicRef = tp; })));
BOOK.forEach(t => t.topics.forEach(tp => tp.lessons.forEach(l => {
  let ids = null;
  if (l.mix) ids = l.mix;
  if (l.mixTopics) ids = BOOK.flatMap(b => b.topics).filter(x => l.mixTopics.includes(x.id)).flatMap(x => x.lessons).filter(x => !x.mix && !x.mixTopics).map(x => x.id);
  if (!ids) return;
  l.mixIds = ids;
  l.gen = () => BYID_RAW[pick(ids)].gen();
  l.memo = 'Ôn lại các bài đã học.';
  l.learn = [{ t: 'Nhớ lại kiến thức', h: `<p>Trong phần này con sẽ ôn lại:</p>${memoList(l.mixIds.slice(0, 10))}${l.mixIds.length > 10 ? `<p class="tip">… và ${l.mixIds.length - 10} bài khác.</p>` : ''}` }];
})));
