/**
 * 区間[k,l]（1始まり）をノーミス（0/空欄）で通し切った列数を返す
 * 平均最小化：lastColは連続列前提で早期停止、判定はK行だけ
 */
function NN_STREAK_COUNT(inputRange, k, l) {
  var data = inputRange;
  var R = data.length;
  var C = data[0] ? data[0].length : 0;
  if (R === 0 || C === 0) return 0;

  k = Number(k);
  l = Number(l);
  if (!Number.isFinite(k) || !Number.isFinite(l)) return 0;

  var s = Math.min(k, l) - 1;
  var e = Math.max(k, l) - 1;
  if (s < 0) s = 0;
  if (e >= R) e = R - 1;
  if (s > e) return 0;

  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) return 0;

  var lastIdx = lastNonEmptyRowIdxPerCol_uptoLastCol(data, lastCol);

  var count = 0;
  for (var c = 0; c <= lastCol; c++) {
    if (lastIdx[c] < e) continue; // eまで到達していない列は除外

    var ok = true;
    for (var r = s; r <= e; r++) {
      if (!isZeroOrBlank(data[r][c])) { ok = false; break; }
    }
    if (ok) count++;
  }
  return count;
}
