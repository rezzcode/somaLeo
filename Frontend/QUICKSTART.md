# CBC AI Tutor - Quick Start Guide

## Running the Application Locally

### Step 1: Install Node.js
Make sure you have Node.js version 16 or higher installed. You can download it from [nodejs.org](https://nodejs.org).

### Step 2: Install Dependencies
Open a terminal in the project folder and run:
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Open Your Browser
Navigate to: [http://localhost:5173](http://localhost:5173)

## Using the Application

### Switching Between Teacher and Student Views
1. Look at the sidebar on the left side
2. Find the toggle switch at the top (labeled "Teacher" / "Student")
3. Click to switch between interfaces

### Teacher View Features
- **Dashboard**: Overview of student performance
- **Student Profiles**: Manage student information
- **Lesson Plans**: Create and track lessons
- **AI Tutor Monitor**: View AI tutoring sessions

### Student View Features
- **My Learning**: Personalized dashboard
- **Ask AI Tutor**: Interactive AI assistant
- **Study Materials**: Access learning resources

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# On macOS/Linux:
kill -9 $(lsof -ti:5173)

# On Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

### Installation Issues
If npm install fails:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Building for Production
```bash
npm run build
npm run preview
```

## Need Help?
Check the browser console for any error messages or refer to the full README.md file.