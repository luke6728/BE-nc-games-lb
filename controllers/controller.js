const {
  selectCategories,
  selectReviews,
  selectReviewById,
} = require("../models/model.js");

exports.getCategories = (req, res, next) => {
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

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
