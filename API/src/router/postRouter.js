import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  searchPost,
  updatePost,
} from "../models/postSchema.js";
import { authenticateJWT } from "../middleware/authenticate.js";

const router = express.Router();

// get all posts
router.get("/", async (req, res) => {
  try {
    let data = await getPosts();

    let postData = [...data];

    const respObj = {
      status: "success",
      message: "All Posts Fetched!",
      data: postData,
    };

    return res.status(200).send(respObj);
  } catch (err) {
    const errObj = {
      status: "error",
      message: "Error fetching",
      error: {
        code: 500,
        details: err.message || "Erro fetching post",
      },
    };

    return res.status(500).send(errObj);
  }
});

// create post
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const { user } = req;

    const postData = await createPost({
      title,
      content,
      image,
      author: user._id,
    });

    const respObj = {
      status: "success",
      message: "Post Created Successfully!",
    };

    return res.status(201).send(respObj);
  } catch (err) {
    const errObj = {
      status: "error",
      message: "Error creating",
      error: {
        code: 500,
        details: err.message || "Error creating post",
      },
    };

    return res.status(500).send(errObj);
  }
});

//post comment
router.post("/comment/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const { comment } = req.body;
    console.log(req.body);
    const postData = await getPostById(id);

    if (!postData) {
      return res.status(404).send({
        status: "error",
        message: "Post not found",
        error: {
          code: 404,
          details: "The post could not be found",
        },
      });
    }

    // // Ensure comments is an array
    // if (!Array.isArray(postData.Comments)) {
    //   postData.Comments = [];
    // }

    const newCommentObject = {
      comment: comment,
      userid: req.user._id,
    };
    console.log(newCommentObject);

    postData.Comments.push(newCommentObject);
    console.log(100000, postData.Comments);
    // Update the post with the new comment list
    const updatedData = await updatePost(id, { Comments: postData.Comments });
    console.log(updatedData);

    const respObj = {
      status: "success",
      message: "New comment added",
      data: updatedData,
    };

    return res.status(200).send(respObj);
  } catch (error) {
    const errObj = {
      status: "error",
      message: "Erro whihe commenting!",
      error: {
        code: 500,
        message: error.message || "Error commenting",
      },
    };
    return res.status(errObj.error.code).send(errObj);
  }
});

// get post by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postData = await getPostById(id);

    const respObj = {
      status: "success",
      message: "Successfully Fetched Post",
      data: postData,
    };

    return res.status(200).send(respObj);
  } catch (err) {
    const errObj = {
      status: "error",
      message: "Error fetching",
      error: {
        code: 500,
        details: err.message || "Error fetching post",
      },
    };

    return res.status(500).send(errObj);
  }
});

// delete post
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;

    const postData = await getPostById(id);

    if (!postData) {
      const errObj = {
        status: "error",
        message: "Not Found",
        error: {
          code: 400,
          details: "Post not found",
        },
      };

      return res.status(404).send(errObj);
    }

    if (postData.author._id.toString() !== user._id) {
      const errObj = {
        status: "error",
        message: "Unauthorized",
        error: {
          code: 403,
          details: "You are not authorized!",
        },
      };

      return res.status(403).send(errObj);
    }

    await deletePost(id);

    const respObj = {
      status: "success",
      message: "Post Deleted Successfully!",
    };

    return res.status(200).send(respObj);
  } catch (err) {
    console.log(err);
    const errObj = {
      status: "error",
      message: "Error Deleting",
      error: {
        code: 500,
        details: err.message || "Error Deleting post",
      },
    };

    return res.status(500).send(errObj);
  }
});

router.get("/search/:query", async (req, res) => {
  //query call
  const { query } = req.params;
  const postData = await searchPost({
    title: { $regex: new RegExp(query, "i") },
  });

  const respObj = {
    status: "success",
    message: "post found",
    data: postData,
  };

  return res.send(respObj);
});

router.patch("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const postData = req.body;
    const updatedData = await updatePost(id, postData);
    const respObj = {
      status: "success",
      message: "Post updated successfully",
    };

    return res.status(200).send(respObj);
  } catch (err) {
    console.log(err);
    const errObj = {
      status: "error",
      message: "Error updating",
      error: {
        code: 500,
        details: err.message || "Error updating post",
      },
    };

    return res.status(errObj.error.code).send(errObj);
  }
});

router.patch("/like/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const postData = await getPostById(id);

    let likedList = postData.likes;

    if (likedList.includes(req.user._id)) {
      likedList = likedList.filter((item) => item != req.user._id);
    } else {
      likedList.push(req.user._id);
    }

    const updatedData = await updatePost(id, { likes: likedList });

    console.log(updatedData);

    const respObj = {
      status: "success",
      message: "Post liked",
    };

    return res.status(200).send(respObj);
  } catch (err) {
    const errObj = {
      status: "error",
      message: "Erro liking post!",
      error: {
        code: 500,
        message: err.message || "Error liking post",
      },
    };
    return res.status(errObj.error.code).send(errObj);
  }
});

export default router;
