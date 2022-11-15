const express = require("express");
const {getCategories} = require('./controllers/controller.js')

const app = express();


app.get("/api/categories", getCategories);

module.exports = app;