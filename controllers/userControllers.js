const { db1 } = require('../config/db'); // Destructure to get the actual pool

async function getAllUsers(req, res) {
  try {
    const search = req.query.search?.trim() || '';
    const searchBy = req.query.searchBy || 'all';

    if (search) {
      let whereConditions = [];
      let queryParams = [];

      if (searchBy === 'name' || searchBy === 'all') {
        whereConditions.push('name LIKE ?');
        queryParams.push(`%${search}%`);
      }
      if (searchBy === 'email' || searchBy === 'all') {
        whereConditions.push('email LIKE ?');
        queryParams.push(`%${search}%`);
      }

      const whereClause = ` WHERE ${whereConditions.join(' OR ')}`;
      const dataQuery = `SELECT * FROM users${whereClause} ORDER BY id DESC`;
      const [rows] = await db1.query(dataQuery, queryParams);

      res.json({
        users: rows,
        totalUsers: rows.length,
        isSearch: true,
        search,
        searchBy
      });
    } else {
      const start = parseInt(req.query.start) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const [countResult] = await db1.query('SELECT COUNT(*) as total FROM users');
      const totalUsers = countResult[0].total;

      const [rows] = await db1.query(
        'SELECT * FROM users ORDER BY id DESC LIMIT ? OFFSET ?',
        [limit, start]
      );

      const hasMore = (start + limit) < totalUsers;

      res.json({
        users: rows,
        hasMore,
        totalUsers,
        nextStart: hasMore ? start + limit : null,
        currentStart: start,
        limit,
        isSearch: false
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function searchUsers(req, res) {
  try {
    const { query, searchBy = 'all', start = 0, limit = 10 } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = query.trim();
    const startNum = parseInt(start);
    const limitNum = parseInt(limit);

    let whereConditions = [];
    let queryParams = [];

    switch (searchBy) {
      case 'name':
        whereConditions.push('name LIKE ?');
        queryParams.push(`%${searchTerm}%`);
        break;
      case 'email':
        whereConditions.push('email LIKE ?');
        queryParams.push(`%${searchTerm}%`);
        break;
      case 'exact_email':
        whereConditions.push('email = ?');
        queryParams.push(searchTerm);
        break;
      case 'starts_with_name':
        whereConditions.push('name LIKE ?');
        queryParams.push(`${searchTerm}%`);
        break;
      default:
        whereConditions.push('name LIKE ?', 'email LIKE ?');
        queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    const whereClause = whereConditions.join(' OR ');
    const [countResult] = await db1.query(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      queryParams
    );
    const totalResults = countResult[0].total;

    const [rows] = await db1.query(
      `SELECT * FROM users WHERE ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...queryParams, limitNum, startNum]
    );

    const hasMore = (startNum + limitNum) < totalResults;

    res.json({
      users: rows,
      totalResults,
      hasMore,
      nextStart: hasMore ? startNum + limitNum : null,
      currentStart: startNum,
      limit: limitNum,
      searchQuery: searchTerm,
      searchBy
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search error' });
  }
}

async function addUser(req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await db1.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const [result] = await db1.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}

async function editUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await db1.query(
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
  }
}

module.exports = {
  getAllUsers,
  searchUsers,
  addUser,
  deleteUser,
  editUser,
};
