// controller/followController.js
const User = require('../modals/User');

const followUser = async (req, res) => {
  const { userIdToFollow } = req.params; // user to be followed
  const currentUserId = req.body.currentUserId; // logged in user

  if (userIdToFollow === currentUserId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  try {
    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (currentUser.following.includes(userIdToFollow)) {
      return res.status(400).json({ message: "Already following." });
    }

    currentUser.following.push(userIdToFollow);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error following user.", error: err.message });
  }
};

const unfollowUser = async (req, res) => {
  const { userIdToUnfollow } = req.params;
  const currentUserId = req.body.currentUserId;

  try {
    const userToUnfollow = await User.findById(userIdToUnfollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error unfollowing user.", error: err.message });
  }
};

const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('followers', 'name username image');
    res.status(200).json(user.followers);
  } catch (err) {
    res.status(500).json({ message: "Error getting followers.", error: err.message });
  }
};

const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('following', 'name username image');
    res.status(200).json(user.following);
  } catch (err) {
    res.status(500).json({ message: "Error getting following.", error: err.message });
  }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing };
