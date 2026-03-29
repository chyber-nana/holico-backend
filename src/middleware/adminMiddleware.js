const adminMiddleware = (req, res, next) => {
  if (!req.admin || !req.admin.adminId) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

module.exports = adminMiddleware;