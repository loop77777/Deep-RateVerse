const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const authCtrl = require("../controllers/authController");
const storeCtrl = require("../controllers/storeController");
const adminCtrl = require("../controllers/adminController");

// Auth
router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);

// User routes
router.get("/stores", auth, storeCtrl.getStores);
router.post("/rate", auth, storeCtrl.rateStore);

// Admin routes
router.get("/admin/dashboard", auth, role(["admin"]), adminCtrl.dashboard);

module.exports = router;