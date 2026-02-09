# 🧪 API Testing Guide

## Using Postman or Thunder Client

### 1. Login as Admin

**POST** `http://localhost:5000/api/auth/login`

Body (JSON):
```json
{
  "id": "admin@college.edu",
  "password": "admin123",
  "role": "admin"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@college.edu",
    "role": "admin",
    "name": "System Administrator"
  }
}
```

**COPY THE TOKEN!**

### 2. Get All Students

**GET** `http://localhost:5000/api/students`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Send Student/Parent Reports

**POST** `http://localhost:5000/api/notifications/send-reports`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Response:
```json
{
  "message": "Reports sent successfully",
  "emailCount": 10,
  "students": 5
}
```

### 4. Send Lecturer Reminders

**POST** `http://localhost:5000/api/notifications/send-reminders`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Update Attendance

**POST** `http://localhost:5000/api/attendance/update`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Body (JSON):
```json
{
  "studentId": "student-uuid-here",
  "subject": "Data Structures",
  "totalHours": 40,
  "attendedHours": 35
}
```

### 6. Get AI Insight

**POST** `http://localhost:5000/api/analytics/ai-insight`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Body (JSON):
```json
{
  "prompt": "Analyze the attendance pattern and suggest improvements"
}
```

### 7. Get Class Analytics

**GET** `http://localhost:5000/api/analytics/class?branch=CSE&batch=2024-2028&subject=Data Structures`

Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Testing with cURL

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"admin@college.edu","password":"admin123","role":"admin"}'
```

### Get Students:
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send Reports:
```bash
curl -X POST http://localhost:5000/api/notifications/send-reports \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Checklist

- [ ] Admin login works
- [ ] Lecturer login works
- [ ] Student login works
- [ ] Get all students
- [ ] Get student attendance
- [ ] Update attendance
- [ ] Send student/parent reports
- [ ] Send lecturer reminders
- [ ] Get AI insights
- [ ] Get class analytics

## Expected Email Flow

When you click "Send Reports":
1. System fetches all students
2. For each student:
   - Sends attendance report to student email
   - Sends attendance report to parent email (if exists)
3. Emails appear in SendGrid dashboard
4. Check your email inbox!

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Login again to get new token

### 403 Forbidden
- User doesn't have permission
- Check role (admin/lecturer/student)

### 500 Internal Server Error
- Check server logs
- Verify database connection
- Check environment variables

## Production Testing

Replace `http://localhost:5000` with your Render URL:
```
https://smartattd-backend.onrender.com
```

All endpoints work the same way!
