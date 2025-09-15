import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true
    }).populate('tenantId');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.tenantId.isActive) {
      return res.status(403).json({ success: false, message: 'Tenant account is inactive.' });
    }

    // Generate JWT (return in response, no cookie)
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenantId._id,
          name: user.tenantId.name,
          slug: user.tenantId.slug,
          subscription: user.tenantId.subscription
        }
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const logout = (req, res) => {
  try {
    // Client side par token delete karna hoga, backend se kuch nahi
    res.json({ success: true, message: 'Logout successful.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        tenant: {
          id: req.tenant._id,
          name: req.tenant.name,
          slug: req.tenant.slug,
          subscription: req.tenant.subscription,
          maxNotes: req.tenant.settings.maxNotes
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password: 'password', // default
      role,
      tenantId: req.tenantId
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User invited successfully.',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ success: false, message: 'Server error during user invitation.' });
  }
};
