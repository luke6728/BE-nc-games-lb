const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db
      .query(
        `SELECT * FROM categories;`
      )
      .then((results) => {
        return results.rows;
      });
  };
  