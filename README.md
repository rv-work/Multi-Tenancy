# Multi-Tenant SaaS Notes Application

A production-ready MERN stack multi-tenant SaaS application with role-based access control, subscription management, and secure tenant isolation.

## 🏗️ Architecture

**Multi-Tenancy Strategy**: Shared Database with Tenant ID

- Single MongoDB database with `tenantId` field in every document
- Cost-effective single database approach
- Middleware-enforced tenant isolation
- Scalable and maintainable single codebase

```javascript
// Tenant isolation example
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tenantId: { type: ObjectId, ref: "Tenant", required: true },
  createdBy: { type: ObjectId, ref: "User", required: true },
});

// Middleware ensures tenant isolation
app.use((req, res, next) => {
  req.tenantFilter = { tenantId: req.user.tenantId };
});
```

## ✨ Features

- ✅ **Multi-Tenant Architecture** - Strict data isolation between tenants
- ✅ **JWT Authentication** - Secure login with HTTP-only cookies
- ✅ **Role-Based Access Control** - Admin and Member roles with different permissions
- ✅ **Subscription Management** - Free (3 notes max) and Pro (unlimited) plans
- ✅ **Notes CRUD Operations** - Full create, read, update, delete functionality
- ✅ **Production Deployment** - Hosted on Vercel

## 🛠️ Tech Stack

| Layer          | Technologies                                      |
| -------------- | ------------------------------------------------- |
| **Backend**    | Node.js, Express.js, MongoDB, JWT, bcryptjs       |
| **Frontend**   | React, Vite, Tailwind CSS, Axios, React Hot Toast |
| **Deployment** | Vercel (Frontend + Backend)                       |

## 🔐 Test Accounts

| Email               | Password   | Role   | Tenant |
| ------------------- | ---------- | ------ | ------ |
| `admin@acme.test`   | `password` | Admin  | Acme   |
| `user@acme.test`    | `password` | Member | Acme   |
| `admin@globex.test` | `password` | Admin  | Globex |
| `user@globex.test`  | `password` | Member | Globex |

## 🚀 API Endpoints

| Method   | Endpoint                     | Description                             | Auth Required |
| -------- | ---------------------------- | --------------------------------------- | ------------- |
| `GET`    | `/health`                    | Health check                            | No            |
| `POST`   | `/api/auth/login`            | User authentication                     | No            |
| `GET`    | `/api/notes`                 | List tenant notes                       | Yes           |
| `POST`   | `/api/notes`                 | Create note (subscription limits apply) | Yes           |
| `DELETE` | `/api/notes/:id`             | Delete specific note                    | Yes           |
| `POST`   | `/api/tenants/:slug/upgrade` | Upgrade to Pro plan                     | Admin only    |

## 🌐 Live Demo

- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.vercel.app

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
# Configure environment variables (see below)
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
# Set VITE_API_URL environment variable
npm run dev
```

## ⚙️ Environment Variables

### Backend (.env)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

## 🔒 Security Features

- **Tenant Isolation**: Middleware-level enforcement prevents cross-tenant data access
- **Secure Authentication**: JWT tokens stored in HTTP-only cookies
- **Role-Based Authorization**: Endpoint protection based on user roles
- **Input Validation**: Request sanitization and validation
- **CORS Protection**: Configured for production deployment

## 👥 User Roles & Permissions

### Admin

- Create, read, update, delete notes
- Invite new users to tenant
- Upgrade tenant subscription plan
- Manage tenant settings

### Member

- Create, read, update, delete notes
- View tenant subscription status
- Limited by subscription plan constraints

## 💳 Subscription Plans

| Plan     | Notes Limit | Price    | Features                           |
| -------- | ----------- | -------- | ---------------------------------- |
| **Free** | 3 notes     | $0/month | Basic note management              |
| **Pro**  | Unlimited   | $9/month | Unlimited notes + priority support |

## 🏢 Multi-Tenant Examples

The application includes two pre-configured tenants for testing:

1. **Acme Corporation** (`/acme`)

   - Separate user base and data
   - Independent subscription management

2. **Globex Industries** (`/globex`)
   - Completely isolated from Acme
   - Own set of users and notes

## 🚀 Deployment

Both frontend and backend are deployed on Vercel with proper environment configuration and CORS settings for production use.

---

**Built with ❤️ using the MERN stack**
