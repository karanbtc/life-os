# Life OS - 2026 Planner

## ✅ All Issues Fixed!

### 1. Google Sign-In - FIXED
- Added proper error handling
- Force account selection on popup
- Better error messages for popup blocks
- **Action needed**: Add `karanbtc.github.io` to Firebase Authorized domains

### 2. Schedule Editable - FIXED
- ✏️ Edit button on each schedule block
- 🗑️ Delete button on each schedule block
- ＋ Add Block button at top
- Full CRUD operations working

### 3. Habit Tracker Header - FIXED
- Day numbers row now properly aligned
- Sticky header at correct position (top: 56px)
- Icon, Habit, Date columns all aligned
- Mobile responsive with proper column widths

### 4. Mobile Responsive + PWA - FIXED
- Fully responsive on all screen sizes
- PWA manifest.json included
- Service worker for offline support
- Install prompt for "Add to Home Screen"
- Optimized touch targets for mobile
- Horizontal scroll on habit tracker (mobile friendly)

---

## 🚀 Deployment Steps

### NEW: ✨ AI-Powered Goal Assistant

When adding a goal, check the **"✨ AI Assistant"** checkbox and Claude will automatically generate:
1. **Steps** — 5-7 actionable steps to achieve your goal
2. **Schedule Blocks** — Daily time blocks for this goal
3. **Habits** — Relevant daily habits to support this goal  
4. **Weekly Tasks** — Task breakdown across Mon-Sun

**How to use:**
1. Click "＋ Add Goal"
2. Check **✨ AI Assistant** checkbox
3. Fill in: Goal Title, Area, Why (optional), Deadline (optional)
4. Click "Save Goal"
5. Claude generates everything automatically!

**Example:**
- Goal: "Learn Spanish"
- AI generates: Daily Duolingo blocks, "Practice 10 min daily" habit, Weekly tasks like "Learn 20 new words" (Monday), "Watch Spanish show" (Friday), etc.

---

### Step 1: Firebase Setup (One-time)
1. Go to Firebase Console → Authentication → Settings
2. Add to **Authorized domains**: `karanbtc.github.io`
3. Save

### Step 2: Upload to GitHub
1. Go to https://github.com/karanbtc/life-os
2. Upload these 4 files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `README.md` (this file)
3. Commit changes

### Step 3: Test
- Visit: https://karanbtc.github.io/life-os
- Try Google Sign-In (should work now!)
- Test on mobile browser
- Click "Install App" when prompt appears

---

## 📱 PWA Features

- **Offline Support**: Works without internet after first load
- **Install on Phone**: Add to home screen like native app
- **Fast Loading**: Service worker caches files
- **Native Feel**: Standalone mode, no browser UI

---

## 🔧 Tech Stack

- HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- Firebase Authentication (Email + Google OAuth)
- Firestore Database (Real-time sync)
- Progressive Web App (PWA)
- GitHub Pages Hosting

---

## 📊 What Works Now

✅ Multi-user authentication (Email + Google)
✅ Cloud sync across devices
✅ **✨ AI-Powered Goal Assistant** (NEW!)
  - Automatically generates steps for any goal
  - Creates daily schedule blocks
  - Suggests relevant habits
  - Maps weekly tasks
✅ Editable goals (add/edit/delete)
✅ Editable schedule blocks (add/edit/delete)
✅ Editable habits (add/edit/delete)
✅ Monthly habit tracking
✅ Weekly planner
✅ Dark/Light theme
✅ Mobile responsive
✅ PWA (installable app)
✅ Offline support
✅ Real-time database updates

---

## 🐛 Known Issues

None! All reported issues fixed.

---

## 💡 Future Enhancements (Ideas)

- Push notifications for daily reminders
- Data export (CSV/JSON)
- Weekly/Monthly reports
- Goal templates library
- Sharing goals with friends
- Gamification (streaks, badges)

---

**Built with ❤️ for intentional living**
