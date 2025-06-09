// const { db2 } = require('../config/db');

// exports.addInstaUser = async (req, res) => {
//   const { instagram_username, age } = req.body;

//   if (!instagram_username || !age) {
//     return res.status(400).json({ error: 'instagram_username and age are required' });
//   }

//   try {
//     const [result] = await db2.query(
//       'INSERT INTO insta_users (instagram_username, age) VALUES (?, ?)',
//       [instagram_username, age]
//     );
//     res.status(201).json({ message: 'Insta user added', id: result.insertId });
//   } catch (error) {
//     console.error('Error adding Instagram user:', error);
//     res.status(500).json({ error: 'Database error' });
//   }
// };

// exports.getInstaUsers = async (req, res) => {
//   try {
//     const [rows] = await db2.query('SELECT * FROM insta_users');
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error fetching Instagram users:', error);
//     res.status(500).json({ error: 'Database error' });
//   }
// };
