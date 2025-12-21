const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getMatches,
  sendConnection,
  acceptConnection
} = require('../controllers/matching');

router.use(auth);
router.get('/matches', getMatches);
router.post('/connection', sendConnection);
router.patch('/connection/:id/accept', acceptConnection);

module.exports = router;
