# SmartAttd Backend API

Backend API for SmartAttd Attendance Management System built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- ✅ JWT Authentication & Authorization
- ✅ Role-based Access Control (Student, Parent, Lecturer, Admin)
- ✅ PostgreSQL Database with Sequelize ORM
- ✅ SendGrid Email Integration
- ✅ Google Gemini AI Integration
- ✅ RESTful API Design
- ✅ Security (Helmet, CORS, Rate Limiting)
- ✅ Automated Email Notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- SendGrid Account
- Google Gemini API Key

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

Install PostgreSQL and create a database:

```sql
CREATE DATABASE smartattd;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartattd
SENDGRID_API_KEY=your_sendgrid_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Seed Database

```bash
npm run seed
```

This will create:
- Admin account
- Sample lecturers
- Sample students
- Sample attendance data

### 5. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verify student account

### Students
- `GET /api/students` - Get all students (Admin/Lecturer)
- `GET /api/students/:id` - Get student by ID
- `GET /api/students/:id/attendance` - Get student attendance

### Attendance
- `POST /api/attendance/update` - Update attendance (Lecturer/Admin)
- `POST /api/attendance/bulk-update` - Bulk update (Lecturer/Admin)
- `GET /api/attendance/class` - Get class attendance (Lecturer/Admin)

### Notifications
- `POST /api/notifications/send-reports` - Send student/parent reports (Admin/Lecturer)
- `POST /api/notifications/send-reminders` - Send lecturer reminders (Admin)

### Analytics
- `POST /api/analytics/ai-insight` - Get AI insights (Lecturer/Admin)
- `GET /api/analytics/class` - Get class analytics (Lecturer/Admin)

## 🔐 Default Credentials

After seeding:

**Admin:**
- Email: `admin@college.edu`
- Password: `admin123`

**Lecturer:**
- Email: `alan@college.edu`
- Password: `pass`

**Student:**
- Roll No: `24CSE100`
- Password: `pass`

## 📧 Email Configuration

The system uses SendGrid for sending emails:

1. Create SendGrid account at https://sendgrid.com
2. Verify sender email
3. Create API key
4. Add to `.env` file

## 🤖 AI Integration

Uses Google Gemini AI for:
- Attendance predictions
- Class performance analysis
- Risk assessment
- Automated insights

## 🗄️ Database Schema

### Users
- id, email, password, role, rollNo, name, phone, isVerified

### Students
- id, userId, rollNo, name, email, phone, branch, batch, guardianName, guardianEmail

### Lecturers
- id, userId, name, email, phone, branch, subjects, assignedClass

### Attendance
- id, studentId, subject, totalHours, attendedHours, month, year

## 🚢 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

### Environment Variables for Production

```
NODE_ENV=production
DATABASE_URL=your_render_postgres_url
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=your_key
GEMINI_API_KEY=your_key
FRONTEND_URL=your_frontend_url
```

## 📝 API Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"admin@college.edu","password":"admin123","role":"admin"}'
```

### Get Students (with token)
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send Reports
```bash
curl -X POST http://localhost:5000/api/notifications/send-reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Helmet.js security headers
- CORS protection
- Rate limiting
- Input validation

## 📊 Monitoring

Check server health:
```bash
curl http://localhost:5000/api/health
```

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database exists

### Email Not Sending
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid dashboard

### AI Not Working
- Verify Gemini API key
- Check API quota limits
- Review error logs

## 📞 Support

For issues or questions:
- GitHub: https://github.com/Anudeep-Bheemani
- Email: bheemanianudeep@gmail.com

## 📄 License

MIT License - feel free to use for your projects!

---

Built with ❤️ by Anudeep Bheemani
