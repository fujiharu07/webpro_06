const express = require("express");
const app = express();

// =========================================================
// 設定（既存プロジェクト app5.js の構成を流用）
// =========================================================
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// =========================================================
// データ（簡易アプリのためメモリ上で管理：DBなし）
// =========================================================

// F1 2026年 出場チーム
let f1Teams2026 = [
  { id: 1, name: "McLaren", note: "" },
  { id: 2, name: "Mercedes", note: "" },
  { id: 3, name: "Red Bull Racing", note: "" },
  { id: 4, name: "Ferrari", note: "" },
  { id: 5, name: "Williams", note: "" },
  { id: 6, name: "Racing Bulls", note: "" },
  { id: 7, name: "Aston Martin", note: "" },
  { id: 8, name: "Haas", note: "" },
  { id: 9, name: "Alpine", note: "" },
  { id: 10, name: "Audi（Sauber枠）", note: "Kick Sauber のチーム枠が 2026 から Audi へ移行する想定" },
  { id: 11, name: "Cadillac", note: "2026 から 11 番目のチームとして参戦" },
];

// 歴代火影
let hokageList = [
  { id: 1, name: "千手柱間（初代）", roman: "Hashirama Senju", note: "" },
  { id: 2, name: "千手扉間（二代目）", roman: "Tobirama Senju", note: "" },
  { id: 3, name: "猿飛ヒルゼン（三代目）", roman: "Hiruzen Sarutobi", note: "" },
  { id: 4, name: "波風ミナト（四代目）", roman: "Minato Namikaze", note: "" },
  { id: 5, name: "綱手（五代目）", roman: "Tsunade", note: "" },
  { id: 6, name: "はたけカカシ（六代目）", roman: "Kakashi Hatake", note: "" },
  { id: 7, name: "うずまきナルト（七代目）", roman: "Naruto Uzumaki", note: "" },
];

// W杯 2022 ベスト8（準々決勝進出）
let wc2022Best8 = [
  { id: 1, name: "Croatia（クロアチア）" },
  { id: 2, name: "Brazil（ブラジル）" },
  { id: 3, name: "Netherlands（オランダ）" },
  { id: 4, name: "Argentina（アルゼンチン）" },
  { id: 5, name: "Morocco（モロッコ）" },
  { id: 6, name: "Portugal（ポルトガル）" },
  { id: 7, name: "England（イングランド）" },
  { id: 8, name: "France（フランス）" },
];

// =========================================================
// 共通関数
// =========================================================

function nextId(array) {
  if (!array.length) return 1;
  return Math.max(...array.map((x) => Number(x.id) || 0)) + 1;
}

function safeText(value, maxLen = 80) {
  const s = String(value ?? "").trim();
  if (s.length === 0) return null;
  if (s.length > maxLen) return null;
  return s;
}

function validIndex(array, idx) {
  return Number.isInteger(idx) && idx >= 0 && idx < array.length;
}

// =========================================================
// トップ
// =========================================================
app.get("/", (req, res) => {
  res.render("index");
});

// =========================================================
// F1 2026（CRUD）
// =========================================================

// 一覧
app.get("/f1_2026", (req, res) => {
  res.render("f1_2026", { data: f1Teams2026 });
});

// Create（フォーム）
app.get("/f1_2026/create", (req, res) => {
  res.redirect("/public/f1_2026_new.html");
});

// Read（詳細）
app.get("/f1_2026/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(f1Teams2026, number)) return res.status(404).send("Not Found");
  const detail = f1Teams2026[number];
  res.render("f1_2026_detail", { id: number, data: detail });
});

// Delete
app.get("/f1_2026/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(f1Teams2026, number)) return res.status(404).send("Not Found");
  f1Teams2026.splice(number, 1);
  res.redirect("/f1_2026");
});

// Create（登録）
app.post("/f1_2026", (req, res) => {
  const name = safeText(req.body.name, 80);
  const note = String(req.body.note ?? "").trim();
  if (!name) return res.status(400).send("入力エラー：name は必須（80文字以内）");
  const id = nextId(f1Teams2026);
  f1Teams2026.push({ id, name, note });
  res.redirect("/f1_2026");
});

// Edit
app.get("/f1_2026/edit/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(f1Teams2026, number)) return res.status(404).send("Not Found");
  const detail = f1Teams2026[number];
  res.render("f1_2026_edit", { id: number, data: detail });
});

// Update
app.post("/f1_2026/update/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(f1Teams2026, number)) return res.status(404).send("Not Found");
  const name = safeText(req.body.name, 80);
  const note = String(req.body.note ?? "").trim();
  if (!name) return res.status(400).send("入力エラー：name は必須（80文字以内）");
  f1Teams2026[number].name = name;
  f1Teams2026[number].note = note;
  res.redirect("/f1_2026");
});

// JSON API
app.get("/api/f1_2026", (req, res) => res.json(f1Teams2026));

// =========================================================
// 歴代火影（CRUD）
// =========================================================

app.get("/hokage", (req, res) => {
  res.render("hokage", { data: hokageList });
});

app.get("/hokage/create", (req, res) => {
  res.redirect("/public/hokage_new.html");
});

app.get("/hokage/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(hokageList, number)) return res.status(404).send("Not Found");
  const detail = hokageList[number];
  res.render("hokage_detail", { id: number, data: detail });
});

app.get("/hokage/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(hokageList, number)) return res.status(404).send("Not Found");
  hokageList.splice(number, 1);
  res.redirect("/hokage");
});

app.post("/hokage", (req, res) => {
  const name = safeText(req.body.name, 80);
  const roman = String(req.body.roman ?? "").trim();
  const note = String(req.body.note ?? "").trim();
  if (!name) return res.status(400).send("入力エラー：name は必須（80文字以内）");
  const id = nextId(hokageList);
  hokageList.push({ id, name, roman, note });
  res.redirect("/hokage");
});

app.get("/hokage/edit/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(hokageList, number)) return res.status(404).send("Not Found");
  const detail = hokageList[number];
  res.render("hokage_edit", { id: number, data: detail });
});

app.post("/hokage/update/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(hokageList, number)) return res.status(404).send("Not Found");
  const name = safeText(req.body.name, 80);
  const roman = String(req.body.roman ?? "").trim();
  const note = String(req.body.note ?? "").trim();
  if (!name) return res.status(400).send("入力エラー：name は必須（80文字以内）");
  hokageList[number].name = name;
  hokageList[number].roman = roman;
  hokageList[number].note = note;
  res.redirect("/hokage");
});

app.get("/api/hokage", (req, res) => res.json(hokageList));

// =========================================================
// W杯2022 ベスト8（CRUD）
// =========================================================

app.get("/wc2022_best8", (req, res) => {
  res.render("wc2022_best8", { data: wc2022Best8 });
});

app.get("/wc2022_best8/create", (req, res) => {
  res.redirect("/public/wc2022_best8_new.html");
});

app.get("/wc2022_best8/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(wc2022Best8, number)) return res.status(404).send("Not Found");
  const detail = wc2022Best8[number];
  res.render("wc2022_best8_detail", { id: number, data: detail });
});

app.get("/wc2022_best8/delete/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(wc2022Best8, number)) return res.status(404).send("Not Found");
  wc2022Best8.splice(number, 1);
  res.redirect("/wc2022_best8");
});

app.post("/wc2022_best8", (req, res) => {
  const name = safeText(req.body.name, 80);
  if (!name) return res.status(400).send("入力エラー：name は必須（80文字以内）");
  const id = nextId(wc2022Best8);
  wc2022Best8.push({ id, name });
  res.redirect("/wc2022_best8");
});

app.get("/wc2022_best8/edit/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(wc2022Best8, number)) return res.status(404).send("Not Found");
  const detail = wc2022Best8[number];
  res.render("wc2022_best8_edit", { id: number, data: detail });
});

app.post("/wc2022_best8/update/:number", (req, res) => {
  const number = Number(req.params.number);
  if (!validIndex(wc2022Best8, number)) return res.status(404).send("Not Found");
  const name = safeText(req.body.name, 80);
  if (!name) return res.status(400).send("入力エラー：name は必須（80文字以内）");
  wc2022Best8[number].name = name;
  res.redirect("/wc2022_best8");
});

app.get("/api/wc2022_best8", (req, res) => res.json(wc2022Best8));

// =========================================================
// 起動
// =========================================================
app.listen(8080, () => console.log("Example app listening on port 8080!"));
