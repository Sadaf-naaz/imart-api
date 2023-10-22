const router = require("express").Router();
const dotenv=require("dotenv")
const stripe=require("stripe")("sk_test_51NeeiCSJD5OQhXy04aevbJHHHxpqHhUKH0ECuF5ignOfUioamAaXVJApAKKGpln0PKeC1MJeVXaitB7nQXgdWlOI00f6dkm42t")

router.post("/payment", async(req, res) => {
  const {products}= req.body;

  const lineItems= products.map((product)=>({
    price_data:{
      currency:"inr",
      product_data:{
        name:product.title
      },
      unit_amount:product.price*100,
    },
    quantity:product.quantity
  }));

  const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineItems,
      mode:"payment",
      success_url:'https://imart-api.onrender.com/success',
      cancel_url:"https://imart-api.onrender.com/cancel",

  });

  res.json({id:session.id});
});

module.exports = router;
