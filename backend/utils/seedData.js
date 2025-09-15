import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import connectDB from '../db/connectDB.js';

const seedData = async () => {
  try {

    
    const existingTenants = await Tenant.countDocuments();
    if (existingTenants > 0) return;

    console.log('Seeding initial data...');

    const acmeTenant = await Tenant.create({
      name: 'Acme Corporation',
      slug: 'acme',
      subscription: 'free'
    });

    const globexTenant = await Tenant.create({
      name: 'Globex Corporation',
      slug: 'globex',
      subscription: 'free'
    });

    const users = [
      {
        email: 'admin@acme.test',
        password: 'password',
        role: 'admin',
        tenantId: acmeTenant._id
      },
      {
        email: 'user@acme.test',
        password: 'password',
        role: 'member',
        tenantId: acmeTenant._id
      },
      {
        email: 'admin@globex.test',
        password: 'password',
        role: 'admin',
        tenantId: globexTenant._id
      },
      {
        email: 'user@globex.test',
        password: 'password',
        role: 'member',
        tenantId: globexTenant._id
      }
    ];

    for (const userData of users) {
      await User.create(userData);
    }

    console.log('Initial data seeded successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

connectDB()

seedData();
