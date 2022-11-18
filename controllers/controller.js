const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewId,
  insertCommentByReviewId,
  updateReviewById,
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

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  if(req.body.author === undefined && req.body.body === undefined){
    res.status(400).send({ msg: "bad request" })
  }
  else{
  const newReview = {
    body: req.body.body,
    author: req.body.username,
    review_id: review_id,}
  insertCommentByReviewId(newReview)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });

}

exports.patchReviewById = (req, res, next) => {
  const {inc_votes} = req.body
  const {review_id} = req.params
  updateReviewById(review_id, inc_votes)
  .then((review) => {
    res.status(200).send({ review });
  })
  .catch((err) => {
    next(err);
  });
}