const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/auth'); 

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/guest', controller.createGuestUser);
router.post('/convert-guest', auth, controller.convertGuestToUser); 
router.get('/me', auth, controller.getCurrentUser); 

module.exports = router;