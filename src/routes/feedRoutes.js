const router = require('express').Router();
const { addPost, getAllPosts, addComment, addShared, addLike } = require('../controller/feedController');
const multer = require('multer');
const path = require('path');

// Setup storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.post('/posts', upload.single('image'), addPost);

router.get('/posts', getAllPosts);
router.post('/posts/:postId/like', addLike);
router.post('/posts/:postId/comment', addComment);
router.post('/posts/:postId/share', addShared);

module.exports = router;
