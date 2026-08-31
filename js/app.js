/* =========================================================================
   宿曜占星術 完全版教材 — アプリケーションロジック
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderShukuWheel();
  renderDayCycle();
  renderShukuBasicTable();
  renderShukuCards();
  renderShukuDetailTable();
  renderRelationCards();
  renderRelationTable();
  renderMatrix();
  renderDayFortuneTable();
  renderNgTable();
  buildHonmyoshukuSelect();
  buildCheckerSelects();
  buildDayFortuneSelects();
  buildPromptSelect();
  bindSharedProfile();
  bindNav();
  bindJumpFab();
  bindCopyButtons();
  bindChecklists();
  bindHonmyoshukuForm();
  bindChecker();
  bindDayFortuneForm();
  bindPromptBuilder();
  bindDetailClose();
  enhanceExpandableTables();
});

/* ---------------------------------------------------------------------
   アイコン生成（27宿シンボル）
--------------------------------------------------------------------- */
const ICON_PALETTE = ["#6d4aff","#e64980","#c9971d","#16a34a","#2563eb","#f97316"];

function shukuIconSvg(shuku, size = 56){
  const color = ICON_PALETTE[shuku.id % ICON_PALETTE.length];
  const ch = shuku.name.charAt(0);
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g${shuku.id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.55"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="url(#g${shuku.id})"/>
    <circle cx="32" cy="32" r="30" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>
    <text x="32" y="40" font-size="26" text-anchor="middle" fill="#fff" font-family="Hiragino Sans, sans-serif" font-weight="700">${ch}</text>
    <circle cx="14" cy="14" r="2.2" fill="#fff" opacity="0.85"/>
    <circle cx="50" cy="18" r="1.6" fill="#fff" opacity="0.7"/>
    <circle cx="48" cy="48" r="1.8" fill="#fff" opacity="0.6"/>
  </svg>`;
}

/* ---------------------------------------------------------------------
   27宿円環図（STEP1 / STEP2）
--------------------------------------------------------------------- */
function renderShukuWheel(){
  const el = document.getElementById("shuku-wheel");
  if(!el) return;
  const size = 420, cx = size/2, cy = size/2, r = 175, dotR = 15;
  let dots = "";
  SHUKU_DATA.forEach((s, i) => {
    const angle = (i / 27) * Math.PI * 2 - Math.PI/2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const color = ICON_PALETTE[s.id % ICON_PALETTE.length];
    dots += `
      <g>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotR}" fill="${color}" opacity="0.9"/>
        <text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">${s.id}</text>
      </g>`;
  });
  el.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:420px">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e3da" stroke-width="1.5" stroke-dasharray="4 4"/>
      ${dots}
      <circle cx="${cx}" cy="${cy}" r="70" fill="#f4f0ff" stroke="#6d4aff" stroke-width="1.5"/>
      <text x="${cx}" y="${cy-6}" font-size="15" text-anchor="middle" fill="#4b2fce" font-weight="800">本命宿</text>
      <text x="${cx}" y="${cy+16}" font-size="11" text-anchor="middle" fill="#6b6a74">27宿が円環に</text>
      <text x="${cx}" y="${cy+32}" font-size="11" text-anchor="middle" fill="#6b6a74">並んでいます</text>
    </svg>`;
}

/* ---------------------------------------------------------------------
   日運サイクル図（STEP6）— 11種の運気を円状に表示
--------------------------------------------------------------------- */
function renderDayCycle(){
  const el = document.getElementById("day-cycle-wheel");
  if(!el) return;
  const size = 380, cx = size/2, cy = size/2, r = 150;
  const colors = ["#6d4aff","#e64980","#c9971d","#16a34a","#2563eb","#f97316","#dc2626","#0d9488","#9333ea","#0284c7","#65a30d"];
  let segs = "";
  DAY_FORTUNE.forEach((d, i) => {
    const angle = (i / DAY_FORTUNE.length) * Math.PI * 2 - Math.PI/2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    segs += `
      <g>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" fill="${colors[i % colors.length]}" opacity="0.92"/>
        <text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" font-size="13" text-anchor="middle" fill="#fff" font-weight="800">${d.key}</text>
      </g>`;
  });
  el.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:380px">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e3da" stroke-width="1.5" stroke-dasharray="4 4"/>
      ${segs}
      <text x="${cx}" y="${cy-4}" font-size="13" text-anchor="middle" fill="#4b2fce" font-weight="800">日運11種</text>
      <text x="${cx}" y="${cy+14}" font-size="10.5" text-anchor="middle" fill="#6b6a74">本命宿からの距離で決まる</text>
    </svg>`;
}

/* ---------------------------------------------------------------------
   STEP2: 27宿 基本早見表
--------------------------------------------------------------------- */
function renderShukuBasicTable(){
  const tbody = document.querySelector("#shuku-basic-table tbody");
  if(!tbody) return;
  tbody.innerHTML = SHUKU_DATA.map(s => `
    <tr>
      <td class="kw" data-label="宿">${s.id}. ${s.name}</td>
      <td data-label="読み">${s.yomi}</td>
      <td data-label="キーワード">${s.keyword}</td>
      <td data-label="基本性格">${s.personality}</td>
      <td data-label="強み">${s.strength}</td>
      <td data-label="注意点">${s.weakness}</td>
      <td data-label="恋愛">${s.love}</td>
      <td data-label="仕事">${s.work}</td>
      <td data-label="鑑定文例">${s.judge}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   STEP2: 27宿 SVGカード
--------------------------------------------------------------------- */
function renderShukuCards(){
  const grid = document.getElementById("shuku-card-grid");
  if(!grid) return;
  grid.innerHTML = SHUKU_DATA.map(s => `
    <div class="shuku-card" data-id="${s.id}" tabindex="0">
      <div class="icon-wrap">${shukuIconSvg(s)}</div>
      <div class="card-body">
        <div class="name">${s.id}. ${s.name}</div>
        <div class="yomi">${s.yomi}</div>
        <div class="kw">${s.keyword}</div>
      </div>
    </div>`).join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".shuku-card");
    if(!card) return;
    openDetailPanel(Number(card.dataset.id));
  });
  grid.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
      const card = e.target.closest(".shuku-card");
      if(card) openDetailPanel(Number(card.dataset.id));
    }
  });
}

function openDetailPanel(id){
  const s = findShuku(id);
  if(!s) return;
  const panel = document.getElementById("shuku-detail-panel");
  panel.innerHTML = `
    <button class="close-dp" aria-label="閉じる">✕</button>
    <div class="dp-head">
      ${shukuIconSvg(s, 64)}
      <div>
        <h3>${s.id}. ${s.name}<span class="pill" style="margin-left:8px;">${s.keyword}</span></h3>
        <div class="yomi">読み：${s.yomi}</div>
      </div>
    </div>
    <p>${s.personality}</p>
    <div class="detail-grid">
      <div class="item"><b>強み</b><span>${s.strength}</span></div>
      <div class="item"><b>注意点</b><span>${s.weakness}</span></div>
      <div class="item"><b>感情パターン</b><span>${s.emotion}</span></div>
      <div class="item"><b>行動パターン</b><span>${s.behavior}</span></div>
      <div class="item"><b>恋愛傾向</b><span>${s.love}</span></div>
      <div class="item"><b>仕事傾向</b><span>${s.work}</span></div>
      <div class="item"><b>金運傾向</b><span>${s.money}</span></div>
      <div class="item"><b>人間関係</b><span>${s.relationships}</span></div>
      <div class="item"><b>疲れた時に出やすい反応</b><span>${s.tired}</span></div>
      <div class="item"><b>開運行動</b><span>${s.lucky}</span></div>
    </div>
    <div class="point-box" style="margin-top:16px;"><span class="tag">鑑定文例</span><p>${s.judge}</p></div>
  `;
  panel.classList.add("open");
  panel.scrollIntoView({behavior:"smooth", block:"center"});
}

function bindDetailClose(){
  document.addEventListener("click", (e) => {
    if(e.target.classList.contains("close-dp")){
      document.getElementById("shuku-detail-panel").classList.remove("open");
    }
  });
}

/* ---------------------------------------------------------------------
   STEP4: 27宿 性格・才能 詳細表
--------------------------------------------------------------------- */
function renderShukuDetailTable(){
  const tbody = document.querySelector("#shuku-detail-table tbody");
  if(!tbody) return;
  tbody.innerHTML = SHUKU_DATA.map(s => `
    <tr>
      <td class="kw" data-label="宿">${s.id}. ${s.name}</td>
      <td data-label="性格">${s.personality}</td>
      <td data-label="感情">${s.emotion}</td>
      <td data-label="行動">${s.behavior}</td>
      <td data-label="恋愛">${s.love}</td>
      <td data-label="仕事">${s.work}</td>
      <td data-label="金運">${s.money}</td>
      <td data-label="注意点">${s.weakness}</td>
      <td data-label="開運行動">${s.lucky}</td>
      <td data-label="鑑定文例">${s.judge}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   STEP5: 相性六分類 カード＆表
--------------------------------------------------------------------- */
function renderRelationCards(){
  const grid = document.getElementById("relation-card-grid");
  if(!grid) return;
  grid.innerHTML = RELATION_GROUP6.map(g => `
    <div class="relation-card" style="background:${g.color}">
      <div class="g-label">相性六分類</div>
      <h4>${g.label}</h4>
      <p><b>意味：</b>${g.meaning}</p>
      <p><b>優しい鑑定表現：</b>「${g.gentle}」</p>
    </div>`).join("");
}

function renderRelationTable(){
  const tbody = document.querySelector("#relation-table tbody");
  if(!tbody) return;
  tbody.innerHTML = RELATION_GROUP6.map(g => `
    <tr>
      <td class="kw" data-label="相性分類">${g.label}</td>
      <td data-label="意味">${g.meaning}</td>
      <td data-label="起きやすいこと">${g.happens}</td>
      <td data-label="伸びる点">${g.grow}</td>
      <td data-label="注意点">${g.caution}</td>
      <td data-label="優しい鑑定表現">${g.gentle}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   STEP5: 27×27 相性マトリクス
--------------------------------------------------------------------- */
function renderMatrix(){
  const wrap = document.getElementById("matrix-wrap");
  const legend = document.getElementById("matrix-legend");
  if(!wrap) return;

  if(legend){
    legend.innerHTML = RELATION_GROUP6.map(g => `
      <div class="lg"><span class="sw" style="background:${g.color}"></span>${g.label}</div>`).join("");
  }

  let html = `<div class="table-scroll"><table class="matrix-table"><thead><tr><th class="rowh"></th>`;
  SHUKU_DATA.forEach(s => { html += `<th title="${s.name}">${s.id}</th>`; });
  html += `</tr></thead><tbody>`;
  SHUKU_DATA.forEach(rowS => {
    html += `<tr><th class="rowh" title="${rowS.name}">${rowS.id}</th>`;
    SHUKU_DATA.forEach(colS => {
      const group = getShukuGroup6(rowS.id, colS.id);
      const color = GROUP6_COLOR[group];
      const self = rowS.id === colS.id ? " self-cell" : "";
      html += `<td class="cell${self}" style="background:${color}" data-a="${rowS.id}" data-b="${colS.id}" title="${rowS.name}×${colS.name}：${group}"></td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  wrap.innerHTML = html;

  wrap.addEventListener("click", (e) => {
    const cell = e.target.closest(".cell");
    if(!cell) return;
    const a = findShuku(cell.dataset.a), b = findShuku(cell.dataset.b);
    const group = getShukuGroup6(a.id, b.id);
    const g = RELATION_GROUP6.find(r => r.key === group);
    const box = document.getElementById("matrix-result");
    if(box){
      box.classList.add("show");
      box.innerHTML = `
        <div class="rtitle">${a.name}（${a.id}）× ${b.name}（${b.id}） → ${g.label}</div>
        <p style="margin:0">${g.gentle}</p>`;
    }
  });
}

/* ---------------------------------------------------------------------
   STEP6: 日運11種 早見表
--------------------------------------------------------------------- */
function renderDayFortuneTable(){
  const tbody = document.querySelector("#day-fortune-table tbody");
  if(!tbody) return;
  tbody.innerHTML = DAY_FORTUNE.map(d => `
    <tr>
      <td class="kw" data-label="運気">${d.key}の日</td>
      <td data-label="テーマ">${d.theme}</td>
      <td data-label="向いている行動">${d.action}</td>
      <td data-label="注意点">${d.caution}</td>
      <td data-label="恋愛">${d.love}</td>
      <td data-label="仕事">${d.work}</td>
      <td data-label="鑑定文例">${d.judge}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   NG表現集
--------------------------------------------------------------------- */
function renderNgTable(){
  const tbody = document.querySelector("#ng-table tbody");
  if(!tbody) return;
  tbody.innerHTML = NG_EXPRESSIONS.map(n => `
    <tr>
      <td data-label="NG表現" style="color:var(--red)">✕ ${n.ng}</td>
      <td data-label="言い換えOK表現" style="color:var(--green)">◯ ${n.ok}</td>
    </tr>`).join("");
}

/* ---------------------------------------------------------------------
   本命宿フォーム（STEP3） — 安全設計：手入力のみ
--------------------------------------------------------------------- */
function buildHonmyoshukuSelect(){
  const sel = document.getElementById("honmei-select");
  if(!sel) return;
  sel.innerHTML = `<option value="">-- 宿を選択してください --</option>` +
    SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}（${s.yomi}）</option>`).join("");
}

/* ---------------------------------------------------------------------
   STEP間で生年月日と本命宿を引き継ぐ
--------------------------------------------------------------------- */
function bindSharedProfile(){
  const birthKey = "shukuyo_profile_birth";
  const starKey = "shukuyo_profile_honmei";
  const birthInputs = ["birthday-record","honmei-birth","prompt-birth","checker-birth-a"];
  const starSelects = ["honmei-select","prompt-honmei","checker-a","day-honmei"];
  const savedBirth = localStorage.getItem(birthKey) || "";
  const savedStar = localStorage.getItem(starKey) || "";

  birthInputs.forEach(id => {
    const input = document.getElementById(id);
    if(!input) return;
    if(savedBirth && !input.value) input.value = savedBirth;
    input.addEventListener("change", () => {
      if(input.value) localStorage.setItem(birthKey, input.value);
    });
  });

  starSelects.forEach(id => {
    const select = document.getElementById(id);
    if(!select) return;
    if(savedStar && [...select.options].some(option => option.value === savedStar)) select.value = savedStar;
    select.addEventListener("change", () => {
      if(select.value) localStorage.setItem(starKey, select.value);
    });
  });
}

function bindHonmyoshukuForm(){
  const btn = document.getElementById("honmei-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const id = document.getElementById("honmei-select").value;
    const result = document.getElementById("honmei-result");
    if(!id){
      result.classList.add("show");
      result.innerHTML = `<p style="margin:0;color:var(--red)">宿を選択してください。生年月日から自動計算したい場合は、正式な暦データ（宿曜早見表・専門書籍・信頼できる鑑定サービス等）でご確認のうえ、その宿をここで選択してください。</p>`;
      return;
    }
    const s = findShuku(id);
    result.classList.add("show");
    result.innerHTML = `
      <div class="rtitle">あなたの本命宿：${s.id}. ${s.name}（${s.yomi}）</div>
      <p><b class="mark">キーワード：</b>${s.keyword}</p>
      <p>${s.personality}</p>
      <p style="margin:0"><b>鑑定文例：</b>${s.judge}</p>`;
    // 自己分析ワークにも反映
    const wk = document.getElementById("honmei-worksheet-name");
    if(wk) wk.value = `${s.id}. ${s.name}`;
  });
}

/* ---------------------------------------------------------------------
   相性チェッカー（STEP5ツール）
--------------------------------------------------------------------- */
function buildCheckerSelects(){
  ["checker-a","checker-b"].forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = `<option value="">-- 宿を選択 --</option>` +
      SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}</option>`).join("");
  });
}

function bindChecker(){
  const btn = document.getElementById("checker-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const a = document.getElementById("checker-a").value;
    const b = document.getElementById("checker-b").value;
    const birthA = document.getElementById("checker-birth-a")?.value || "";
    const birthB = document.getElementById("checker-birth-b")?.value || "";
    const box = document.getElementById("checker-result");
    if(!birthA || !birthB || !a || !b){
      box.classList.add("show");
      box.innerHTML = `<p style="margin:0;color:var(--red)">2人分の誕生日と本命宿を入力・選択してください。</p>`;
      return;
    }
    const sa = findShuku(a), sb = findShuku(b);
    const group = getShukuGroup6(sa.id, sb.id);
    const g = RELATION_GROUP6.find(r => r.key === group);
    box.classList.add("show");
    box.innerHTML = `
      <div class="rtitle">${sa.name} × ${sb.name} → <span style="color:${g.color}">${g.label}</span></div>
      <p><b>意味：</b>${g.meaning}</p>
      <p><b>起きやすいこと：</b>${g.happens}</p>
      <p><b>伸びる点：</b>${g.grow}</p>
      <p><b>注意点：</b>${g.caution}</p>
      <p style="margin:0"><b>優しい鑑定表現：</b>「${g.gentle}」</p>`;

    const prompt = document.getElementById("prompt-compatibility");
    const promptBox = document.getElementById("compatibility-prompt-box");
    if(prompt && promptBox){
      prompt.textContent = `あなたは宿曜占星術の相性鑑定文作成サポートです。
以下の情報から、2人の関係を良い・悪いで断定せず、前向きで実用的な相性鑑定文を作ってください。

【1人目】
生年月日：${birthA}
本命宿：${sa.name}

【2人目】
生年月日：${birthB}
本命宿：${sb.name}

【相性分類】
${g.label}
意味：${g.meaning}
起きやすいこと：${g.happens}
伸びる点：${g.grow}
注意点：${g.caution}

【作成条件】
1. 2人それぞれの本質
2. 関係の強み
3. すれ違いやすい点
4. 関係を整える具体的な行動を3つ
5. 前向きな締め
断定、不安をあおる表現、相手の気持ちの決めつけ、成就の保証はしないでください。
専門用語はやさしく説明し、自然で温かい日本語にしてください。
記号の * と **、Markdown形式は使わず、読みやすい通常の文章で800〜1000文字程度にしてください。`;
      promptBox.hidden = false;
    }
  });
}

/* ---------------------------------------------------------------------
   STEP7：入力内容からChatGPT用の鑑定プロンプトを生成
--------------------------------------------------------------------- */
function buildPromptSelect(){
  const sel = document.getElementById("prompt-honmei");
  if(!sel) return;
  sel.innerHTML = `<option value="">-- 本命宿を選択 --</option>` +
    SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}（${s.yomi}）</option>`).join("");
}

function bindPromptBuilder(){
  const btn = document.getElementById("prompt-generate");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const id = document.getElementById("prompt-honmei").value;
    const birthInput = document.getElementById("prompt-birth");
    const error = document.getElementById("prompt-error");
    if(!birthInput.value || !id){
      if(error){
        error.classList.add("show");
        error.innerHTML = `<p style="margin:0;color:var(--red)">生年月日を入力し、本命宿を選択してください。</p>`;
      }
      (!birthInput.value ? birthInput : document.getElementById("prompt-honmei")).focus();
      return;
    }
    if(error){ error.classList.remove("show"); error.innerHTML = ""; }
    const s = findShuku(id);
    const name = document.getElementById("prompt-name").value.trim() || "相談者さん";
    const birth = birthInput.value;
    const genre = document.getElementById("prompt-genre").value;
    const question = document.getElementById("prompt-question").value.trim() || "本質・強み・今後の過ごし方を知りたい";
    const prompt = document.getElementById("prompt-main");
    prompt.textContent = `あなたは宿曜占星術の鑑定文作成サポートです。
以下の情報をもとに、初心者にもわかりやすく、相談者が前向きになれる鑑定文を作成してください。

【相談者情報】
名前：${name}
生年月日：${birth}
本命宿：${s.name}（${s.yomi}）
キーワード：${s.keyword}
基本性格：${s.personality}
強み：${s.strength}
注意点：${s.weakness}
相談ジャンル：${genre}
相談内容：${question}

【鑑定文の構成】
1. やさしい導入
2. 本命宿から見た本質
3. 強みと才能
4. 注意点をやさしく説明
5. 相談内容への具体的な回答
6. 今日からできる開運行動を3つ
7. 前向きな締め

【注意点】
断定しない、不安をあおらない、相手の気持ちを決めつけない、成就を保証しないでください。
専門用語はやさしく説明し、自然で温かい日本語にしてください。
記号の * と **、Markdown形式は使わず、読みやすい通常の文章で900〜1200文字程度にしてください。`;
    document.getElementById("main-prompt-box").hidden = false;
    document.getElementById("main-prompt-box").scrollIntoView({behavior:"smooth", block:"center"});
  });
}

/* ---------------------------------------------------------------------
   横長の早見表はタップで開閉。PCでは開いた状態、スマホでは閉じた状態。
--------------------------------------------------------------------- */
function enhanceExpandableTables(){
  const targets = [...document.querySelectorAll(".table-wrap")].filter(el =>
    el.querySelector(".table-scroll, #matrix-wrap") || el.id === "matrix-section"
  );
  targets.forEach((target, index) => {
    if(target.parentElement?.classList.contains("table-fold")) return;
    const details = document.createElement("details");
    details.className = "table-fold";
    details.open = window.matchMedia("(min-width: 601px)").matches;
    const summary = document.createElement("summary");
    const title = target.querySelector(".table-title")?.textContent.trim() || `早見表 ${index + 1}`;
    summary.textContent = `${title}（タップして開閉）`;
    target.parentNode.insertBefore(details, target);
    details.append(summary, target);
  });

  const openHashTarget = () => {
    if(!location.hash) return;
    const target = document.querySelector(location.hash);
    const details = target?.closest("details.table-fold");
    if(details) details.open = true;
  };
  openHashTarget();
  window.addEventListener("hashchange", openHashTarget);
}

/* ---------------------------------------------------------------------
   日運計算ツール（STEP6） — 当日の宿は手入力必須（安全設計）
--------------------------------------------------------------------- */
function buildDayFortuneSelects(){
  ["day-honmei","day-today"].forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = `<option value="">-- 宿を選択 --</option>` +
      SHUKU_DATA.map(s => `<option value="${s.id}">${s.id}. ${s.name}</option>`).join("");
  });
}

function bindDayFortuneForm(){
  const btn = document.getElementById("day-submit");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const honId = document.getElementById("day-honmei").value;
    const todayId = document.getElementById("day-today").value;
    const box = document.getElementById("day-result");
    if(!honId || !todayId){
      box.classList.add("show");
      box.innerHTML = `<p style="margin:0;color:var(--red)">本命宿と、見たい日の宿の両方を選択してください。日の宿が分からない場合は、宿曜暦・カレンダー等でご確認のうえ入力してください。</p>`;
      return;
    }
    const type = getShukuDistanceType(Number(honId), Number(todayId));
    const d = DAY_FORTUNE.find(x => x.key === type);
    box.classList.add("show");
    box.innerHTML = `
      <div class="rtitle">${type}の日 — ${d.theme}</div>
      <p><b>向いている行動：</b>${d.action}</p>
      <p><b>注意点：</b>${d.caution}</p>
      <p><b>恋愛：</b>${d.love}</p>
      <p><b>仕事：</b>${d.work}</p>
      <p style="margin:0"><b>鑑定文例：</b>${d.judge}</p>`;
  });
}

/* ---------------------------------------------------------------------
   ナビ（モバイルトグル + スムーススクロール）
--------------------------------------------------------------------- */
function bindNav(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if(toggle && nav){
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
}

/* ---------------------------------------------------------------------
   早見表ジャンプ フローティングメニュー
--------------------------------------------------------------------- */
function bindJumpFab(){
  const btn = document.getElementById("jump-fab-btn");
  const menu = document.getElementById("jump-menu");
  if(!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if(!e.target.closest(".jump-fab")) menu.classList.remove("open");
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.remove("open")));
}

/* ---------------------------------------------------------------------
   プロンプトコピー機能
--------------------------------------------------------------------- */
function copyTextToClipboard(text){
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => { if(!done){ done = true; resolve(ok); } };

    const fallback = () => {
      try{
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        finish(ok);
      }catch(err){ finish(false); }
    };

    if(navigator.clipboard && window.isSecureContext){
      // クリップボード許可待ちで無期限にハングしないよう、タイムアウトを設ける
      const timer = setTimeout(fallback, 800);
      navigator.clipboard.writeText(text).then(() => {
        clearTimeout(timer); finish(true);
      }).catch(() => {
        clearTimeout(timer); fallback();
      });
    } else {
      fallback();
    }
  });
}

function bindCopyButtons(){
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.dataset.copy);
      if(!target) return;
      const orig = btn.textContent;
      await copyTextToClipboard(target.innerText);
      btn.textContent = "✓ コピーしました！";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 1800);
    });
  });
}

/* ---------------------------------------------------------------------
   学習完了チェックリスト（localStorage保存）
--------------------------------------------------------------------- */
function bindChecklists(){
  document.querySelectorAll(".check-list input[type=checkbox]").forEach(cb => {
    const key = "shukuyo_" + cb.dataset.key;
    cb.checked = localStorage.getItem(key) === "1";
    cb.addEventListener("change", () => {
      localStorage.setItem(key, cb.checked ? "1" : "0");
      updateProgress();
    });
  });
  updateProgress();
}

function updateProgress(){
  const all = document.querySelectorAll(".check-list input[type=checkbox]");
  if(!all.length) return;
  const done = [...all].filter(c => c.checked).length;
  const note = document.getElementById("progress-note");
  if(note) note.textContent = `学習進捗：${done} / ${all.length} 項目 完了`;
}
