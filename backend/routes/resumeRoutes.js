const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/resumeController');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);
router.patch('/:id/template', auth, controller.changeTemplate);

module.exports = router;
