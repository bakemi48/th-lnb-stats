/**
 * 区間毎のNN回数を返す関数
 * 「範囲内でどこか1つでも非空がある最後の列」までの各列を走査し、
 * 連続区間[k,l]に対し、「l<=最終非空行 かつ区間中全セルが0または空欄」を満たす列の本数をカウント
 * 引数のk,lは1始まりの行数
 */
function NN_STREAK_COUNT(inputRange, k, l) {
  
  var data = inputRange;  // 2次元配列で受け取り
  var numRows = data.length;
  var numCols = data[0] ? data[0].length : 0;
  if (numRows === 0 || numCols === 0) return 0;

  k = Number(k);
  l = Number(l);
  if (!isFinite(k) || !isFinite(l)) return 0;

  var s = Math.min(k, l) - 1; // 0始まりに変換
  var e = Math.max(k, l) - 1;

  if (s < 0) s = 0;
  if (e >= numRows) e = numRows - 1;
  if (s > e) return 0;

  // 「範囲内で最後に非空セルがある列」までを探索対象にする
  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) return 0;

  // 各列の「最終非空セルの行インデックス」（0始まり）
  var lastIdxPerCol = lastNonEmptyRowIdxPerCol(data, lastCol);

  // 条件を満たす列を数える
  var count = 0;
  for (var c = 0; c <= lastCol; c++) {
    // その列が区間末尾eまで到達していないなら除外
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
