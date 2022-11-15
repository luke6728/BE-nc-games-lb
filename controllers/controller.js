const categories = require('../db/data/test-data/categories.js');
const {selectCategories} = require('../models/model.js')


exports.getCategories = (req, res) => {
    selectCategories().then((Categories) => {
      res.send({ Categories });
    })
    .catch((err) => {
        next(err)
    });
  };