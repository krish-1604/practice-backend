const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  addUser,
  deleteUser,
  editUser
} = require('../controllers/userControllers');

router.get('/', getAllUsers);
router.post('/', addUser);
router.delete('/:id', deleteUser);
router.put('/:id', editUser);

module.exports = router;
