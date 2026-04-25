# ⚡ Quick Reference Card

## 🚀 Start Development

```bash
npm run dev
```
Opens:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 📝 Update & Push Changes

```bash
git add .
git commit -m "Your change description"
git push origin main
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_API_URL=http://localhost:3001
```

---

## 📂 Key Files to Edit

| What to Update | File Location |
|----------------|---------------|
| Add Itinerary | `frontend/src/data/itineraries.js` |
| Change Colors | `frontend/src/styles/theme.css` |
| Update AI Prompt | `backend/routes/chat.js` |
| Add API Route | `backend/routes/` |
| Change Model | `backend/routes/chat.js` (line ~50) |

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3001
Get-NetTCPConnection -LocalPort 3001 | Select -ExpandProperty OwningProcess | Stop-Process -Force
```

### Forgot to Pull
```bash
git stash
git pull origin main
git stash pop
```

### Need to Undo Commit
```bash
git reset --soft HEAD~1  # Keep changes
git reset --hard HEAD~1  # Discard changes
```

---

## 📚 Full Documentation

- **Setup**: README.md
- **Updates**: UPDATING_GUIDE.md
- **Deployment**: DEPLOYMENT_SUMMARY.md

---

## 🔗 Important Links

- **Repo**: https://github.com/chinmaycode1/triptuner_with_tripi
- **Gemini API**: https://aistudio.google.com/app/apikey
- **Supabase**: https://supabase.com/dashboard

---

**Need help? Check UPDATING_GUIDE.md for detailed instructions!**
