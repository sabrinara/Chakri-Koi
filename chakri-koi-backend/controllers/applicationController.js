// controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job (job seeker only)
// @route   POST /api/applications/:jobId
// @access  Private (user)
exports.applyToJob = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Prevent duplicate applications
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: 'You have already applied to this job' });
    }

    // Create application (resume can be a URL or filename)
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.body.resume, 
    });

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications for the logged‐in user (job seeker)
// @route   GET /api/applications/me
// @access  Private (user)
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id }).populate(
      'job',
      'title company location'
    );
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications for a specific job (employer only)
// @route   GET /api/applications/job/:jobId
// @access  Private (employer or admin)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Only employer who posted or admin can view
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view these applications' });
    }

    const apps = await Application.find({ job: req.params.jobId }).populate(
      'applicant',
      'name email resume'
    );
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status (e.g., shortlist/reject) (employer only)
// @route   PUT /api/applications/:id/status
// @access  Private (employer or admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    let app = await Application.findById(req.params.id).populate('job');
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only the employer who posted the job or admin can update status
    if (
      app.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this application' });
    }

    app.status = req.body.status || app.status;
    await app.save();
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
