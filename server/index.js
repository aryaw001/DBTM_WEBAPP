import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://dbtm-frontend.onrender.com", // ✅ your actual frontend URL
}));
app.use(express.json());

// ✅ MySQL Connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

const db = mysql.createPool(dbConfig);

// ✅ REGISTER
app.post('/api/register', async (req, res) => {
  const { name, age, weight, email, password } = req.body;
  try {
    await db.execute(
      'INSERT INTO users (name, age, weight, email, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, age, weight, email, password]
    );
    res.status(200).json({ message: 'User registered' });
  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ DATALOSS-PROOF: SAVE MEASUREMENT
app.post('/api/measurements', async (req, res) => {
  const {
    user_id,
    name = 'Unknown',
    age = 0,
    weight = 0,
    crownHeight = 0,
    shoulderHeight = 0,
    elbowReach = 0,
    hipHeight = 0,
    handReach = 0,
    kneeHeight = 0,
    ankleHeight = 0,
  } = req.body;

  console.log('📥 POST /api/measurements Payload:', {
    user_id,
    name,
    age,
    weight,
    crownHeight,
    shoulderHeight,
    elbowReach,
    hipHeight,
    handReach,
    kneeHeight,
    ankleHeight,
  });

  try {
    await db.execute(
      `INSERT INTO measurements 
      (user_id, name, age, weight, date, crownHeight, shoulderHeight, elbowReach, hipHeight, handReach, kneeHeight, ankleHeight)
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        age,
        weight,
        crownHeight,
        shoulderHeight,
        elbowReach,
        hipHeight,
        handReach,
        kneeHeight,
        ankleHeight,
      ]
    );

    console.log('✅ Measurement saved to MySQL for user_id:', user_id);
    res.status(201).json({ message: '✅ Measurement saved successfully' });

  } catch (err) {
    console.error('❌ Error saving measurement:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
  });



// ✅ FETCH MEASUREMENT HISTORY
app.get('/api/measurements/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const [results] = await db.execute(
      `SELECT * FROM measurements WHERE user_id = ? ORDER BY date DESC`,
      [userId]
    );
    res.json(results);
  } catch (err) {
    console.error('❌ Fetch Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ SERVER START
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});