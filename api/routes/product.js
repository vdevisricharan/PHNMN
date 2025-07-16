const Product = require("../models/Product");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: new
 *         schema:
 *           type: boolean
 *         description: Get newest product
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       409:
 *         description: Product title already exists
 *       500:
 *         description: Failed to create product
 *
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product
 *
 * /api/products/find/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *       properties:
 *         title:
 *           type: string
 *         desc:
 *           type: string
 *         img:
 *           type: string
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *         size:
 *           type: string
 *         color:
 *           type: string
 *         price:
 *           type: number
 */

// CREATE
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    // Convert to plain object and stringify _id
    const productObj = savedProduct.toObject();
    productObj._id = productObj._id.toString();
    res.status(201).json(productObj);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message && error.message.includes("Duplicate product title")) {
      return res.status(409).json({ error: "Product title already exists." });
    }
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Failed to create product." });
    }
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    const productObj = updatedProduct.toObject();
    productObj._id = productObj._id.toString();
    res.status(200).json(productObj);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Failed to update product." });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product has been deleted." });
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Failed to delete product." });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    const productObj = product.toObject();
    productObj._id = productObj._id.toString();
    res.status(200).json(productObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    // Convert all _id fields to string
    const productsArr = products.map((p) => {
      const obj = p.toObject();
      obj._id = obj._id.toString();
      return obj;
    });
    res.status(200).json(productsArr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;