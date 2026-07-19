const express = require('express');
const router = express.Router();
const { getMessages, uploadFile } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All chat routes require authentication
router.use(protect);

router.get('/messages/:roomId', getMessages);
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
