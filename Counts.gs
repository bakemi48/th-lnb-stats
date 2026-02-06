/**
 * 突入回数をカウント・スピルする関数
 * 各列で最終非空セルまでを1と見做し、行毎の合計を縦ベクトルで返す
 * 全空列はカウントしない
 */
function ATTEMPT_COUNT(inputRange) {
  var data = inputRange;  // 2次元配列で受け取り
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;
  if (numRows === 0 || numCols === 0) return [];

  // 「範囲内で最後に非空セルがある列」までを探索対象にする
  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) return data.map(() => [0]); // 全空なら全部0

  // 各列の「最終非空セルの行インデックス」（0始まり）
  var lastIdxPerCol = lastNonEmptyRowIdxPerCol(data, lastCol);

  // 各行rについて、r<=最終非空行 となるセルの個数をカウント
  var out = [];
  for (var r = 0; r < numRows; r++) {
    var count = 0;
    for (var c = 0; c <= lastCol; c++) {
      if (lastIdxPerCol[c] >= r) count++;
    }
    out.push([count]);  // 縦ベクトル（1列）として返す
  }

  return out;
}

/**
 * 突破回数をカウント・スピルする関数
 * 各列の最終非空セルまでを対象に、セルの値が0または空欄なら1をカウント
 * 列を跨いで合計し、行毎の合計を縦ベクトルで返す
 */
function CLEAR_COUNT(inputRange) {
  var data = inputRange;  // 2次元配列で受け取り
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;
  if (numRows === 0 || numCols === 0) return [];

  // 「範囲内で最後に非空セルがある列」までを探索対象にする
  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) return data.map(() => [0]); // 全空なら全部0

  // 各列の「最終非空セルの行インデックス」（0始まり）
  var lastIdxPerCol = lastNonEmptyRowIdxPerCol(data, lastCol);

  // 各行rについて、r<=最終非空行 かつ値が「0または空欄」となるセルの個数をカウント
  var out = [];
  for (var r = 0; r < numRows; r++) {
    var sum = 0;
    for (var c = 0; c <= lastCol; c++) {
      if (lastIdxPerCol[c] >= r && isZeroOrBlank(data[r][c])) {
        sum++;
      }
    }
    out.push([sum]); // 縦ベクトル（1列）で返す
  }

  return out;
}
