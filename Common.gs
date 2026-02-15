/**
 * セルが非空ならTrue
 */
function isNonEmpty(v) {
  // 空
  if (v === "" || v === null || v === undefined) return false;

  // 数値
  if (typeof v === "number") return true;

  // 文字列
  if (typeof v === "string") {
    // ASCII>32があれば非空
    for (var i = 0; i < v.length; i++) {
      if (v.charCodeAt(i) > 32) return true;
    }
    return false;
  }

  // その他
  var s = String(v);
  for (var j = 0; j < s.length; j++) {
    if (s.charCodeAt(j) > 32) return true;
  }
  return false;
}

/**
 * セルが0or空欄ならTrue
 */
function isZeroOrBlank(v) {
  // 空
  if (v === "" || v === null || v === undefined) return true;

  // 数値
  if (typeof v === "number") return v === 0;

  // 文字列
  if (typeof v === "string") {
    var s = v;
    var n = s.length;
    if (n === 0) return true;

    // トリム
    var a = 0, b = n - 1;
    while (a <= b && s.charCodeAt(a) <= 32) a++;
    while (a <= b && s.charCodeAt(b) <= 32) b--;
    if (a > b) return true;

    // トリム後が半角数字のみかをチェック
    // 全部'0'ならゼロ、どこかに'1'~'9'があれば非ゼロ
    var allZero = true;
    for (var i = a; i <= b; i++) {
      var code = s.charCodeAt(i);
      if (code < 48 || code > 57) { // '0'~'9'以外
        allZero = null; //例外処理へ
        break;
      }
      if (code !== 48) allZero = false; // '0'以外があれば非ゼロ
    }
    if (allZero !== null) return allZero; // 数字のみ

    // 例外処理：小数/記号/文字等を含む場合
    // 数値化して0ならゼロ扱い
    var t = (a === 0 && b === n - 1) ? s : s.substring(a, b + 1);
    var num = Number(t);
    return !isNaN(num) && num === 0;
  }

  // その他型
  var str = String(v);
  // トリム
  var A = 0, B = str.length - 1;
  while (A <= B && str.charCodeAt(A) <= 32) A++;
  while (A <= B && str.charCodeAt(B) <= 32) B--;
  if (A > B) return true;

  // 数値化して0ならゼロ扱い
  var tt = (A === 0 && B === str.length - 1) ? str : str.substring(A, B + 1);
  var nn = Number(tt);
  return !isNaN(nn) && nn === 0;
}

/**
 * 「非空セルの存在する最後の列のインデックス（0始まり）」を返す
 * 非空セルが存在しなければ-1
 */
function lastNonEmptyColIdx(data) {
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;
  if (numRows === 0 || numCols === 0) return -1;

  var lastCol = -1;

  // 途中に全空列があっても許容、最後まで走査
  for (var c = 0; c < numCols; c++) {
    for (var r = 0; r < numRows; r++) {
      if (isNonEmpty(data[r][c])) {
        lastCol = c;   // この列に非空がある為更新
        break;         // 次の列へ
      }
    }
  }

  return lastCol;
}

/**
 * lastNonEmptyColIdxの平均最小化版
 * 全空列出現直前の列インデックス（0始まり）を返す
 * 前提：データ列は左から連続し、以降は全部空列
 * 全空なら-1
 * 先頭から続く全空列のみ許容
 */
function lastNonEmptyColIdx_contiguous(data) {
  var R = data.length;
  var C = (data[0] ? data[0].length : 0);
  if (R === 0 || C === 0) return -1;

  var lastCol = -1;

  for (var c = 0; c < C; c++) {
    var hasNonEmpty = false;
    for (var r = 0; r < R; r++) {
      if (isNonEmpty(data[r][c])) { hasNonEmpty = true; break; }
    }

    if (hasNonEmpty) {
      lastCol = c;
    } else {
      // 既に一度でも非空列が出ていて、その次が全空列なら、以降も空と見なして終了
      if (lastCol !== -1) break;
      // 先頭から全空が続いている場合は、もう少し先で初めて非空が来る可能性があるので続行
    }
  }
  return lastCol;
}

/**
 * [0,lastCol]の各列について、最終非空行（0始まり）を返す（全空列は-1）
 * lastColが-1の場合は空配列
 */
function lastNonEmptyRowIdxPerCol_uptoLastCol(data, lastCol) {
  if (lastCol < 0) return [];
  var R = data.length;
  var out = new Array(lastCol + 1).fill(-1);

  for (var c = 0; c <= lastCol; c++) {
    for (var r = R - 1; r >= 0; r--) {
      if (isNonEmpty(data[r][c])) { out[c] = r; break; }
    }
  }
  return out;
}
