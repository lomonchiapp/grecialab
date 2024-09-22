export const hasRequiredRole = (userRole, allowedRoles) => {
    return allowedRoles.includes(userRole);
  };