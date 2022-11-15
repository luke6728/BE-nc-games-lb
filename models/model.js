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
