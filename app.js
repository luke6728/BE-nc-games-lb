const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/controller.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

// for 404
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// for 400
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === '23502') {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

// for 500's
app.use((err, req, res, next) => {
  console.log(err); // <- for dev purposes
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
