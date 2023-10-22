const router =require("express").Router();
const Product = require("../models/Product");


router.get("/", async (req, res) => {
    const searchedField=req.query.searchQuery;
    try {
      const searchResult = await Product.find({
        categories:{
            $elemMatch:{
                $regex:searchedField,$options:'i'
            }
        }});
        
      res.status(200).json(searchResult);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports= router;