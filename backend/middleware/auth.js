import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId)
      .populate('tenantId')
      .select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid or inactive user.' });
    }

    req.user = user;
    req.tenantId = user.tenantId._id;
    req.tenant = user.tenantId;

    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};
