/**
 * 区間[k,l]（1始まり）をノーミス（0/空欄）で通し切った列数を返す
 * 第4引数 addValue があれば、その値を最終結果に加算する
 */
function NN_STREAK_COUNT(inputRange, k, l, addValue) {
  var inherited = toNumberOrZero_(addValue);

  var data = inputRange;
  var R = data.length;
  var C = data[0] ? data[0].length : 0;
  if (R === 0 || C === 0) return inherited;

  k = Number(k);
  l = Number(l);
  if (!Number.isFinite(k) || !Number.isFinite(l)) return inherited;

  var s = Math.min(k, l) - 1;
  var e = Math.max(k, l) - 1;
  if (s < 0) s = 0;
  if (e >= R) e = R - 1;
  if (s > e) return inherited;

  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) return inherited;

  var lastIdx = lastNonEmptyRowIdxPerCol_uptoLastCol(data, lastCol);

  var count = 0;
  for (var c = 0; c <= lastCol; c++) {
    if (lastIdx[c] < e) continue; // eまで到達していない列は除外

    var ok = true;
    for (var r = s; r <= e; r++) {
      if (!isZeroOrBlank(data[r][c])) {
        ok = false;
        break;
      }
    }
    if (ok) count++;
  }

  return count + inherited;
}

/**
 * G4, G5 のようなセルに入っている "=G49", "=G61" から行番号を読み取り、
 * DATA範囲内での区間に変換してNN回数を返す。
 */
function NN_STREAK_COUNT_BY_REF(inputRange, startFormulaText, nextFormulaText, dataTopRow, addValue) {
  var startSheetRow = extractRowFromFormulaText_(startFormulaText);
  var nextSheetRow = extractRowFromFormulaText_(nextFormulaText);

  var top = Number(dataTopRow);
  if (!Number.isFinite(top)) return toNumberOrZero_(addValue);

  var k = startSheetRow - top + 1;
  var l = nextSheetRow - top;

  return NN_STREAK_COUNT(inputRange, k, l, addValue);
}

/**
 * "=G49" や "=$G$49" から 49 を取り出す
 */
function extractRowFromFormulaText_(formulaText) {
  var s = String(formulaText);
  var m = s.match(/\$?[A-Z]{1,3}\$?([0-9]+)/);
  if (!m) throw new Error("参照セルの式から行番号を読み取れません: " + s);
  return Number(m[1]);
}