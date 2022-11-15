const { selectCategories, selectReviews } = require("../models/model.js");

exports.getCategories = (req, res) => {
  selectCategories()
    .then((categoriesArr) => {
      res.send({ categoriesArr });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.send({ reviews });
  });
};
