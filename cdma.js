// cdma.js
function generateWalshMatrix(n) {
  if (n === 1) return [[1]];
  const prev = generateWalshMatrix(n / 2);
  const top = prev.map(row => [...row, ...row]);
  const bottom = prev.map(row => [...row, ...row.map(bit => -bit)]);
  return [...top, ...bottom];
}

function encode(bits, code) {
  return bits.flatMap(bit => code.map(c => c * (bit === 1 ? 1 : -1)));
}

function combineSignals(encodedSignals) {
  const length = encodedSignals[0].length;
  return encodedSignals.reduce((combined, signal) => {
    return combined.map((val, i) => val + signal[i]);
  }, new Array(length).fill(0));
}

function decode(combined, code) {
  const chunkSize = code.length;
  const numChunks = combined.length / chunkSize;
  const result = [];

  for (let i = 0; i < numChunks; i++) {
    const chunk = combined.slice(i * chunkSize, (i + 1) * chunkSize);
    const sum = chunk.reduce((acc, val, idx) => acc + val * code[idx], 0);
    result.push(sum > 0 ? 1 : 0);
  }

  return result;
}

function displayWalshMatrix(matrix) {
  console.log("Walsh Matrix:");
  matrix.forEach((row, i) => console.log(`Code ${i + 1}: [${row.join(', ')}]`));
}

module.exports = { generateWalshMatrix, encode, combineSignals, decode, displayWalshMatrix };
