// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllJobsAdmin,
  deleteJobAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here are admin‐only
router.get('/users', protect, authorize('admin'), getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

router.get('/jobs', protect, authorize('admin'), getAllJobsAdmin);
router.delete('/jobs/:id', protect, authorize('admin'), deleteJobAdmin);

module.exports = router;
