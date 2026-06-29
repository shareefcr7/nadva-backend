const router = require('express').Router();
const { dbState } = require('../utils/db');

const apiRoutes = require('./api');

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running!',
    time: new Date(),
    database: dbState
  });
});

router.use('/api', apiRoutes);

module.exports = router;

