export const ensureTenantIsolation = (req, res, next) => {
  if (!req.tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Tenant context required.'
    });
  }

  // Add tenant filter to query
  req.tenantFilter = { tenantId: req.tenantId };
  
  next();
};

export const validateTenantAccess = (req, res, next) => {
  const requestedTenantSlug = req.params.slug;
  
  if (requestedTenantSlug && req.tenant.slug !== requestedTenantSlug) {
    return res.status(403).json({
      success: false,
      message: 'Access denied to this tenant.'
    });
  }
  
  next();
};
