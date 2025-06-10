const express = require('express');
const router = express.Router();
const instaController = require('../controllers/igController');

router.post('/', instaController.addInstaUser);
router.get('/', instaController.getInstaUsers);
router.delete('/:id', instaController.deleteInstaUser);
router.put('/:id', instaController.updateInstaUser);

module.exports = router;