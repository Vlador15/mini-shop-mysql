const Router = require("express");
const router = new Router();
const multer = require("multer");
const upload = multer();

const { checkAdmin } = require("../modules/utils");

// controllers
const { adminController } = require("../controllers/admin.controller");

router.get("/orders", checkAdmin, adminController.orders);
router.get(
  "/orders/delete/:id",
  checkAdmin,
  upload.array(),
  adminController.deleteOrder
);

router.get("/create-product", checkAdmin, adminController.createProductPage);
router.post(
  "/create-product",
  checkAdmin,
  upload.array(),
  adminController.createProduct
);

router.get("/create-category", checkAdmin, adminController.createCategoryPage);
router.post(
  "/create-category",
  checkAdmin,
  upload.array(),
  adminController.createCategory
);

router.get("/category", checkAdmin, adminController.categoriesPage);
router.get("/product/:id", checkAdmin, adminController.products);
router.get(
  "/product/delete/:id",
  checkAdmin,
  upload.array(),
  adminController.deleteProduct
);

module.exports = router;
