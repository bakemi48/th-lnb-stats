/**
 * 連続区間 [k..l] を「0 または空欄」で通過できた列の本数を返す。
 * ただし「その列が l 行まで到達している（最終非空行 >= l）」列のみを対象とする。
 * さらに、探索対象の列は「範囲内でどこか1つでも非空がある最後の列」まで。
 *
 * 使い方例:
 *   =COUNT_ZERO_BLANK_STREAK(E2:ZZ61, 10, 15)
 *   // inputRange の上から10行目〜15行目（連続区間）を評価
 */
function COUNT_ZERO_BLANK_STREAK(inputRange, k, l) {
  var data = inputRange; // 2次元配列 [行][列]
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;
  if (numRows === 0 || numCols === 0) return 0;

  // --- 判定関数（あなたの既存関数と整合） ---
  // 「非空」：数値は 0 でも非空。文字列は trim して空でなければ非空。
  function isNonEmpty(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === 'number') return true;
    var s = String(v).trim();
    return s !== "";
  }

  // 「0または空欄」：null/空/空白のみ はOK、数値0はOK、"0"等もOK
  function isZeroOrBlank(v) {
    if (v === null || v === undefined) return true;
    if (typeof v === 'number') return v === 0;
    var s = String(v).trim();
    if (s === "") return true;
    var n = Number(s);
    return !isNaN(n) && n === 0;
  }

  // --- k,l を inputRange 内の 1始まり行番号として扱う ---
  k = Number(k);
  l = Number(l);
  if (!isFinite(k) || !isFinite(l)) return 0;

  var s = Math.min(k, l) - 1; // 0始まりに変換
  var e = Math.max(k, l) - 1;

  if (s < 0) s = 0;
  if (e >= numRows) e = numRows - 1;
  if (s > e) return 0;

  // --- 「最後に非空がある列」までを探索対象にする ---
  var lastNonEmptyCol = -1;
  for (var c = 0; c < numCols; c++) {
    for (var r = 0; r < numRows; r++) {
      if (isNonEmpty(data[r][c])) {
        lastNonEmptyCol = c;
        break;
      }
    }
  }
  if (lastNonEmptyCol === -1) return 0;

  // --- 各列の「最終非空行」を求める（0始まり） ---
  var lastIdxPerCol = new Array(lastNonEmptyCol + 1).fill(-1);
  for (var c = 0; c <= lastNonEmptyCol; c++) {
    for (var r = numRows - 1; r >= 0; r--) {
      if (isNonEmpty(data[r][c])) {
        lastIdxPerCol[c] = r;
        break;
      }
    }
  }

  // --- 条件を満たす列を数える ---
  var count = 0;

  for (var c = 0; c <= lastNonEmptyCol; c++) {
    // その列が区間末尾 e まで到達していないなら除外
    if (lastIdxPerCol[c] < e) continue;

    var ok = true;
    for (var r = s; r <= e; r++) {
      if (!isZeroOrBlank(data[r][c])) {
        ok = false;
        break;
      }
    }
    if (ok) count++;
  }

  return count;
}
