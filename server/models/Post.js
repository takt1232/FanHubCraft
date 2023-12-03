import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: String,
    picturePath: String,
    comments: {
      type: [
        {
          userId: {
            type: String,
            required: true,
          },
          commentText: String,
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
