const Router = require("express");
const router = new Router();
const multer = require("multer");
const upload = multer();

// controllers
const { orderController } = require("../controllers/order.controller");

router.get("/order", orderController.viewOrder);
router.post("/order/:id", upload.array(), orderController.createOrder);

module.exports = router;
