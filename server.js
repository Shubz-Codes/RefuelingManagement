const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'src', 'data');

const files = {
  operator: path.join(dataDir, 'operator_details.json'),
  subasset: path.join(dataDir, 'sub_asset_details.json'),
  refuel: path.join(dataDir, 'refueling_history.json'),
  alert: path.join(dataDir, 'unregistered_vehicles.json'),
};

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Generic GET
app.get('/api/:type', (req, res) => {
  const file = files[req.params.type];
  if (!file) return res.status(404).send('Not found');
  res.json(readJson(file));
});

// Generic POST (add new item)
app.post('/api/:type', (req, res) => {
  const file = files[req.params.type];
  if (!file) return res.status(404).send('Not found');
  const arr = readJson(file);
  arr.push(req.body);
  writeJson(file, arr);
  res.json({ success: true });
});

// Generic PUT (replace all)
app.put('/api/:type', (req, res) => {
  const file = files[req.params.type];
  if (!file) return res.status(404).send('Not found');
  writeJson(file, req.body);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
