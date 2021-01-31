'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

// Metodo para insertar usuario
router.post('/user', userController.user);

module.exports = router;
