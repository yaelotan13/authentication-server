const db = require('../util/init-DB')();

async function addNewPost(post, image, userid) {
  console.log(`INSERT INTO posts (title, content, userid, imagepath) VALUES 
  ('${post.title}', '${post.content}', ${userid}, '${image}');`);
  try {
    await db.query(
      `INSERT INTO posts (title, content, userid, imagepath) VALUES 
                                                             ('${post.title}', '${post.content}', ${userid}, '${image}');`,
    );
    const result = await db.query('SELECT MAX(postid) FROM posts');
    return result.rows[0].max;
  } catch (e) {
    console.log('DB error occurred on insert new Post to DB');
    console.log(e);
  }
}

async function getAllPostsByID(userid) {
  try {
    const result = await db.query(`SELECT * FROM Posts WHERE userid=${userid} ORDER BY postid DESC;`);
    return result.rows;
  } catch (e) {
    console.log('DB error occurred on find all posts by ID');
  }
}

async function getPostByPostId(userid, postid) {
  try {
    const result = await db.query(`SELECT * FROM posts WHERE (userid=${userid}) AND postid=${postid};`);
    return result.rows[0];
  } catch (e) {
    console.log('DB error occurred on find Post by ID');
  }
}

async function updatePost(userid, postid, updatedPost, imagePath) {
  console.log(`UPDATE posts SET title='${updatedPost.title}', content='${updatedPost.content}', 
  imagepath='${imagePath}' WHERE (userid=${userid} AND postid=${postid});`)
  try {
    await db.query(`UPDATE posts SET title='${updatedPost.title}', content='${updatedPost.content}', 
                 imagepath='${imagePath}' WHERE (userid=${userid} AND postid=${postid});`);
  } catch (e) {
    console.log('DB error occurred on update Post');
  }
}

async function updatePostWithoutImage(userid, postid, updatedPost) {
  console.log(`UPDATE posts SET title='${updatedPost.title}', content='${updatedPost.content}'
  WHERE (userid=${userid} AND postid=${postid});`)
  try {
    await db.query(`UPDATE posts SET title='${updatedPost.title}', content='${updatedPost.content}' 
                 WHERE (userid=${userid} AND postid=${postid});`);
  } catch (e) {
    console.log('DB error occurred on update Post without image');
  }
}

async function deletePost(userid, postid) {
  try {
    const result = await db.query(`DELETE FROM posts WHERE (userid=${userid} AND postid=${postid});`);
    return result.rowCount;
  } catch (e) {
    console.log('DB error occurred on delete Post');
  }
}

module.exports = {
  addNewPost,
  getAllPostsByID,
  getPostByPostId,
  updatePost,
  deletePost,
  updatePostWithoutImage,
};