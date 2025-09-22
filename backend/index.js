
const express = require('express');
const cors = require('cors');

const app = express();
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Library Management System API is running');
});

// In-memory user storage (for demo purposes)
let users = [];

// Register route
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);
    
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
