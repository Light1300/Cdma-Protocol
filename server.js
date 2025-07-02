// server.js - Express server for CDMA simulation (ES Module version)

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { encode, decode, combineSignals, generateWalshMatrix, displayWalshMatrix } from "./cdma.js";

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// CDMA simulation endpoint
app.post("/simulate", (req, res) => {
  try {
    const { stations } = req.body;

    if (!stations || stations.length === 0) {
      return res.status(400).json({ error: "No stations provided" });
    }

    for (let i = 0; i < stations.length; i++) {
      if (!stations[i] || !/^[01]+$/.test(stations[i].trim())) {
        return res.status(400).json({
          error: `Station ${i + 1} has invalid data. Please use only 0s and 1s.`
        });
      }
    }

    const walshSize = Math.pow(2, Math.ceil(Math.log2(stations.length)));
    const walshMatrix = generateWalshMatrix(walshSize);

    console.log(`\n=== CDMA Simulation ===`);
    console.log(`Stations: ${stations.length}`);
    console.log(`Walsh Matrix Size: ${walshSize}x${walshSize}`);
    displayWalshMatrix(walshMatrix.slice(0, stations.length));

    const encodedSignals = stations.map((bits, idx) => {
      const bitArray = bits.trim().split("").map(Number);
      const encoded = encode(bitArray, walshMatrix[idx]);

      console.log(`Station ${idx + 1}: ${bits} -> [${encoded.join(', ')}]`);
      return encoded;
    });

    const combined = combineSignals(encodedSignals);
    console.log(`Combined Signal: [${combined.join(', ')}]`);

    const decoded = walshMatrix.slice(0, stations.length).map((code, idx) => {
      const decodedBits = decode(combined, code);
      console.log(`Decoded Station ${idx + 1}: [${decodedBits.join('')}]`);
      return decodedBits;
    });

    console.log(`=== End Simulation ===\n`);

    res.json({
      encodedSignals,
      combined,
      decoded,
      walshCodes: walshMatrix.slice(0, stations.length),
      originalData: stations
    });

  } catch (error) {
    console.error("Simulation error:", error);
    res.status(500).json({ error: "Internal server error during simulation" });
  }
});

// Walsh matrix endpoint
app.get("/walsh/:size", (req, res) => {
  try {
    const size = parseInt(req.params.size);

    if (isNaN(size) || size < 1 || (size & (size - 1)) !== 0) {
      return res.status(400).json({ error: "Size must be a positive power of 2" });
    }

    const matrix = generateWalshMatrix(size);
    res.json({ size, matrix });
  } catch (error) {
    res.status(500).json({ error: "Error generating Walsh matrix" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CDMA Visualizer Server running on http://localhost:${PORT}`);
});
