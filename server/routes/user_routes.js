const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user_controller');

router.post('/', user_controller.userCreate);
router.get('/:id', user_controller.userRead);
router.put('/:id', user_controller.userUpdate);
router.delete('/:id', user_controller.userDelete);
router.get('/', user_controller.readAll);
router.post('/check', user_controller.checkIndex);

module.exports = router;