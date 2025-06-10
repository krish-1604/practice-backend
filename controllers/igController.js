const { db2 } = require('../config/db');

exports.addInstaUser = async (req, res) => {
  const { instagram_username, age } = req.body;

  if (!instagram_username || !age) {
    return res.status(400).json({ error: 'instagram_username and age are required' });
  }

  let conn;
  try {
    conn = await db2.getConnection();
    const [result] = await conn.query(
      'INSERT INTO insta_users (instagram_username, age) VALUES (?, ?)',
      [instagram_username, age]
    );
    res.status(201).json({ 
      message: 'Insta user added', 
      id: result.insertId.toString(),
      instagram_username,
      age
    });
  } catch (error) {
    console.error('Error adding Instagram user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Instagram username already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  } finally {
    if (conn) conn.release();
  }
};

exports.getInstaUsers = async (req, res) => {
  let conn;
  try {
    conn = await db2.getConnection();
    const [rows] = await conn.query('SELECT * FROM insta_users ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching Instagram users:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
};

exports.deleteInstaUser = async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await db2.getConnection();
    const [result] = await conn.query('DELETE FROM insta_users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instagram user not found' });
    }
    res.json({ message: 'Instagram user deleted successfully' });
  } catch (error) {
    console.error('Error deleting Instagram user:', error);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
};

exports.updateInstaUser = async (req, res) => {
  const { id } = req.params;
  const { instagram_username, age } = req.body;
  
  if (!instagram_username || !age) {
    return res.status(400).json({ error: 'instagram_username and age are required' });
  }

  let conn;
  try {
    conn = await db2.getConnection();
    const [result] = await conn.query(
      'UPDATE insta_users SET instagram_username = ?, age = ? WHERE id = ?',
      [instagram_username, age, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Instagram user not found' });
    }
    res.json({ id: parseInt(id), instagram_username, age });
  } catch (error) {
    console.error('Error updating Instagram user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Instagram username already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  } finally {
    if (conn) conn.release();
  }
};