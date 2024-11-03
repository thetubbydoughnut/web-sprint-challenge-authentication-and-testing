const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig');

router.post('/register', async (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("username and password required");
  }

  try {
    // Check if username exists
    const existing = await db('users').where('username', username).first();
    if (existing) {
      return res.status(400).json("username taken");
    }

    const hash = bcrypt.hashSync(password, 8);
    // Insert the user and get the id
    const [id] = await db('users').insert({
      username,
      password: hash,
    });

    // Fetch the newly created user to return
    const newUser = await db('users')
      .where('id', id)
      .first();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("username and password required");
  }

  try {
    const user = await db('users').where('username', username).first();
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json("invalid credentials");
    }

    const token = jwt.sign({
      subject: user.id,
      username: user.username
    }, process.env.JWT_SECRET || "shh", { expiresIn: '1d' });

    res.json({
      message: `welcome, ${user.username}`,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
