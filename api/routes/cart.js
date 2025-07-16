const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Cart created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to create cart
 *   get:
 *     summary: Get all carts (admin only)
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of carts
 *       500:
 *         description: Server error
 *
 * /api/carts/{id}:
 *   put:
 *     summary: Update a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cart updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to update cart
 *   delete:
 *     summary: Delete a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to delete cart
 *
 * /api/carts/find/{userId}:
 *   get:
 *     summary: Get a user's cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart data
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */

// CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Failed to create cart." });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found." });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Failed to update cart." });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) {
      return res.status(404).json({ error: "Cart not found." });
    }
    res.status(200).json({ message: "Cart has been deleted." });
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Failed to delete cart." });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(err);
  }
});

// // GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
