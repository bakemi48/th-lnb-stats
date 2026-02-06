// セルが非空ならTrueを返す関数
function isNonEmpty(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number') return true;
  return String(v).trim() !== "";
}

// セルが「0または空欄」ならTrueを返す関数
function isZeroOrBlank(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'number') return v === 0;
  var s = String(v).trim();
  if (s === "") return true;
  var n = Number(s);
  return !isNaN(n) && n === 0;
}

// 「範囲内でどこか1つでも非空がある最後の列のインデックス」（0始まり）を返す関数
// 非空セルが存在しなければ-1
function lastNonEmptyColIdx(data) {
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;

  var lastNonEmptyCol = -1;
  for (var c = 0; c < numCols; c++) {
    for (var r = 0; r < numRows; r++) {
      if (isNonEmpty(data[r][c])) {
        lastNonEmptyCol = c;
        break;
      }
    }
  }
  return lastNonEmptyCol;
}

// 各列の「最終非空セルの行インデックス」（0始まり）を配列で返す関数
// 非空セルの無い列（全空列）なら-1
function lastNonEmptyRowIdxPerCol(data, lastCol) {
  var numRows = data.length;
  var numCols = (data[0] ? data[0].length : 0);
  if (numRows === 0 || numCols === 0) return [];

  if (lastCol === undefined || lastCol === null) lastCol = numCols - 1;
  lastCol = Math.min(lastCol, numCols - 1);

  var lastIdxPerCol = new Array(lastCol + 1).fill(-1);
  for (var c = 0; c <= lastCol; c++) {
    for (var r = numRows - 1; r >= 0; r--) {
      if (isNonEmpty(data[r][c])) {
        lastIdxPerCol[c] = r;
        break;
      }
    }
  }
  return lastIdxPerCol;
}