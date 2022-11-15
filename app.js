const express = require("express");
const {getCategories} = require('./controllers/controller.js')

const app = express();


app.get("/api/categories", getCategories);

  // for 500's
  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'server error'})
  })

module.exports = app;