const inputsEl = document.getElementById("station-inputs");
const messagesEl = document.getElementById("messages");
const vizEl = document.getElementById("visualizer");
const simulateBtn = document.getElementById("simulate-btn");

let stationCount = 0;

// Add a new station input
function addStation(prefill = "") {
  const id = Date.now();
  stationCount++;
  const div = document.createElement("div");
  div.className = "station-input";
  div.id = `station-${id}`;
  div.innerHTML = `
    <input type="text" maxlength="20" placeholder="Enter binary data" id="input-${id}" value="${prefill}" />
    <button class="remove-btn" data-id="${id}" title="Remove">❌</button>
  `;
  inputsEl.appendChild(div);
  div.querySelector(".remove-btn").onclick = () => removeStation(id);
}

// Remove a station input
function removeStation(id) {
  document.getElementById(`station-${id}`).remove();
  stationCount = inputsEl.children.length;
}

// Clear everything and start fresh
function clearAll() {
  inputsEl.innerHTML = "";
  vizEl.innerHTML = "";
  messagesEl.innerHTML = "";
  stationCount = 0;
  addStation();
}

// Show success or error message
function showMessage(text, type = "error") {
  messagesEl.innerHTML = `<div class="message ${type}">${text}</div>`;
  setTimeout(() => { messagesEl.innerHTML = ""; }, 5000);
}

// Validate and collect station inputs
function getStations() {
  const arr = [];
  for (const div of inputsEl.children) {
    const val = div.querySelector("input").value.trim();
    if (!val.match(/^[01]+$/)) {
      throw new Error("All inputs must be non-empty and binary (0/1).");
    }
    arr.push(val);
  }
  if (arr.length === 0) throw new Error("Add at least one station.");
  return arr;
}

// Simulate CDMA by calling the backend
async function simulate() {
  if (simulateBtn.disabled) return;

  try {
    const data = getStations();
    simulateBtn.disabled = true;
    simulateBtn.innerHTML = `<span class="loading"></span>Simulating...`;

    const resp = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stations: data })
    });

    if (!resp.ok) {
      const { error } = await resp.json();
      throw new Error(error || "Server error");
    }

    const result = await resp.json();
    renderResult(result);
    showMessage("✅ Simulation successful!", "success");
  } catch (err) {
    showMessage(`⚠️ ${err.message}`, "error");
  } finally {
    simulateBtn.disabled = false;
    simulateBtn.innerHTML = "▶️ Simulate CDMA";
  }
}

// Render visual output
function renderResult({ originalData, walshCodes, encodedSignals, combined, decoded }) {
  vizEl.innerHTML = "";

  function buildSection(title, items, bitClass) {
    const sec = document.createElement("div");
    sec.className = "section";
    sec.innerHTML = `<h3>${title}</h3>`;
    items.forEach(bits => {
      const row = document.createElement("div");
      row.className = "bit-row";
      const arr = Array.isArray(bits) ? bits : bits.split("");
      arr.forEach(b => {
        const bitEl = document.createElement("div");
        bitEl.className = `bit ${bitClass}`;
        bitEl.textContent = b;
        row.appendChild(bitEl);
      });
      sec.appendChild(row);
    });
    vizEl.appendChild(sec);
  }

  buildSection("📊 Original Data", originalData, "original");
  buildSection("🔢 Walsh Codes", walshCodes, "walsh");
  buildSection("📡 Encoded Signals", encodedSignals, "encoded");
  buildSection("🌐 Combined Signal", [combined], "combined");
  buildSection("✅ Decoded Signals", decoded, "decoded");
}

// Event listeners
document.getElementById("add-btn").onclick = () => addStation();
document.getElementById("clear-btn").onclick = clearAll;
simulateBtn.onclick = simulate;

// Initialize with one station
clearAll();
