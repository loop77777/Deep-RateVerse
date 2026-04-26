/**
 * Central Route File with Enhanced Error Handling
 */

const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// -------- SAFE CONTROLLER LOADING --------
let authCtrl, storeCtrl, ownerCtrl, adminCtrl, userCtrl;

try {
    authCtrl = require("../controllers/authController");
    console.log("authController loaded");
} catch (err) {
    console.error("authController ERROR:", err.message);
}

try {
    storeCtrl = require("../controllers/storeController");
    console.log("storeController loaded");
} catch (err) {
    console.error("storeController ERROR:", err.message);
}

try {
    ownerCtrl = require("../controllers/ownerController");
    console.log("ownerController loaded");
} catch (err) {
    console.error("ownerController ERROR:", err.message);
}

try {
    adminCtrl = require("../controllers/adminController");
    console.log("adminController loaded");
} catch (err) {
    console.error("adminController ERROR:", err.message);
}

try {
    userCtrl = require("../controllers/userController");
    console.log("userController loaded");
} catch (err) {
    console.error("userController ERROR:", err.message);
}

// -------- DEBUG: Verify all exports --------
console.log("\nChecking Exports:");
console.log("authCtrl.signup:", typeof authCtrl?.signup, authCtrl?.signup ? "OK" : "MISSING");
console.log("authCtrl.login:", typeof authCtrl?.login, authCtrl?.login ? "OK" : "MISSING");
console.log("storeCtrl.getStores:", typeof storeCtrl?.getStores, storeCtrl?.getStores ? "OK" : "MISSING");
console.log("storeCtrl.rateStore:", typeof storeCtrl?.rateStore, storeCtrl?.rateStore ? "OK" : "MISSING");
console.log("adminCtrl.addUser:", typeof adminCtrl?.addUser, adminCtrl?.addUser ? "OK" : "MISSING");
console.log("adminCtrl.addStore:", typeof adminCtrl?.addStore, adminCtrl?.addStore ? "OK" : "MISSING");
console.log("adminCtrl.getUsers:", typeof adminCtrl?.getUsers, adminCtrl?.getUsers ? "OK" : "MISSING");
console.log("adminCtrl.getStores:", typeof adminCtrl?.getStores, adminCtrl?.getStores ? "OK" : "MISSING");
console.log("adminCtrl.dashboard:", typeof adminCtrl?.dashboard, adminCtrl?.dashboard ? "OK" : "MISSING");
console.log("ownerCtrl.dashboard:", typeof ownerCtrl?.dashboard, ownerCtrl?.dashboard ? "OK" : "MISSING");
console.log("userCtrl.updatePassword:", typeof userCtrl?.updatePassword, userCtrl?.updatePassword ? "OK" : "MISSING");
console.log();

// -------- AUTH ROUTES --------
router.post("/auth/signup", authCtrl?.signup || ((req, res) =>
    res.status(500).json({ success: false, msg: "signup controller missing" })
));

router.post("/auth/login", authCtrl?.login || ((req, res) =>
    res.status(500).json({ success: false, msg: "login controller missing" })
));

// -------- USER ROUTES --------
router.get("/stores", auth, storeCtrl?.getStores || ((req, res) =>
    res.status(500).json({ success: false, msg: "getStores controller missing" })
));

router.post("/stores/rate", auth, storeCtrl?.rateStore || ((req, res) =>
    res.status(500).json({ success: false, msg: "rateStore controller missing" })
));

router.put("/user/password", auth, userCtrl?.updatePassword || ((req, res) =>
    res.status(500).json({ success: false, msg: "updatePassword controller missing" })
));

// -------- ADMIN ROUTES --------
router.post("/admin/user", auth, role(["admin"]), adminCtrl?.addUser || ((req, res) =>
    res.status(500).json({ success: false, msg: "addUser controller missing" })
));

router.post("/admin/store", auth, role(["admin"]), adminCtrl?.addStore || ((req, res) =>
    res.status(500).json({ success: false, msg: "addStore controller missing" })
));

router.get("/admin/users", auth, role(["admin"]), adminCtrl?.getUsers || ((req, res) =>
    res.status(500).json({ success: false, msg: "getUsers controller missing" })
));

router.get("/admin/stores", auth, role(["admin"]), adminCtrl?.getStores || ((req, res) =>
    res.status(500).json({ success: false, msg: "getStores controller missing" })
));

router.get("/admin/dashboard", auth, role(["admin"]), adminCtrl?.dashboard || ((req, res) =>
    res.status(500).json({ success: false, msg: "dashboard controller missing" })
));

// -------- OWNER ROUTES --------
router.get("/owner/dashboard", auth, role(["owner"]), ownerCtrl?.dashboard || ((req, res) =>
    res.status(500).json({ success: false, msg: "owner dashboard controller missing" })
));

module.exports = router;