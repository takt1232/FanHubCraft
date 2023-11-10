import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath, tags } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
            tags: JSON.parse(tags || "[]"), // Parse tags from JSON string (default to empty array)
        })
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);

    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        console.log(post);
        res.status(200).json(post);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getPost = async (req, res) => {
    try {
        const { _id } = req.params;
        const post = await Post.find({ _id });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        
        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, picturePath, tags } = req.body;

        const updatedFields = {};
        if (description) updatedFields.description = description;
        if (picturePath) updatedFields.picturePath = picturePath;
        if (tags) updatedFields.tags = JSON.parse(tags);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/*COMMENT*/
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, commentText } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Add the comment to the post
        post.comments.push({ userId, commentText });

        // Save the updated post
        await post.save();

        return res.json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

