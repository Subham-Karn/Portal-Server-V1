const router = require('express').Router();
const {register , login , getAllUsers , getUserById, updateUser , BanUser , UnbanUser , deleteUser, getUserByUsername, searchUsers} = require('../controller/AuthController');
const authMiddleware = require('../middleware/AuthMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/signup', upload.single('image'), register);
router.post('/signup' , register);
router.post('/signin' , login);
router.get('/users' , getAllUsers);
router.get('/users/id/:userId' , getUserById);
router.put('/users/:userId' , updateUser);
router.put('/users/:userId/ban' , BanUser);
router.put('/users/:userId/unban' , UnbanUser);
router.delete('/users/:userId' , deleteUser);
router.get('/users/search' , searchUsers);
router.get('/users/:username' , getUserByUsername);
router.get('/protected', authMiddleware, (req, res) => {
        res.status(200).json({ message: 'Protected route accessed successfully' });
});
router.use((req , res) => res.status(404).json({message: 'Route not found'}));
module.exports = router;