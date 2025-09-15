import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  subscription: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  settings: {
    maxNotes: {
      type: Number,
      default: 3
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

tenantSchema.pre('save', function(next) {
  if (this.isModified('subscription')) {
    if (this.subscription === 'pro') {
      this.settings.maxNotes = -1; 
    } else {
      this.settings.maxNotes = 3;
    }
  }
  next();
});

export default mongoose.model('Tenant', tenantSchema);
