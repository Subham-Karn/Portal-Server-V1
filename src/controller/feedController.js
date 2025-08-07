const Post = require('../modals/Post');
const User = require('../modals/User');

const addPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const image = req.file?.filename;
    if (!title || !content || !userId || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const post = await Post.create({ title, content, image, user: user._id });
    res.status(201).json({ message: 'Post created', data: post });

  } catch (error) {
    console.error('Add post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user').sort({ createdAt: -1 });
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

const addLike = async (req , res) =>{
    const {like , postId} = req.body;
    if(like == Number){
        return res.status(400).json({message: 'like must be a number'});
    }
    const post = await Post.findById(req.params.postId);
    if(!post) return res.status(404).json({message: 'Post not found'});
    post.like = like;
    await post.save();
    res.status(200).json({message: 'Link added successfully'});
}

const addShared = async (req , res) =>{
    const {share , postId} = req.body;
    if(share == Number){
        return res.status(400).json({message: 'share must be a number'});
    }
    const post = await Post.findById(req.params.postId);
    if(!post) return res.status(404).json({message: 'Post not found'});
    post.share = share;
    await post.save();
    res.status(200).json({message: 'Link added successfully'});
}

const addComment = async (req , res) =>{
    const {comment} = req.body;
    if(comment == String){
        return res.status(400).json({message: 'comment must be a string'});
    }
    const post = await Post.findById(req.params.postId);
    if(!post) return res.status(404).json({message: 'Post not found'});
    post.comment = comment;
    await post.save();
    res.status(200).json({message: 'Link added successfully'});
}

module.exports = { addPost, getAllPosts , addLike , addShared , addComment };
