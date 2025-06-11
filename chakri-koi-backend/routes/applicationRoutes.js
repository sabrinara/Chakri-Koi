// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Private (user) – apply & view own applications
router.post('/:jobId', protect, authorize('user'), applyToJob);
router.get('/me', protect, authorize('user'), getMyApplications);

// Private (employer/admin) – view applications for a job + update status
router.get(
  '/job/:jobId',
  protect,
  authorize('employer', 'admin'),
  getApplicationsForJob
);
router.put(
  '/:id/status',
  protect,
  authorize('employer', 'admin'),
  updateApplicationStatus
);

module.exports = router;
