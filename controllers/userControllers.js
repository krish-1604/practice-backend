const pool = require('../config/db');

async function getAllUsers(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    // MariaDB returns results directly, not in an array
    const rows = await conn.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
}

async function addUser(req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    // MariaDB returns results directly, not in an array
    const result = await conn.query(
      'INSERT INTO users (name, email) VALUES (?, ?)', 
      [name, email]
    );
    const newUser = {
        id: result.insertId.toString(),  // convert BigInt to string
        name,
        email
        };
        console.log("User to send:", newUser);
        res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  } finally {
    if (conn) conn.release();
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
}

async function editUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: parseInt(id), name, email });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  editUser,
};