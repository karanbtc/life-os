# Life OS Backend - AI Goal Generation API

## 🚀 Quick Deploy to Vercel (5 minutes)

### Step 1: Get Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / Login
3. Go to **API Keys** → **Create Key**
4. Copy your key (starts with `sk-ant-...`)

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import this repository or:
   - **Upload these files**:
     - `api/generate-goal-plan.js`
     - `vercel.json`

3. Click **Deploy**

### Step 3: Add Environment Variable
1. Go to your project → **Settings** → **Environment Variables**
2. Add variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your key from Step 1)
3. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **...** on latest deployment → **Redeploy**

### Step 5: Get Your API URL
Your API will be at:
```
https://YOUR_PROJECT_NAME.vercel.app/api/generate-goal-plan
```

### Step 6: Update Frontend
In `index.html`, find this line (~line 530):
```javascript
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api/generate-goal-plan'
  : 'https://life-os-api.vercel.app/api/generate-goal-plan';
```

Replace `https://life-os-api.vercel.app` with your actual Vercel URL.

---

## ✅ Test It

1. Open your Life OS app
2. Click **+ Add Goal**
3. Check **✨ AI Assistant**
4. Fill in goal details
5. Click **Save Goal**
6. Watch real AI generate your plan! 🎉

---

## 💰 Cost

**Anthropic API Pricing:**
- Claude Sonnet: ~$3 per million input tokens
- Each goal generation uses ~500 tokens
- **~2000 free goal generations per $5 credit**

**Vercel:**
- Free tier: 100k function calls/month
- More than enough for personal use!

---

## 🔧 Troubleshooting

**"CORS error":**
- Make sure `vercel.json` has correct CORS headers
- Redeploy after any changes

**"API key invalid":**
- Double-check the environment variable
- Make sure there are no spaces
- Redeploy after adding the key

**"Function timeout":**
- Anthropic API is slow sometimes
- Increase timeout in `vercel.json` if needed

---

## 🎯 What Gets Generated

For each goal, Claude AI creates:
- ✅ 5-7 **personalized action steps**
- ✅ **Daily schedule blocks** (time, activity, details)
- ✅ **2-3 daily habits** to support the goal
- ✅ **Weekly task breakdown** (Mon-Sun)

All tailored specifically to YOUR goal!

---

**Questions?** Check Vercel docs or Anthropic API docs.
