// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/generate', (req, res) => {
  const { code, staffName } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const generatedLink = `sms:811?body=${encodeURIComponent(code)}`;

  db.run(
    `INSERT INTO links (code, staffName, generatedLink) VALUES (?, ?, ?)`,
    [code, staffName || null, generatedLink],
    function (err) {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        id: this.lastID,
        code,
        staffName,
        link: generatedLink,
      });
    }
  );
});

// Optional: Get all generated links
app.get('/api/links', (req, res) => {
  db.all('SELECT * FROM links ORDER BY createdAt DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB fetch error' });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
