const router = require('express').Router();
const auth = require('../middleware/auth');
const { createAnalysis, getMyStartups } = require('../controllers/analysis');

router.use(auth);
router.post('/analyze', createAnalysis);
router.get('/my', getMyStartups);

module.exports = router;
