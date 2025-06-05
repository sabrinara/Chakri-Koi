// middleware/roleMiddleware.js

// Check if logged‐in user has one of the allowed roles.
// Usage: .get(protect, authorize('admin','employer'), controllerFunction)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role (${req.user?.role}) not authorized` });
    }
    next();
  };
};

module.exports = { authorize };
