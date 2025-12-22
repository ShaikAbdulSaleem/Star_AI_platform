const router = require('express').Router();
const auth = require('../middleware/auth');
const { getOrCreateChat, postMessage } = require('../controllers/chat');

router.use(auth);
router.get('/:connectionId', getOrCreateChat);
router.post('/:connectionId', postMessage);

module.exports = router;
