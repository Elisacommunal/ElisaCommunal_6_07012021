const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const userPassword = require('../middleware/validate-password')

router.post('/signup', userPassword, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;