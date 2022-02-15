const Router = require("express");
const router = new Router();

// controllers
const { productController } = require("../controllers/product.controller");

router.get("/catalog/:link", productController.getProducts);
router.get("/catalog/:link/:id", productController.getProduct);

module.exports = router;
