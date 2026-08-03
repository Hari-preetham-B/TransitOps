const ApiError = require("../utils/ApiError");

// Role-based permission matrix
// read: which roles can view a resource
// write: which roles can create/edit/delete a resource
const permissionMatrix = {
  vehicles: {
    read: ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"],
    write: ["Fleet Manager"],
  },
  drivers: {
    read: ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"],
    write: ["Fleet Manager", "Safety Officer"],
  },
  trips: {
    read: ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"],
    write: ["Fleet Manager", "Driver"],
  },
  maintenance: {
    read: ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"],
    write: ["Fleet Manager"],
  },
};

/**
 * Middleware to enforce role-based access control.
 * Usage: protect, authorize("vehicles", "write")
 */
const authorize = (resource, action = "read") => {
  return (req, res, next) => {
    const allowedRoles = permissionMatrix[resource]?.[action] || [];

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied: Your role (${req.user.role}) cannot ${action} ${resource}`,
      );
    }

    next();
  };
};

module.exports = {
  authorize,
  permissionMatrix,
};
