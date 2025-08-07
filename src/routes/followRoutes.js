// routes/followRoutes.js
const router = require('express').Router();
const { followUser, unfollowUser, getFollowers, getFollowing } = require('../controller/followController');

router.post('/follow/:userIdToFollow', followUser);
router.post('/unfollow/:userIdToUnfollow', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

module.exports = router;
