# 🔄 Guide for Updating TripTuner

This guide will help you update your TripTuner website in the future.

## 📋 Table of Contents
1. [Making Changes Locally](#making-changes-locally)
2. [Testing Changes](#testing-changes)
3. [Pushing Updates to GitHub](#pushing-updates-to-github)
4. [Common Updates](#common-updates)
5. [Troubleshooting](#troubleshooting)

---

## 🛠️ Making Changes Locally

### 1. Pull Latest Changes (if working from different computer)
```bash
git pull origin main
```

### 2. Create a New Branch (Optional but Recommended)
```bash
git checkout -b feature/your-feature-name
# Example: git checkout -b feature/add-new-destination
```

### 3. Make Your Changes
Edit the files you need to update. See [Common Updates](#common-updates) below for examples.

---

## 🧪 Testing Changes

### Start Development Servers
```bash
npm run dev
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3001).

### Test Your Changes
1. Open http://localhost:5173 in your browser
2. Test all functionality affected by your changes
3. Check browser console for errors (F12)
4. Test on mobile view (responsive design)

---

## 📤 Pushing Updates to GitHub

### 1. Check What Changed
```bash
git status
```

### 2. Stage Your Changes
```bash
# Stage all changes
git add .

# Or stage specific files
git add frontend/src/data/itineraries.js
git add backend/routes/chat.js
```

### 3. Commit Your Changes
```bash
git commit -m "Brief description of what you changed"

# Examples:
# git commit -m "Add new Kashmir itinerary"
# git commit -m "Update Gemini model to latest version"
# git commit -m "Fix PDF download button styling"
```

### 4. Push to GitHub
```bash
# If you're on main branch
git push origin main

# If you created a feature branch
git push origin feature/your-feature-name
```

### 5. Create Pull Request (if using feature branch)
1. Go to https://github.com/chinmaycode1/triptuner_with_tripi
2. Click "Pull requests" → "New pull request"
3. Select your feature branch
4. Review changes and create PR
5. Merge when ready

---

## 🎯 Common Updates

### Adding a New Itinerary

**File**: `frontend/src/data/itineraries.js`

```javascript
{
  id: "13",  // Increment from last ID
  title: "Kashmir Valley Paradise",
  route: "Srinagar → Gulmarg → Pahalgam → Srinagar",
  duration: "6 Days",
  groupSize: "2-8",
  category: "Nature",
  emoji: "🏔️",
  image: "https://images.unsplash.com/photo-xxx",  // Find on Unsplash
  highlights: [
    "Shikara ride on Dal Lake",
    "Gulmarg Gondola ride",
    "Betaab Valley visit",
    "Mughal Gardens tour",
    "Local Kashmiri cuisine"
  ],
  budgetTotal: { budget: 20000, mid: 40000, premium: 80000 },
  budgetPerPerson: { budget: 10000, mid: 20000, premium: 40000 },
  description: "Experience the breathtaking beauty of Kashmir...",
  days: [
    {
      day: 1,
      title: "Arrive Srinagar",
      morning: "Arrive at Srinagar airport, transfer to houseboat",
      afternoon: "Shikara ride on Dal Lake",
      evening: "Visit Mughal Gardens",
      stay: "Houseboat on Dal Lake (₹2000-6000/night)"
    },
    // Add more days...
  ]
}
```

**Then commit and push**:
```bash
git add frontend/src/data/itineraries.js
git commit -m "Add Kashmir Valley itinerary"
git push origin main
```

---

### Updating Tripi AI Prompt

**File**: `backend/routes/chat.js`

Find `TRIPI_SYSTEM_PROMPT` and modify:

```javascript
const TRIPI_SYSTEM_PROMPT = `You are Tripi...
// Add or modify instructions here
`;
```

**Commit and push**:
```bash
git add backend/routes/chat.js
git commit -m "Update Tripi AI system prompt"
git push origin main
```

---

### Changing Colors/Theme

**File**: `frontend/src/styles/theme.css`

```css
:root {
  --primary: #7C5CFC;    /* Change this */
  --secondary: #FF4D8D;  /* And this */
}
```

**Commit and push**:
```bash
git add frontend/src/styles/theme.css
git commit -m "Update color scheme"
git push origin main
```

---

### Updating Gemini Model

**File**: `backend/routes/chat.js`

Find the model initialization:

```javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',  // Update this
  systemInstruction: systemPrompt,
});
```

**Commit and push**:
```bash
git add backend/routes/chat.js
git commit -m "Update to Gemini 3.0 model"
git push origin main
```

---

### Adding New API Endpoint

**File**: `backend/routes/yourroute.js` (create new file)

```javascript
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  // Your logic here
  res.json({ message: 'Hello' });
});

module.exports = router;
```

**File**: `backend/index.js` (add route)

```javascript
const yourRoute = require('./routes/yourroute');
app.use('/api/yourroute', yourRoute);
```

**Commit and push**:
```bash
git add backend/routes/yourroute.js backend/index.js
git commit -m "Add new API endpoint"
git push origin main
```

---

## 🐛 Troubleshooting

### Merge Conflicts

If you get merge conflicts:

```bash
# Pull latest changes
git pull origin main

# Git will show conflicted files
# Open them and resolve conflicts (look for <<<<<<, ======, >>>>>>)

# After resolving
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### Forgot to Pull Before Making Changes

```bash
# Stash your changes
git stash

# Pull latest
git pull origin main

# Apply your changes back
git stash pop

# Resolve any conflicts, then commit and push
```

### Want to Undo Last Commit (Not Pushed Yet)

```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes (CAREFUL!)
git reset --hard HEAD~1
```

### Accidentally Committed .env File

```bash
# Remove from git but keep locally
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git commit -m "Remove .env files from git"
git push origin main

# Make sure .gitignore includes .env
```

---

## 📝 Best Practices

1. **Always test locally before pushing**
2. **Write clear commit messages**
3. **Pull before you start working** (if collaborating)
4. **Use feature branches for big changes**
5. **Never commit .env files** (they're in .gitignore)
6. **Keep commits focused** (one feature/fix per commit)
7. **Update README if you add new features**

---

## 🚀 Quick Reference

```bash
# Daily workflow
git pull origin main              # Get latest changes
# Make your changes
npm run dev                       # Test locally
git add .                         # Stage changes
git commit -m "Description"       # Commit
git push origin main              # Push to GitHub

# Check status anytime
git status                        # See what changed
git log --oneline                 # See commit history
git diff                          # See exact changes

# Branch workflow
git checkout -b feature/name      # Create branch
# Make changes
git push origin feature/name      # Push branch
# Create PR on GitHub
# Merge PR
git checkout main                 # Switch back
git pull origin main              # Get merged changes
```

---

## 📞 Need Help?

- Check the main [README.md](README.md) for setup instructions
- Review [Git documentation](https://git-scm.com/doc)
- Check GitHub's [guides](https://guides.github.com/)

---

**Happy Coding! 🎉**
