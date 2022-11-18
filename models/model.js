const db = require("../db/connection.js");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((results) => {
    return results.rows;
  });
};

exports.selectReviews = () => {
  return db.query(`SELECT * FROM reviews;`).then((results) => {
    return results.rows;
  });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "invalid review id",
        });
      }
      return results.rows[0];
    });
};

const checkReviewExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "invalid review id",
        });
      }
    });
};

exports.selectCommentsByReviewId = (review_id) => {
  return checkReviewExists(review_id).then(() => {
    return db
      .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
      .then((results) => {
        return results.rows;
      });
  });
};

const checkUsername = (newComment) => {
  const {author} = newComment
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [author])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "invalid username",
        });
      }
    });
};

exports.insertCommentByReviewId = (newComment) => {
  const { body, author, review_id } = newComment;
  return checkUsername(newComment).then(() => { 
  return checkReviewExists(review_id).then(() => {
    return db
      .query(
        `INSERT INTO comments (body, author, review_id)
    VALUES($1, $2, $3) RETURNING *;`,
        [body, author, review_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
})
};

exports.updateReviewById = (review_id, inc_votes) => {
  return checkReviewExists(review_id).then(() => {
  return db
    .query(
      `UPDATE reviews 
      SET votes = votes + $1 
      WHERE review_id = $2 RETURNING *`,
      [inc_votes, review_id]
    )
    .then((results) => {
      return results.rows[0];
    });
  })
};
