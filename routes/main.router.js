const Router = require("express");
const router = new Router();
const multer = require("multer");
const upload = multer();

// controllers
const { mainController } = require("../controllers/main.controller");

router.get("/", mainController.mainPage);
router.get("/about", mainController.aboutPage);
router.get("/contacts", mainController.contactsPage);

router.post("/login", upload.array(), mainController.login);
router.get("/login", mainController.loginPage);
router.get("/logout", mainController.logout);
router.get("/profile", mainController.profile);

module.exports = router;
