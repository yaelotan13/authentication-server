const postModel = require('../models/post-model');

const postContentIsValid = post => post.title && post.content;

async function addNewPost(post, image, userId) {
  if (!postContentIsValid(post) || !userId) {
    return { clientError : 'new Post must have a title, body and userId provided' }
  }

  if (!image) {
    image = 'http://127.0.0.1:3333/bike.jpg';
  }

  const postId = await postModel.addNewPost(post, image, userId);
  return { postId };
}

async function getAllPostsByID(userId) {
  return await postModel.getAllPostsByID(userId);
}

async function getPostByPostId(userId, postId) {
  return await postModel.getPostByPostId(userId, postId);
}

async function updatePost(userId, postId, updatedPost, image) {
  if (!postContentIsValid(updatedPost)) {
    return { clientError : 'updated Post must have a title and a body provided' }
  }

  if (!image) {
    await postModel.updatePostWithoutImage(userId, postId, updatedPost);
  } else {
    await postModel.updatePost(userId, postId, updatedPost, image);
  }
  
  return { updated: true };
}

async function deletePost(userId, postId) {
  const numOfRecordsDeleted = await postModel.deletePost(userId, postId);
  if (numOfRecordsDeleted === 0) {
    return { clientError : `postId ${userId} was not found`};
  }

  return { deleted : true };
}

module.exports = {
  addNewPost,
  getAllPostsByID,
  getPostByPostId,
  updatePost,
  deletePost,
};