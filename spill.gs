/**
 * 各列で「最後に空でない行」までを 1 とみなし、
 * その“積み上げ”の合計を行ごとに返す。
 *
 * 例: D2 に =STACKCOUNT(E2:ZZ61)
 * → D2:D61 に結果が縦に出る（スピル）
 */
function STACKCOUNT(inputRange) {
  // 2次元配列で受け取り
  var data = inputRange;
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;

  if (numRows === 0 || numCols === 0) {
    return [];
  }

  // 各列の「最後の非空セルの行インデックス」を求める（0始まり）
  // ※ 本件では「空欄 or 数字」とのことなので、"" 以外を非空として扱う
  var lastNonEmptyRowIdxPerCol = new Array(numCols).fill(-1); // -1 は全空列

  for (var c = 0; c < numCols; c++) {
    for (var r = numRows - 1; r >= 0; r--) {
      var v = data[r][c];
      // ""（空文字）だけを空とみなす。スペース等も空扱いにしたいなら下の条件を使ってください。
      // if (v !== null && v !== undefined && String(v).toString().trim() !== "") { ... }
      if (v !== "") {
        lastNonEmptyRowIdxPerCol[c] = r;
        break;
      }
    }
  }

  // 行 r について、lastNonEmptyRowIdx >= r の列の本数を数える
  var out = [];
  for (var r = 0; r < numRows; r++) {
    var count = 0;
    for (var c = 0; c < numCols; c++) {
      if (lastNonEmptyRowIdxPerCol[c] >= r) count++;
    }
    out.push([count]); // 縦ベクトル（1列）として返す
  }

  return out;
}




/**
 * 各列の「最終非空セル」までを対象に、
 * その行のセルが 0 または空欄なら 1 をカウント。
 * 列をまたいで合計し、行ごとの合計(2～61行)を縦ベクトルで返す。
 *
 * 使い方: C2 に =COUNT_ZERO_BLANK_UNTIL_LAST(E2:ZZ61)
 * 返り値: C2:C61 にスピル
 */
function COUNT_ZERO_BLANK_UNTIL_LAST(inputRange) {
  var data = inputRange;                       // 2次元配列 [行][列]
  var numRows = data.length;                   // 期待: 60（2～61行）
  var numCols = data[0] ? data[0].length : 0;  // E～終端の列数

  if (numRows === 0 || numCols === 0) return [];

  // 「非空」の定義：数値0も非空として扱う（最終非空セルの判定用）
  var isNonEmpty = function(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === 'number') return true;         // 0 も true（非空）
    var s = String(v).trim();
    if (s === "") return false;
    return true;
  };

  // 「0または空欄」の定義：空（null/""/空白のみ） or 数値0 or 文字列"0"/"0.0"等のゼロ
  var isZeroOrBlank = function(v) {
    if (v === null || v === undefined) return true;
    if (typeof v === 'number') return v === 0;
    var s = String(v).trim();
    if (s === "") return true;
    var n = Number(s);
    return !isNaN(n) && n === 0;
  };

  // 各列の「最終非空セルの行インデックス」（0始まり）を求める
  // 見つからなければ -1（全空列）
  var lastIdxPerCol = new Array(numCols).fill(-1);
  for (var c = 0; c < numCols; c++) {
    for (var r = numRows - 1; r >= 0; r--) {
      if (isNonEmpty(data[r][c])) {
        lastIdxPerCol[c] = r;
        break;
      }
    }
  }

  // 各行 r について、各列 c を走査：
  //   その列の最終非空行 >= r（=その行は範囲内）かつ
  //   data[r][c] が 0 または空欄なら 1 を加算
  var out = [];
  for (var r = 0; r < numRows; r++) {
    var sum = 0;
    for (var c = 0; c < numCols; c++) {
      if (lastIdxPerCol[c] >= r && isZeroOrBlank(data[r][c])) {
        sum++;
      }
    }
    out.push([sum]); // 縦ベクトル（1列）で返す
  }

  return out;
}
