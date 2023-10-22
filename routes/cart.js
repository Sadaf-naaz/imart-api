const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// note here id stands for user id and not cart id

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
//   try {
//     const updatedCart = await Cart.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedCart);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
//UPDATE after adding product
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.updateOne(
      {userId:req.params.id},
      {
        $push:{
          products:req.body
        }
      },
      { new: true }
      
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//UPDATE after removing product
router.put("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const indexToDelete = req.body.index;
    const cart = await Cart.findOne({ userId: req.params.id });
 
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (indexToDelete >= 0 && indexToDelete < cart.products.length) {
      // Check if the index is within the valid range
      cart.products.splice(indexToDelete, 1);
      await cart.save();
      res.status(200).json({ message: `Deleted object at index ${indexToDelete}` });
    } else {
      res.status(400).json({ message: "Invalid index" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userId = req.params.id;

    // Use the findOneAndRemove method to delete the cart by userId
    const deletedCart = await Cart.findOneAndRemove({ userId });

    if (!deletedCart) {
      // Handle the case where the cart with the specified userId is not found
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


//GET USER CART
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;