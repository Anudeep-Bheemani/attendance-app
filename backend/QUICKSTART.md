# 🚀 Quick Start Guide

## Step 1: Install PostgreSQL

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password for `postgres` user
4. Remember the password!

### Mac:
```bash
brew install postgresql
brew services start postgresql
```

### Linux:
```bash
sudo apt-get install postgresql
sudo service postgresql start
```

## Step 2: Create Database

Open terminal/command prompt:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE smartattd;

# Exit
\q
```

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Update .env File

The `.env` file is already created with your credentials!

Just update the DATABASE_URL password if needed:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartattd
```

## Step 5: Seed Database

```bash
node src/config/seed.js
```

You should see:
```
✅ Admin created
✅ Lecturer created
✅ Students and attendance created
🎉 Database seeded successfully!
```

## Step 6: Start Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ Database synced
🚀 Server running on port 5000
📡 API: http://localhost:5000/api
```

## Step 7: Test API

Open browser or Postman:
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "SmartAttd API is running"
}
```

## Step 8: Test Login

POST to `http://localhost:5000/api/auth/login`

Body:
```json
{
  "id": "admin@college.edu",
  "password": "admin123",
  "role": "admin"
}
```

You'll get a JWT token!

## 🎉 Done!

Your backend is now running!

## Next Steps:

1. Update your React frontend to use: `http://localhost:5000/api`
2. Test email sending
3. Test AI features
4. Deploy to Render

## Common Issues:

### "Database connection failed"
- Make sure PostgreSQL is running
- Check password in .env file

### "Port 5000 already in use"
- Change PORT in .env to 5001 or another port

### "Module not found"
- Run `npm install` again

## Need Help?

Check the full README.md for detailed documentation!
