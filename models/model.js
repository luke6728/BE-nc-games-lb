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

exports.selectCommentsByReviewId = (review_id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments for this review id",
        });
      }
      return results.rows;
    });
};
