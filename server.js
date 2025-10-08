const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Serve static files from src folder
app.use(express.static(path.join(__dirname, 'src')));

// Load users from users.json
const usersPath = path.join(__dirname, 'users.json');

// POST /register
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  let users = [];
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath));
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  users.push({ username, password });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(usersPath)) {
    return res.status(400).json({ success: false, message: 'No users registered yet.' });
  }

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Serve index.html from src as the root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'Index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
