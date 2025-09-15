import Tenant from '../models/Tenant.js';

export const upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find and update tenant
    const tenant = await Tenant.findOneAndUpdate(
      { slug, _id: req.tenantId },
      { subscription: 'pro' },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found.'
      });
    }

    res.json({
      success: true,
      message: 'Tenant upgraded to Pro successfully.',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        subscription: tenant.subscription,
        maxNotes: tenant.settings.maxNotes
      }
    });

  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error upgrading tenant.'
    });
  }
};

export const getTenantInfo = async (req, res) => {
  try {
    res.json({
      success: true,
      tenant: {
        id: req.tenant._id,
        name: req.tenant.name,
        slug: req.tenant.slug,
        subscription: req.tenant.subscription,
        maxNotes: req.tenant.settings.maxNotes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching tenant info.'
    });
  }
};
