const express = require('express');
const router = express.Router();
const instaController = require('../controllers/igController');

router.post('/', instaController.addInstaUser);
router.get('/', instaController.getInstaUsers);

module.exports = router;
