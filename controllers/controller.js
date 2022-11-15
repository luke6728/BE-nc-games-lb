const categories = require('../db/data/test-data/categories.js');
const {selectCategories} = require('../models/model.js')


exports.getCategories = (req, res) => {
    selectCategories().then((categoriesArr) => {
      res.send({ categoriesArr });
    })
    .catch((err) => {
        next(err)
    });
  };