const router = require("express").Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const authCtrl = require("../controllers/authController");
const storeCtrl = require("../controllers/storeController");
const adminCtrl = require("../controllers/adminController");
const ownerCtrl = require("../controllers/ownerController");

// Auth
router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);

// User
router.get("/stores", auth, storeCtrl.getStores);
router.post("/rate", auth, storeCtrl.rateStore);

// Admin
router.get("/admin/dashboard", auth, role(["admin"]), adminCtrl.dashboard);
router.post("/admin/add-user", auth, role(["admin"]), adminCtrl.addUser);
router.post("/admin/add-store", auth, role(["admin"]), adminCtrl.addStore);
router.get("/admin/users", auth, role(["admin"]), adminCtrl.getUsers);

// Owner
router.get("/owner/dashboard", auth, role(["owner"]), ownerCtrl.dashboard);

module.exports = router;