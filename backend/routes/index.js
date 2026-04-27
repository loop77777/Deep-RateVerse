const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const ownerController = require('../controllers/ownerController');

// ===== AUTH ROUTES =====
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// ===== STORE ROUTES (Public) =====
router.get('/store/all', authMiddleware, storeController.getAllStores);
router.get('/store/search', authMiddleware, storeController.searchStores);
router.get('/store/:id', authMiddleware, storeController.getStoreById);

// ===== RATING ROUTES =====
router.post('/rating/submit', authMiddleware, userController.submitRating);
router.put('/rating/:ratingId', authMiddleware, userController.updateRating);
router.get('/rating/user/:storeId', authMiddleware, userController.getUserRating);

// ===== USER ROUTES =====
router.put('/user/password', authMiddleware, userController.updatePassword);
router.get('/user/profile', authMiddleware, userController.getProfile);

// ===== ADMIN ROUTES =====
router.post('/admin/store/create', authMiddleware, roleMiddleware(['admin']), adminController.createStore);
router.post('/admin/user/create', authMiddleware, roleMiddleware(['admin']), adminController.createUser);
router.get('/admin/dashboard', authMiddleware, roleMiddleware(['admin']), adminController.getDashboard);
router.get('/admin/users', authMiddleware, roleMiddleware(['admin']), adminController.getAllUsers);
router.get('/admin/users/search', authMiddleware, roleMiddleware(['admin']), adminController.searchUsers);
router.delete('/admin/user/:id', authMiddleware, roleMiddleware(['admin']), adminController.deleteUser);
router.put('/admin/user/:id', authMiddleware, roleMiddleware(['admin']), adminController.updateUser);

// ===== OWNER ROUTES =====
router.get('/owner/dashboard', authMiddleware, roleMiddleware(['owner']), ownerController.getDashboard);
router.get('/owner/ratings', authMiddleware, roleMiddleware(['owner']), ownerController.getStoreRatings);

module.exports = router;