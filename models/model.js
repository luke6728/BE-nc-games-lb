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

exports.insertCommentByReviewId = (newComment) => {
  const { body, votes, author, review_id, created_at } = newComment;
  return checkReviewExists(review_id).then(() => {
    return db
      .query(
        `INSERT INTO comments (body, votes, author, review_id, created_at)
    VALUES($1, $2, $3, $4, $5) RETURNING *;`,
        [body, votes, author, review_id, created_at]
      )
      .then((result) => {
        return result.rows[0];
      });
  });
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
