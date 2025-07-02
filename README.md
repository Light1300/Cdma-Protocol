# 🛰️ CDMA Protocol Visualizer

A dynamic, interactive web application that demonstrates Code Division Multiple Access (CDMA) communication protocol using Walsh-Hadamard codes. This educational tool helps visualize how multiple stations can simultaneously transmit data over the same frequency band.

## 🌟 Features

- **Dynamic Station Management**: Add/remove stations dynamically
- **Real-time Visualization**: See encoding, combining, and decoding processes
- **Interactive UI**: Modern, responsive design with animations
- **Educational Focus**: Clear visualization of CDMA concepts
- **Walsh Code Generation**: Automatic generation of orthogonal Walsh-Hadamard codes
- **Error Handling**: Input validation and error reporting

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone or create the project structure:**
```bash
mkdir cdma-simulation
cd cdma-simulation
```

2. **Set up the file structure:**
```
cdma-simulation/
│
├── public/
│   └── index.html         ← Frontend UI
│
├── cdma.js                ← CDMA logic implementation
├── server.js              ← Express server
├── package.json           ← Dependencies
└── README.md              ← This file
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start the server:**
```bash
npm start
```

5. **Open your browser and navigate to:**
```
http://localhost:3000
```

## 🎯 How to Use

1. **Add Stations**: Click "➕ Add Station" to add communication stations
2. **Enter Data**: Input binary data (0s and 1s) for each station
3. **Simulate**: Click "▶️ Simulate CDMA" to run the simulation
4. **Observe Results**: Watch the encoding, combining, and decoding process

### Example Input
- Station 1: `1010`
- Station 2: `1100`
- Station 3: `0011`

## 🔬 CDMA Process Explained

### 1. **Encoding Phase**
- Each station's data bits are spread using unique Walsh codes
- Binary 0 becomes -1, binary 1 remains 1 (BPSK modulation)
- Each bit is multiplied by the station's Walsh code sequence

### 2. **Channel Combining**
- All encoded signals are added together
- Simulates multiple stations transmitting simultaneously
- Creates interference that needs to be resolved

### 3. **Decoding Phase**
- Combined signal is correlated with each station's Walsh code
- Positive correlation indicates bit 1, negative indicates bit 0
- Orthogonal codes allow perfect separation (in ideal conditions)

## 🧮 Walsh-Hadamard Codes

Walsh codes are orthogonal binary sequences that enable multiple access:

**Example 4x4 Walsh Matrix:**
```
Code 1: [ 1,  1,  1,  1]
Code 2: [ 1, -1,  1, -1]
Code 3: [ 1,  1, -1, -1]
Code 4: [ 1, -1, -1,  1]
