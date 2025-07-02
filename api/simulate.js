import {
  generateWalshMatrix,
  encode,
  decode,
  combineSignals
} from "../cdma.js";

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { stations } = req.body;

    if (!stations || stations.length === 0) {
      return res.status(400).json({ error: "No stations provided" });
    }

    for (let i = 0; i < stations.length; i++) {
      if (!stations[i] || !/^[01]+$/.test(stations[i].trim())) {
        return res.status(400).json({
          error: `Station ${i + 1} has invalid data. Use only 0s and 1s.`,
        });
      }
    }

    const walshSize = Math.pow(2, Math.ceil(Math.log2(stations.length)));
    const walshMatrix = generateWalshMatrix(walshSize);

    const encodedSignals = stations.map((bits, idx) => {
      const bitArray = bits.trim().split("").map(Number);
      return encode(bitArray, walshMatrix[idx]);
    });

    const combined = combineSignals(encodedSignals);

    const decoded = walshMatrix.slice(0, stations.length).map((code) =>
      decode(combined, code)
    );

    res.status(200).json({
      originalData: stations,
      walshCodes: walshMatrix.slice(0, stations.length),
      encodedSignals,
      combined,
      decoded
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
