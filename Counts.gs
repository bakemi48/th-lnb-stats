/**
 * 突入回数（行ごと）を縦スピルで返す
 * 平均最小化：lastColは連続列前提で早期停止、集計はヒストグラムでO(R+L)
 */
function ATTEMPT_COUNT(inputRange) {
  var data = inputRange;
  var R = data.length;
  var C = data[0] ? data[0].length : 0;
  if (R === 0 || C === 0) return [];

  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) {
    // 全空：R行ぶん0
    var z = [];
    for (var i = 0; i < R; i++) z.push([0]);
    return z;
  }

  var lastIdx = lastNonEmptyRowIdxPerCol_uptoLastCol(data, lastCol);

  // lastIdxのヒストグラム[0,R-1]
  var freq = new Array(R).fill(0);
  for (var c = 0; c <= lastCol; c++) {
    var li = lastIdx[c];
    if (li >= 0) freq[li]++; // 全空列(-1)は数えない
  }

  // 下から累積してattempts[r]=lastIdx>=rの列数
  var out = new Array(R);
  var running = 0;
  for (var r = R - 1; r >= 0; r--) {
    running += freq[r];
    out[r] = [running];
  }
  return out;
}


/**
 * 突破回数（行ごと）を縦スピルで返す
 * 平均最小化：列→行で到達範囲だけ走査（総セル数=Σ(lastIdx+1)）
 */
function CLEAR_COUNT(inputRange) {
  var data = inputRange;
  var R = data.length;
  var C = data[0] ? data[0].length : 0;
  if (R === 0 || C === 0) return [];

  var lastCol = lastNonEmptyColIdx(data);
  if (lastCol === -1) {
    var z = [];
    for (var i = 0; i < R; i++) z.push([0]);
    return z;
  }

  var lastIdx = lastNonEmptyRowIdxPerCol_uptoLastCol(data, lastCol);

  // 行ごとの合計を先に作る
  var rowSum = new Array(R).fill(0);

  // 各列について「到達している行」だけ見る
  for (var c = 0; c <= lastCol; c++) {
    var li = lastIdx[c];
    if (li < 0) continue; // 全空列は無視
    for (var r = 0; r <= li; r++) {
      if (isZeroOrBlank(data[r][c])) rowSum[r]++;
    }
  }

  // 縦ベクトルへ
  var out = [];
  for (var r2 = 0; r2 < R; r2++) out.push([rowSum[r2]]);
  return out;
}
