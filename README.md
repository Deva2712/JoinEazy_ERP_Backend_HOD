# Joineazy ERP — HOD Backend

RESTful API backend specifically for **HOD (Head of Department)** role in the Joineazy ERP platform, built with the **PERN stack** (PostgreSQL, Express, React, Node.js).

---

## 🎯 Purpose

This backend is designed exclusively for **HOD users** who need department-wide oversight and management capabilities. It provides APIs for:
- Department overview & analytics
- Faculty management
- Student performance tracking
- Course management
- Placement tracking
- Research project oversight
- Approval workflows
- Reports generation

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Runtime** | Node.js | 20+ |
| **Language** | JavaScript (ES Modules) | `"type": "module"` |
| **Framework** | Express.js | ^4.21 |
| **Database** | PostgreSQL | 16 (via Docker) |
| **ORM** | Sequelize | ^6.37 |
| **Authentication** | JWT (jsonwebtoken) | ^9.0 |
| **Password Hashing** | bcryptjs | ^2.4 |
| **File Storage** | AWS S3 (@aws-sdk/client-s3) | ^3.600 |
| **Email** | Nodemailer | ^6.9 |
| **Logging** | Winston | ^3.13 |
| **Dev Tools** | Nodemon | ^3.1 |
| **Deployment** | Docker + Docker Compose | — |

---

## 📁 Project Structure

```
joineazy-backend-hod/
├── src/
│   ├── app.js                          # Express app, routes, middleware
│   ├── config/
│   │   ├── s3.js                       # AWS S3 client
│   │   └── mailer.js                   # Nodemailer transporter
│   ├── database/
│   │   └── connection.js               # Sequelize instance
│   ├── middleware/
│   │   ├── auth.middleware.js          # JWT protect() + authorize()
│   │   ├── error.middleware.js         # Central error handler
│   │   └── logger.middleware.js        # Request logging
│   ├── utils/
│   │   └── logger.js                   # Winston logger
│   └── modules/                        # HOD-specific modules
│       ├── auth/                       # Authentication (login, JWT)
│       ├── user/                       # User profile management
│       ├── dashboard/                  # HOD dashboard stats
│       ├── department/                 # Department CRUD
│       ├── department-overview/        # Department-wide analytics
│       │   ├── cohort-distribution     # Batch/cohort statistics
│       │   ├── faculty-attendance      # Faculty attendance tracking
│       │   ├── placement-analytics     # Placement statistics
│       │   └── research-analytics      # Research project stats
│       ├── department-courses/         # Course management
│       │   ├── course-list             # All department courses
│       │   ├── course-details          # Detailed course info
│       │   └── course-documents        # Course materials
│       ├── department-faculty/         # Faculty management
│       │   ├── faculty-list            # All faculty members
│       │   ├── faculty-details         # Faculty profile + performance
│       │   └── faculty-workload        # Teaching load tracking
│       ├── department-students/        # Student management
│       │   ├── student-list            # All students by batch
│       │   ├── student-details         # Student profile + academics
│       │   └── student-performance     # Performance analytics
│       ├── department-placements/      # Placement tracking
│       │   ├── company-records         # Companies visiting
│       │   ├── placement-records       # Student placements
│       │   ├── batch-stats             # Batch-wise placement %
│       │   └── job-openings            # Current opportunities
│       ├── department-research/        # Research oversight
│       │   ├── grant-requests          # Research funding requests
│       │   ├── popular-research        # Trending projects
│       │   ├── monthly-expense         # Research budget tracking
│       │   └── allocation-breakdown    # Fund allocation
│       ├── analytics/                  # Department analytics engine
│       │   ├── performance-trends      # Historical performance
│       │   ├── comparison-analysis     # Department comparisons
│       │   └── predictive-insights     # Forecast models
│       ├── reports/                    # Report generation
│       │   ├── faculty-reports         # Faculty performance PDFs
│       │   ├── student-reports         # Student progress reports
│       │   ├── placement-reports       # Placement analytics reports
│       │   └── research-reports        # Research output reports
│       ├── approvals/                  # Approval workflows
│       │   ├── leave-approvals         # Faculty leave requests
│       │   ├── finance-approvals       # Budget approvals
│       │   ├── research-approvals      # Grant approvals
│       │   └── course-approvals        # Course change approvals
│       └── notifications/              # Notification system
├── logs/                               # Winston log files
├── index.js                            # Entry point
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env                                # Environment variables
├── .gitignore
└── README.md
```

### **Module Anatomy** (MVC Pattern)

Each module follows the same 4-file structure:

```
{module}/
├── {module}-model.js       # Sequelize table definition
├── {module}-service.js     # Business logic (queries, calculations)
├── {module}-controller.js  # Request/response handling
└── {module}-routes.js      # API endpoint definitions
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Docker** & **Docker Compose** installed
- **Node.js 20+** (if running without Docker)
- **Git**

### **1. Clone/Navigate to the Repository**
```bash
cd joineazy-backend-hod
```

### **2. Environment Configuration**

The `.env` file is already configured for local development:

**Key settings:**
- `PORT=6000` — HOD Backend listens on port 6000 (separate from professor backend on 5000)
- `DATABASE_HOST=postgres` — Docker PostgreSQL service
- `DATABASE_NAME=joineazy_hod_dev` — Separate database for HOD data
- `JWT_SECRET=joineazy_hod_dev_secret_key_2026` — JWT signing key (dev only)

**No changes needed for local dev.**

### **3. Run with Docker Compose**

Docker Compose will start **2 containers**:
1. **PostgreSQL** (port 5433 on host) — dedicated HOD database
2. **HOD Backend API** (port 6000)

```bash
docker-compose up --build
```

**What happens:**
- PostgreSQL container starts and creates `joineazy_hod_dev` database
- Backend builds, installs dependencies, starts with `nodemon`
- Backend connects to PostgreSQL and syncs all HOD models
- API is live at `http://10.70.23.112:6000` and `http://localhost:6000`

**Check the logs:**
```bash
docker-compose logs -f backend
```

Expected output:
```
✅ PostgreSQL connected
Database synced
HOD Backend running on port 6000 in development mode
```

### **4. Test the API**

**Health check:**
```bash
curl http://10.70.23.112:6000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "service": "HOD Backend",
  "timestamp": "2026-05-11T..."
}
```

---

## 🌐 Running on Your Network (IPv4)

The HOD backend is configured to bind to **10.70.23.112:6000**.

### **Access from Your Machine (10.70.23.112)**
```bash
curl http://10.70.23.112:6000/health
```

### **Access from Intern's Machine (192.168.1.122)**
```bash
curl http://10.70.23.112:6000/health
```

### **CORS Configuration**
Pre-configured to allow requests from:
- `http://localhost:3000` — Local frontend
- `http://10.70.23.112:3000` — Your machine's frontend
- `http://192.168.1.122:3000` — Intern's frontend

---

## 🔧 Development Workflow

### **Without Docker**

1. Install PostgreSQL locally or connect to remote instance
2. Update `.env` with database credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in dev mode:
   ```bash
   npm run dev
   ```

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run start` | Start with `node` (production) |
| `npm run dev` | Start with `nodemon` (auto-restart) |

### **Hot Reload**
Nodemon watches all `.js` files — save any file and the server restarts automatically.

---

## 📦 API Endpoints

### **Authentication**
```
POST   /api/v1/auth/register            # Register HOD user
POST   /api/v1/auth/login               # Login and get JWT
```

### **Dashboard**
```
GET    /api/v1/dashboard                # HOD dashboard overview
GET    /api/v1/dashboard/stats          # Department statistics
```

### **Department Overview**
```
GET    /api/v1/department/overview                      # Overall department metrics
GET    /api/v1/department/overview/cohort-distribution  # Batch statistics
GET    /api/v1/department/overview/faculty-attendance   # Faculty attendance
GET    /api/v1/department/overview/placements           # Placement analytics
GET    /api/v1/department/overview/research             # Research statistics
```

### **Department Courses**
```
GET    /api/v1/department/courses                 # All department courses
GET    /api/v1/department/courses/:id             # Course details
GET    /api/v1/department/courses/:id/documents   # Course materials
PUT    /api/v1/department/courses/:id             # Update course
```

### **Department Faculty**
```
GET    /api/v1/department/faculty                 # All faculty members
GET    /api/v1/department/faculty/:id             # Faculty details
GET    /api/v1/department/faculty/:id/workload    # Teaching load
GET    /api/v1/department/faculty/:id/performance # Performance metrics
```

### **Department Students**
```
GET    /api/v1/department/students                   # All students
GET    /api/v1/department/students/batch/:year       # Students by batch
GET    /api/v1/department/students/:id               # Student details
GET    /api/v1/department/students/:id/performance   # Academic performance
```

### **Department Placements**
```
GET    /api/v1/department/placements                  # All placement records
GET    /api/v1/department/placements/companies        # Company list
GET    /api/v1/department/placements/companies/:id    # Company details
GET    /api/v1/department/placements/batch-stats      # Batch-wise stats
POST   /api/v1/department/placements/job-openings     # Create job opening
```

### **Department Research**
```
GET    /api/v1/department/research                    # All research projects
GET    /api/v1/department/research/grant-requests     # Grant requests
GET    /api/v1/department/research/expenses           # Budget tracking
GET    /api/v1/department/research/allocation         # Fund allocation
PUT    /api/v1/department/research/grant-requests/:id # Approve/reject grant
```

### **Analytics**
```
GET    /api/v1/analytics/performance-trends           # Historical trends
GET    /api/v1/analytics/comparison                   # Inter-department comparison
GET    /api/v1/analytics/predictions                  # Predictive insights
```

### **Reports**
```
GET    /api/v1/reports/faculty                        # Faculty reports
GET    /api/v1/reports/students                       # Student reports
GET    /api/v1/reports/placements                     # Placement reports
GET    /api/v1/reports/research                       # Research reports
POST   /api/v1/reports/generate                       # Generate custom report
```

### **Approvals**
```
GET    /api/v1/approvals                              # All pending approvals
GET    /api/v1/approvals/leave                        # Leave requests
GET    /api/v1/approvals/finance                      # Finance requests
GET    /api/v1/approvals/research                     # Research grants
PUT    /api/v1/approvals/:type/:id                    # Approve/reject
```

---

## 🔐 Authentication & Authorization

### **JWT Flow**
1. HOD logs in → backend returns JWT token
2. Frontend stores token
3. Every request includes: `Authorization: Bearer <token>`
4. Middleware `protect()` verifies token
5. Middleware `authorize("hod", "admin")` checks role

### **Role Restrictions**
All HOD backend endpoints require:
```javascript
router.get("/endpoint", protect, authorize("hod", "admin"), handler);
```

**Allowed Roles:**
- `hod` — Head of Department
- `admin` — System Administrator

---

## 🗄️ Database

### **Schema Management**
- **Development:** Sequelize auto-syncs models
- **Production:** Use migrations

### **Accessing the Database**

**Via Docker:**
```bash
docker exec -it joineazy_backend_hod-postgres-1 psql -U joineazy_hod_user -d joineazy_hod_dev
```

**Via pgAdmin:**
- Host: `10.70.23.112`
- Port: `5433` (note: different from professor backend's 5432)
- Database: `joineazy_hod_dev`
- User: `joineazy_hod_user`
- Password: `joineazy_hod_pass`

---

## 📧 Email & AWS Configuration

Same as professor backend — see `.env` file for SMTP and S3 settings.

---

## 📝 Logging

Winston logs to console + files (`logs/combined.log`, `logs/error.log`).

```javascript
import logger from "./utils/logger.js";

logger.info("HOD accessed department analytics");
logger.error("Failed to generate report", { error });
```

---

## 🐛 Troubleshooting

**"Port 6000 already in use"**
- Change `PORT=6000` in `.env` to another port

**"Cannot connect to database"**
- Ensure PostgreSQL container is running: `docker ps`
- Check `DATABASE_HOST=postgres` in `.env`

**"All env vars are blank"**
- Ensure `.env` file exists
- Rebuild: `docker-compose down && docker-compose up --build`

---

## 🔄 Professor Backend vs HOD Backend

| Feature | Professor Backend | HOD Backend |
|---------|-------------------|-------------|
| **Port** | 5000 | 6000 |
| **Database** | `joineazy_dev` (5432) | `joineazy_hod_dev` (5433) |
| **Scope** | Cohort-level (teaching) | Department-level (management) |
| **Key Modules** | Cohorts, Assignments, Attendance | Department analytics, Faculty, Placements |
| **Users** | Professors, Students | HOD, Admin |


---

## 📄 License

Private — Joineazy ERP Platform
